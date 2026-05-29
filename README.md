# Kabir Mahmud Portfolio

Node.js portfolio site built with Express, EJS, MongoDB, and Cloudinary.

## Features

- Home, about, projects, contact, social, blog, resources, shop, and books pages
- Desktop top menu with an `Others` dropdown
- Mobile hamburger navigation
- Admin authentication with role-based access
- CRUD for projects, blog posts, social links, products, books, and resources
- Contact form submissions stored in MongoDB
- Cloudinary uploads for featured images
- Dark, modern, glassy UI with GSAP-enhanced entrance animation

## Local setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev` or `npm start`.

## Admin setup

<<<<<<< HEAD
add admin password in your .env file
=======
The default admin account is created automatically from your environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
>>>>>>> 97ac830 (Initial portfolio implementation)

Open `/inlog` to sign in.

If you want to create a different admin user first, open `/admin/setup` before the default account is used.

## Admin panel

The admin dashboard lets you manage:

- Site settings
- Contact settings
- Projects
- Blog posts
- Social links
- Products
- Books
- Resources
- Contact messages

## Vercel deployment

- Set the environment variables in the Vercel project settings.
- Deploy the repository directly to Vercel.
- The Express app is exposed through `api/index.js` for serverless deployment.

## Notes

- MongoDB is the primary database.
- Cloudinary stores uploaded media assets.
- The site uses EJS templates rather than React, per your preference.
