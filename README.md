# BLUEBERRY MOBILE APP

This is an application created for private use, the purpose of which is to facilitate the management of our family blueberry orchard.

It's an **_React Native_** app created in **_[Expo](https://docs.expo.dev/ "Go to expo docs.")_** with role base authentication. This uses a **private weather** station **_API_** to present current weather conditions and forecasts.
Application is published as mobile and web app.

## Technologies used

- `expo`
- `expo-router`
- `tailwindcss` with _`nativewind`_ and _`twrnc`_
- `typescript`
- `appwrite` as a backend (_Auth_ and _Database_)
- `zod` for validation
- `axios` for data fetching
- `date-fns` for handling dates
- `shopify/flash-list` for handling big lists
- `react-native-google-signin/google-signin` for mobile and `react-oauth/google` for web

### Screenshots

![Login page](/screenshots/login-page.jpg "Login page")

![Sign up page](/screenshots/signup-page.jpg "Sign up page")

![Account inactive](/screenshots/account-inactive.jpg "Account inactive page")

![Side menu](/screenshots/side-menu.jpg "Side menu")

![Orders page](/screenshots/orders-page.jpg "Orders page")

![Orders page - simplified](/screenshots/orders-page-simplified-view.jpg "Orders page in simplified view")

![Add/edit order](/screenshots/add-order-bottom-sheet.jpg "Add/edit order bottom sheet")

![Edit order in simplified view](/screenshots/orders-page-edit-simplified-view.jpg "Edit order in simplified view")

![Buyers modal](/screenshots/buyers-modal.jpg "Modal with all user's buyers in bottom sheet select buyer input")

![Order options](/screenshots/orders-option-bottom-sheet.jpg "Bottom sheet with order options")

![Search](/screenshots/search-orders.jpg "Search options")

![Search - admin access](/screenshots/search-orders-with-access.jpg "Search options for admin")

![Calendar](/screenshots/modal-calendar.jpg "Calendar modal")

![Search user](/screenshots/modal-search-for-user.jpg "Search user modal")

![Delete confirmation](/screenshots/modal-delete-confirmation.jpg "Delete order confirmation modal")

![Edit price](/screenshots/modal-edit-price.jpg "Edit current price modal")

![Edit order price](/screenshots/modal-edit-order-price.jpg "Edit order price modal")

![Weather Page](/screenshots/weather-page.jpg "Weather page")

![Settings page](/screenshots/settings.jpg "Settings page")

![Settings page - edit user data](/screenshots/settings-page-input-error-message.jpg "Edited user's username with invalid data")

![Settings page- edit user email](/screenshots/modal-email-update-error-message.jpg "Edited user's email with invalid password confirmation")

![Light mode](/screenshots/settings-light-mode.jpg "Settings page in Light Mode")

![Settings page - edit user avatar](/screenshots/modal-edit-user-avatar.jpg "Edited user's avatar")

![Toast notification 1](/screenshots/toast-notification-order-completed.jpg "Toast notification for changed order's completed status")

![Toast notification 2](/screenshots/toast-notification-order-edited.jpg "Toast notification for successfully edited order")
