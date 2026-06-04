# Memory Bank

## Models and Relationships

### User Model
- Has many `items` (owns)
- Has many `lendingsAsBorrower` / `lendingsAsLender`
- Has many `borrowRequests` (as borrower) and `lendRequests` (as lender)
- Has many `groups` (through `group_user` pivot, with `approved` + timestamps)
- Has many `conversationsAsOne` / `conversationsAsTwo` and `sentMessages`
- Has one `profile_image_path` (stored in public disk)
- Has boolean `email_on_message` (cast bool, default true) — gates message emails

### Item Model
- Belongs to `user` (owner)
- Has many `lendings`
- Has many `borrowRequests`
- Has many `groups` (through `item_group` pivot)
- Has one `currentBorrower` (through active lending)
- Has one `image_path` (stored in public disk)

### Lending Model
- Belongs to `item`
- Belongs to `borrower` (User)
- Has one `activeLending` scope (where returned_at is null)
- `due_at` (nullable datetime) — agreed return date, drives return reminders

### Group Model
- Has many `users` (through `group_user` pivot)
- Has many `items` (through `item_group` pivot)
- Has boolean `approved` on pivot (for user membership)

### BorrowRequest Model
- Belongs to `item`, `lender`, `borrower`
- Status: pending, approved, denied, completed, expired, **countered**
- Return-date negotiation fields (all nullable datetime):
  - `requested_due_at` — borrower's requested return date (required at creation)
  - `proposed_due_at` — lender's shorter counter-offer
  - `agreed_due_at` — final agreed date, copied to `Lending.due_at` on handover
- `isCountered()` helper; `countered` means awaiting borrower's accept/decline

### Conversation Model (1:1 messaging)
- `user_one_id` < `user_two_id` (stable order, unique index per pair)
- Has many `messages`; `last_message_at` for sorting
- `Conversation::between($a, $b)` finds/creates the single conversation
- Helpers: `scopeForUser`, `otherParticipant($user)`, `hasParticipant($id)`

### Message Model
- Belongs to `conversation` and `sender` (User)
- `body` text, `read_at` nullable (marked read when recipient opens the thread)

## Key Relationships Usage

### Item Availability
```php
// Check if item is available
$item->isAvailable() // Returns true if no active lending exists

// Get current borrower
$item->currentBorrower // Returns User model of current borrower or null
```

### User Items
```php
// Get user's owned items
$user->items

// Get items user is currently borrowing
$user->borrowedItems()->whereHas('activeLending')

// Get user's groups
$user->groups
```

### Group Membership
```php
// Check if user is approved in group
$group->users()->where('user_id', $userId)->first()->pivot->approved

// Get group's items
$group->items
```

## Common Queries

### Profile Page
```php
// Load user's items with current borrower
$user->load(['items' => function ($query) {
    $query->with(['currentBorrower:id,name,profile_image_path'])
        ->latest()
        ->take(12);
}]);

// Get items user is borrowing
$user->borrowedItems()
    ->with(['user:id,name,profile_image_path'])
    ->whereHas('activeLending')
    ->latest()
    ->take(12);
```

### Group Page
```php
// Load group with users and their approval status
$group->load(['users' => function ($query) {
    $query->select('users.id', 'users.name', 'users.email', 'users.profile_image_path', 'group_user.approved');
}]);

// Get recent items in group
$group->items()
    ->with(['user:id,name,profile_image_path'])
    ->latest()
    ->take(12);
```

## File Storage

### Profile Images
- Stored in: `public/storage/profile-images/`
- Accessed via: `/storage/profile-images/{filename}`
- Updated through: `ProfileController@updateImage`

### Item Images
- Stored in: `public/storage/item-images/`
- Accessed via: `/storage/item-images/{filename}`
- Updated through: `ItemController@update`

## Common UI Patterns

### User Avatar Display
```jsx
<Avatar
    src={user.profile_image_path ? `/storage/${user.profile_image_path}` : undefined}
    alt={user.name}
    sx={{
        bgcolor: !user.profile_image_path ? stringToColor(user.name) : undefined,
    }}
>
    {!user.profile_image_path && user.name.charAt(0).toUpperCase()}
</Avatar>
```

### Item Card
- Shows item image
- Displays owner info
- Shows current borrower if item is borrowed
- Shows availability status
- Provides action buttons based on item status and user role

## Notes
- All user-related images are stored in the public disk
- Item availability is determined by the absence of an active lending
- Group membership requires approval (stored in pivot table)
- Borrow request status flow: pending → approved/denied/**countered** → completed/expired
- Active lendings are tracked with a null `returned_at` timestamp; `due_at` holds the agreed return date

## Authenticated Layout & Navigation
- `Layouts/AuthenticatedLayout.tsx`: persistent left sidebar (desktop) + temporary `Drawer` (mobile), sticky top bar with search trigger, Messages icon (unread badge), notifications, language switcher, user menu. Accepts `user`, optional `header`, and `children`.
- `Components/Sidebar.tsx` (`SIDEBAR_WIDTH = 264`): grouped nav (Overview / My stuff / Community) mapped to existing routes, badge counts, and a "List an item" CTA. Active route via Ziggy `route().current()`.
- Child pages open the full-page search overlay by dispatching `window.dispatchEvent(new Event('aconomy:open-search'))`.

## Global Search (items + groups + people)
- Route `search.global` → `SearchController@index` returns `{ query, items, groups, people }`.
- Items: `Item::search($q)` (Scout) for relevance, then constrained to the user's approved groups + excluding own items via real relations (works in Meilisearch and the Scout `collection` test driver).
- Groups: name/description `LIKE`. People: scoped to users sharing an **approved** group (privacy). Use `where('group_user.approved', true)` inside `whereHas` (NOT `wherePivot`).
- `Components/GlobalSearchOverlay.tsx`: full-page, debounced (300ms) search-as-you-type, sectioned results, Esc to close.

## Due-Date Negotiation
- `BorrowRequestController`: `store` requires `requested_due_at`; `approve` sets `agreed_due_at = requested_due_at`; `counter` (lender, must be `before_or_equal` requested) → `countered`; `acceptCounter`/`declineCounter` (borrower, gated by `respondToCounter` policy); handover copies `agreed_due_at` to `Lending.due_at`.
- Routes: `borrow-requests.counter`, `.accept-counter`, `.decline-counter`.
- `BorrowRequestCounteredNotification` (mail/database/broadcast) points the borrower to the request.
- Frontend: date picker in `BorrowRequests/Create`, negotiation UI in `Show`, dates + `countered` status in `Index`. Helper `utils/dueDate.ts` → `dueInfo()` (severity + relative key).

## Messaging
- Routes: `messages.index`, `messages.show` (`{conversation}`), `messages.store`, `messages.start/{user}`.
- `MessageController`: marks incoming messages read on view; `store` notifies recipient via `NewMessageNotification` (email only when `recipient.email_on_message`).
- Frontend: `Pages/Messages/Index.tsx` (conversation list + unread badges), `Show.tsx` (chat thread). Entry points: top-bar icon, profile "Message {name}", dashboard return reminder. Preference toggle in `Profile/Partials/NotificationPreferencesForm.tsx`.

## Dashboard & Shared Props
- `DashboardController` returns items, groups, lendings, borrowings, `incomingRequests` (pending), and `recentActivity` (latest 6 notifications).
- `Dashboard.tsx`: stat cards, inline approve/decline of incoming requests, "You're borrowing" with due chips, gradient return-reminder card, groups, recent activity.
- `OnboardingEmptyState.tsx`: 3-step guidance shown when the user has **no items and no approved groups**.
- `HandleInertiaRequests@share` exposes `badges` (incomingRequests, activeBorrowings, unreadMessages, unreadNotifications) for guests-safe sidebar/top-bar counts.

## Notifications
- All notification classes implement `ShouldBroadcast` and use `['mail','database','broadcast']` (message email is conditional). `toArray` includes `title`, `body`, and `url`.
- `NotificationMenu` default case renders any notification with `title`/`body`/`url`, so `new_message` (→ `/messages/{id}`) and `borrow_request_countered` (→ `/borrow-requests/{id}`) route correctly.

## i18n
- Keys live in `resources/js/locales/{en,es,de}.json`. `en` is the source of truth; keep `es`/`de` in parity. Namespaces include `navigation`, `search`, `messages`, `onboarding`, `dashboard`, `borrowRequests`, `lendings`, `profile`. Preserve interpolation placeholders (`{{name}}`, `{{count}}`, `{{date}}`, etc.).

## Testing Notes
- `phpunit.xml` sets `SCOUT_DRIVER=collection` and `BROADCAST_CONNECTION=null` so tests avoid Meilisearch/broadcast network calls.
- Feature tests: `BorrowRequestNegotiationTest`, `MessagingTest`, `GlobalSearchTest`. Factories: `ConversationFactory`, `MessageFactory`. 