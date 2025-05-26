# Memory Bank

## Models and Relationships

### User Model
- Has many `items` (owns)
- Has many `lendings` (as borrower)
- Has many `borrowRequests` (as requester)
- Has many `groups` (through `group_user` pivot)
- Has one `profile_image_path` (stored in public disk)

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

### Group Model
- Has many `users` (through `group_user` pivot)
- Has many `items` (through `item_group` pivot)
- Has boolean `approved` on pivot (for user membership)

### BorrowRequest Model
- Belongs to `item`
- Belongs to `requester` (User)
- Has status: pending, approved, denied

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
- Borrow requests have a status flow: pending → approved/denied
- Active lendings are tracked with a null `returned_at` timestamp 