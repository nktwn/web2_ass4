# Anime Catalog Project

## Introduction

Welcome to the Anime Catalog Project! This application is a comprehensive platform for anime enthusiasts offering a rich, interactive, and multilingual experience.

## Features

### Anime Catalog
- **Design:** The catalog features an engaging design using EJS and CSS. Banners for existing and new items are centered in containers of uniform width, separated by dividers, and maintaining a consistent style and color scheme.
- **Responsive Design:** The layout is fully responsive, ensuring a seamless experience across various devices.
- **Content:** Each anime banner can include more than one  images descriptions, and timestamps for creation, updates, and deletion.
- **Layout:** The homepage showcases these items in well-thought-out blocks, each with a carousel displaying the images and details like the name and description.
- **API Integration:** Two different APIs related to anime are integrated for dynamic content.

### Admin Features
- **Content Management:** Admins can add, edit, or delete anime items from the main page.
- **User-friendly Interface:** The admin page is designed for ease of use while managing content.
```
Login: Nurkhat
Password: 1234567
```

### User Registration
- **Extended Information:** The registration process captures comprehensive user information.
- **Password Security:** User passwords are hashed using bcrypt before storage for enhanced security.

### Authentication
- **Password Verification:** Passwords are retrieved in hashed form and compared with the database hash.
- **Authorization Checks:** Routes requiring certain permissions have integrated authorization checks.
- **Admin Username:** The admin username is uniquely tied to the project creator’s name.

### Middleware for Authentication
- **Route Protection:** Middleware is implemented to protect routes that require authentication.
- **Session Token Verification:** The middleware checks for session tokens or other authentication mechanisms.
- **Redirection:** Unauthenticated users are redirected to the login page.


## Getting Started
- **Installation:** Download the project using the command `https://github.com/nktwn/web2_ass4.git` or download it from github.
- **Running the Application:** After opening the project, enter the `node app.js` command and go to localhost 3000.
