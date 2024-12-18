
# DineIn Food E-Commerce App 🍔🛒

A **Food E-Commerce App** built with [Next.js](https://nextjs.org/), offering dynamic menu management, user authentication, category-based browsing, and a responsive UI for seamless user experience.

---

## Features 🚀

- **Dynamic Menu Management**: Manage menus dynamically based on user roles and preferences.
- **Category Management**: Organize menu items into categories for better user navigation.
- **User Authentication**: Secure login/logout and session management with NextAuth.
- **Responsive Design**: Fully responsive UI optimized for mobile and desktop.
- **Error Handling**: Friendly error messages for smooth user experience.

---

## Tech Stack 🛠️

- **Frontend**: [Next.js](https://nextjs.org/), React, TypeScript
- **Backend**: Node.js, Express.js (hosted on [Railway](https://railway.app/))
- **Database**: MongoDB
- **State Management**: Context API
- **Styling**: Tailwind CSS / Styled-Components
- **Authentication**: Session-based authentication with NextAuth

---

## Getting Started 🏗️

### Clone the Repository

```bash
git clone https://github.com/Medcell1/food-ecommerce-fe.git
cd food-ecommerce-fe


### Install Dependencies

```bash
npm install
# or
yarn install
```

### Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
NEXT_PUBLIC_SERVER_URL=https://foodecommercebackend-production.up.railway.app/api/
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

- Replace `NEXT_PUBLIC_SERVER_URL` with the URL for the backend API hosted on Railway.
- `NEXTAUTH_SECRET` is your secure secret for NextAuth (ensure it's kept private).
- `NEXTAUTH_URL` is the base URL for your frontend application.

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---


### Backend Deployment

The backend is hosted on Railway. Ensure the `NEXT_PUBLIC_SERVER_URL` in `.env.local` points to:

```bash
https://foodecommercebackend-production.up.railway.app/api/
```


## License 📜

This project is licensed under the [MIT License](LICENSE).

---

