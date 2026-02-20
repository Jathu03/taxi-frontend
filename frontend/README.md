# Casons Taxi Management System (Frontend)

**A modern, responsive frontend for a taxi management system with multiple user roles, dashboards, and analytics. Built with React, Vite, Tailwind 4.1, Chakra UI, React Router, and Chart.js.**

---

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Mock Data](#mock-data)
- [Role-Based Access](#role-based-access)
- [License](#license)

---

## **Project Overview**

This project is a **frontend system for managing taxi operations**.\
It supports multiple user roles, including:

1. **Driver** – manage rides, view earnings
2. **Admin** – manage drivers, view analytics
3. **Manager** – monitor reports and ride performance
4. **Dispatcher** – manage active rides
5. **Support** – handle customer tickets

The project uses **mock data** for development and is ready to be connected to a backend API.

---

## **Features**

-  Multi-role dashboards (Driver, Admin, Manager, Dispatcher, Support)
- Role-based protected routes using React Router
-  Responsive UI using **Chakra UI** + **Tailwind CSS**
-  Charts and analytics using **Chart.js**
-  Modular layouts for each user role
-  Easily extendable for real API integration

---

## **Tech Stack**

- **Frontend Framework:** React (with Vite)
- **UI Library:** Chakra UI
- **CSS Framework:** Tailwind CSS v4.1
- **Routing:** React Router v6
- **Charts & Analytics:** Chart.js + react-chartjs-2
- **State Management:** React Context API (Auth & global state)
- **Data:** Mock/fake data for development

---

## **Folder Structure**

```
src/
 ├─ api/                  # mock API and data
 ├─ assets/               # images/icons
 ├─ components/           # reusable components (Button, Card, Sidebar)
 ├─ contexts/             # React Context (Auth, Theme)
 ├─ layouts/              # role-based layouts (DriverLayout, AdminLayout)
 ├─ pages/                # pages per role and login
 ├─ routes/               # React Router configuration
 ├─ hooks/                # custom hooks
 ├─ charts/               # Chart.js components
 ├─ utils/                # helper functions
 ├─ styles/               # global styles
 ├─ App.jsx               # main app component
 └─ main.tsx              # entry point
```

---

## **Installation**

```bash
# Clone the repository
git clone https://github.com/Keeththi2003/casons-taxi.git
cd casons-taxi

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## **Mock Data**

- Stored in `src/api/mockData.js`
- Example:

```js
export const driverData = {
  name: "John Doe",
  rides: [
    { id: 1, from: "A", to: "B", status: "completed" },
    { id: 2, from: "C", to: "D", status: "ongoing" }
  ],
};
```

- Easily replaceable with real API calls using **React Query** in the future.

---

## **Role-Based Access**

- Implemented via **ProtectedRoute** component
- Each role has a **dedicated layout** and dashboard
- Unauthorized users are redirected to `/login` or `/unauthorized`

Example roles:

| Role       | Accessible Pages                  |
| ---------- | --------------------------------- |
| Driver     | Dashboard, Ride List, Earnings    |
| Admin      | Dashboard, Driver List, Analytics |
| Manager    | Dashboard, Reports                |
| Dispatcher | Dashboard, Active Rides           |
| Support    | Dashboard, Tickets                |

---

## **License**

This project is licensed under the MIT License.
