# ShopSphere — Beauty E-Commerce Website

A responsive React + Vite beauty-shopping storefront demo. It includes product browsing, category filters, search, sorting, product details, wishlist, cart, demo sign-in, Cash on Delivery checkout, order history and a demo admin dashboard.

## Run locally

1. Install Node.js (LTS) and VS Code.
2. Extract this ZIP.
3. Open the extracted `shopsphere-ready` folder in VS Code.
4. Open the `client` folder in VS Code, then open Terminal and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually http://localhost:5173).

## Demo notes

- Demo sign-in accepts any valid email and any password of at least 4 characters. It is a front-end demonstration only.
- Cart, wishlist, demo user, products and orders persist in the browser using localStorage.
- The Admin dashboard is available from the footer. It supports demo product creation/deletion and order-status changes.
- Product images are loaded from Unsplash, so an internet connection is needed for those images and Google Fonts.
- This delivery is the **React frontend demo**, not a production-secure MERN deployment. MongoDB, Express APIs, server-side authentication, payment gateway, real email/SMS and production admin authorization still need to be connected for the backend phase.

## Main structure

```text
shopsphere-ready/
├── README.md
└── client/
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── style.css
```
