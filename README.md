# Notification System Project README

## This Progressive Web App is live at [https://event-hub-unify.vercel.app/](https://event-hub-unify.vercel.app/)

## Overview

This project implements a notification system using React, Firebase, and Tailwind CSS. It allows users to receive and send notifications within a dashboard environment.

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Firebase:** A backend-as-a-service platform for user authentication, data storage (Firestore), and more.
* **Tailwind CSS:** A utility-first CSS framework for styling.
* **Lucide React:** A library of beautiful SVG icons.
* **date-fns:** A modern JavaScript date utility library.
* **react-router-dom:** For client-side routing.
* **@/components/ui:** Custom UI components built with Radix UI and Tailwind CSS.
* **@/context/AuthContext:** Custom authentication context.
* **@/services/notificationService:** Custom service for interacting with notifications in Firebase.

## Project Structure

```
notification-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── use-toast.jsx
│   │   │   └── ... (other UI components)
│   │   └── ... (other components)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Notifications.jsx
│   │   └── SendNotification.jsx
│   ├── services/
│   │   └── notificationService.js
│   ├── firebase.js
│   ├── main.jsx          // Entry point of the React application
│   ├── App.jsx           // Main App component with routing
│   ├── index.css         // Global CSS styles
│   ├── assets/           // Images, icons, or other static assets
│   │   └── ...
│   └── ... (other source files)
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── vite.config.js       // Vite configuration, if using Vite
└── tsconfig.json      // TypeScript configuration
```

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd [project directory]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase:**

    * Create a Firebase project on the Firebase console.
    * Enable Firestore and Authentication.
    * Copy your Firebase configuration object into `src/firebase/config.js`.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

.

