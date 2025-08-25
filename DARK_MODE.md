# Dark Mode Implementation Plan

This document outlines the comprehensive plan for implementing dark mode across all components and pages in the Aconomy application that use the AuthenticatedLayout.

## Excluded Files
The following files use GuestLayout and already have dark mode support, so they are excluded from this plan:
- All files in `resources/js/Pages/Auth/` (Login, Register, etc.)
- `resources/js/Pages/Welcome.jsx`
- `resources/js/Layouts/GuestLayout.jsx`

## Implementation Strategy
- Use Material-UI's theme system for consistent dark mode support
- Apply glassmorphism effects for dark mode (semi-transparent backgrounds with blur)
- Ensure proper contrast and accessibility
- Maintain consistent styling with the Welcome page aesthetics

---

## Components (Priority: High)

### Task 1: Form Input Components
**Files:**
- `resources/js/Components/TextInput.jsx`
- `resources/js/Components/InputLabel.jsx`
- `resources/js/Components/InputError.jsx`
- `resources/js/Components/Checkbox.jsx`

**Description:** Update Tailwind-based form components to support dark mode by adding dark: classes or converting to Material-UI components with theme support.

**Changes needed:**
- Add dark mode variants for borders, backgrounds, and text colors
- Ensure proper focus states in dark mode
- Update error message colors for dark backgrounds

### Task 2: Button Components
**Files:**
- `resources/js/Components/SecondaryButton.jsx`
- `resources/js/Components/DangerButton.jsx`

**Description:** Update button components to use theme-aware styling and ensure proper contrast in dark mode.

**Changes needed:**
- Convert to Material-UI or add theme-aware styling
- Ensure hover and focus states work in dark mode
- Maintain accessibility standards

### Task 3: Modal and Dialog Components
**Files:**
- `resources/js/Components/Modal.jsx`

**Description:** Update modal component to use glassmorphism effects in dark mode, matching the overall design aesthetic.

**Changes needed:**
- Apply semi-transparent dark backgrounds
- Add backdrop blur effects
- Ensure content has proper contrast

### Task 4: Interactive Components
**Files:**
- `resources/js/Components/Dropdown.jsx`
- `resources/js/Components/ProfileImageUpload.jsx`
- `resources/js/Components/GroupItemSearch.jsx`
- `resources/js/Components/GroupItemSearchUnavailable.jsx`

**Description:** Update interactive components to support dark mode with proper theming and visual feedback.

**Changes needed:**
- Apply theme-aware backgrounds and borders
- Update hover and active states
- Ensure proper contrast for text and icons

### Task 5: Navigation Components
**Files:**
- `resources/js/Components/NavLink.jsx`
- `resources/js/Components/ResponsiveNavLink.jsx`

**Description:** Update navigation components to match the AuthenticatedLayout's dark mode styling.

**Changes needed:**
- Apply consistent hover and active states
- Ensure proper contrast with dark backgrounds
- Match the glassmorphism aesthetic

---

## Pages (Priority: Medium-High)

### Task 6: Dashboard Page
**Files:**
- `resources/js/Pages/Dashboard.jsx`

**Description:** Update the main dashboard to ensure all cards, stats, and content areas support dark mode with glassmorphism effects.

**Changes needed:**
- Update Card components with dark mode backgrounds
- Ensure proper contrast for text and icons
- Apply glassmorphism effects to cards
- Update chart/data visualization colors if any

### Task 7: Items Management Pages
**Files:**
- `resources/js/Pages/Items/Index.jsx`
- `resources/js/Pages/Items/Create.jsx`
- `resources/js/Pages/Items/Edit.jsx`
- `resources/js/Pages/Items/Show.jsx`
- `resources/js/Pages/Items/GroupItems.jsx`

**Description:** Update all item-related pages to support dark mode, ensuring forms, cards, and image displays work properly.

**Changes needed:**
- Update form styling for dark backgrounds
- Apply glassmorphism to item cards
- Ensure image placeholders work in dark mode
- Update action buttons and status indicators

### Task 8: Groups Management Pages
**Files:**
- `resources/js/Pages/Groups/Index.jsx`
- `resources/js/Pages/Groups/MyGroups.jsx`
- `resources/js/Pages/Groups/Create.jsx`
- `resources/js/Pages/Groups/Show.jsx`

**Description:** Update group management pages to support dark mode with consistent card styling and form elements.

**Changes needed:**
- Apply glassmorphism to group cards
- Update member list styling
- Ensure form elements have dark mode support
- Update group icons and avatars for dark backgrounds

### Task 9: Groups Partial Components
**Files:**
- `resources/js/Pages/Groups/Partials/GroupItemSearch.jsx`
- `resources/js/Pages/Groups/Partials/GroupMemberList.jsx`
- `resources/js/Pages/Groups/Partials/RecentItemsGrid.jsx`

**Description:** Update group partial components to match the dark mode aesthetic with proper card styling and layouts.

**Changes needed:**
- Apply theme-aware card backgrounds
- Update grid layouts for dark mode
- Ensure search components work with dark styling
- Update member list styling

### Task 10: Borrow Requests Pages
**Files:**
- `resources/js/Pages/BorrowRequests/Index.jsx`
- `resources/js/Pages/BorrowRequests/Create.jsx`
- `resources/js/Pages/BorrowRequests/Show.jsx`

**Description:** Update borrow request management to support dark mode, including status indicators and forms.

**Changes needed:**
- Update status chips and indicators for dark mode
- Apply glassmorphism to request cards
- Ensure forms have proper dark mode styling
- Update QR code dialogs and verification components

### Task 11: Lendings Pages
**Files:**
- `resources/js/Pages/Lendings/Index.jsx`
- `resources/js/Pages/Lendings/Show.jsx`
- `resources/js/Pages/Lendings/RequestBorrow.jsx`

**Description:** Update lending management pages to support dark mode with proper card styling and status indicators.

**Changes needed:**
- Apply glassmorphism to lending cards
- Update status indicators and chips
- Ensure dialogs and forms work in dark mode
- Update date/time displays for proper contrast

### Task 12: Profile Pages
**Files:**
- `resources/js/Pages/Profile/Edit.jsx`
- `resources/js/Pages/Profile/Show.jsx`

**Description:** Update profile management pages to support dark mode with proper form styling.

**Changes needed:**
- Update profile forms for dark mode
- Ensure image uploads work with dark styling
- Apply consistent card styling

### Task 13: Profile Partial Components
**Files:**
- `resources/js/Pages/Profile/Partials/DeleteUserForm.jsx`
- `resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx`
- `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx`

**Description:** Update profile form components to support dark mode with proper form element styling.

**Changes needed:**
- Update form styling for dark backgrounds
- Ensure proper error message styling
- Update button styling for consistency

### Task 14: Notifications Page
**Files:**
- `resources/js/Pages/Notifications/Index.jsx`

**Description:** Update notifications page to support dark mode with proper list styling and status indicators.

**Changes needed:**
- Apply glassmorphism to notification cards
- Update read/unread indicators
- Ensure proper contrast for text and timestamps

---

## Priority and Implementation Order

### Phase 1 (High Priority - Core Components)
1. Task 1: Form Input Components
2. Task 2: Button Components  
3. Task 3: Modal and Dialog Components

### Phase 2 (Medium Priority - Main Pages)
4. Task 6: Dashboard Page
5. Task 7: Items Management Pages
6. Task 8: Groups Management Pages

### Phase 3 (Lower Priority - Detailed Components)
7. Task 4: Interactive Components
8. Task 5: Navigation Components
9. Task 9: Groups Partial Components

### Phase 4 (Final Polish)
10. Task 10: Borrow Requests Pages
11. Task 11: Lendings Pages
12. Task 12: Profile Pages
13. Task 13: Profile Partial Components
14. Task 14: Notifications Page

---

## Design Principles

1. **Glassmorphism Effect**: Use `rgba(255, 255, 255, 0.02)` backgrounds with `backdrop-filter: blur(10px)`
2. **Consistent Borders**: Use `rgba(255, 255, 255, 0.1)` for borders in dark mode
3. **Proper Contrast**: Ensure all text meets accessibility standards
4. **Theme Integration**: Leverage Material-UI's theme system for consistency
5. **Animation Continuity**: Maintain the gradient background animations from the Welcome page

---

## Notes
- Each task should be implemented incrementally
- Test each component in both light and dark modes
- Ensure accessibility standards are maintained
- Consider adding transition animations for theme switching
- Some components may need conversion from Tailwind to Material-UI for better theme integration
