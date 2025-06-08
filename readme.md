<p align="center">
  <img src="https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png" alt="HTh Beats Logo" width="200"/>
</p>

<h1 align="center">HTh Beats — Backend</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.1.0-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Authentication-JWT-blue" />
  <img src="https://img.shields.io/badge/OAuth-Google-red?logo=google" />
  <img src="https://img.shields.io/badge/Hosted%20on-Azure-blue?logo=microsoftazure" />
  <a href="https://hthbeats.vercel.app">
  <img src="https://img.shields.io/badge/CORS-hthbeats.vercel.app-important" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

---

> 🔗 Live URL: [hthbeats-hnhvgzawb9d6h8h0.centralindia-01.azurewebsites.net](hthbeats-hnhvgzawb9d6h8h0.centralindia-01.azurewebsites.net)

<i>This url only allows requests from our frontend (hthbeats.vercel.app). please do not use this link in your project.</i>

---

## 📄 Description

This is the official backend server for <a href="https://github.com/mahesh548/HTh-Beats-Frontend">**HTh Beats** </a>, a personal portfolio project inspired by Spotify.  
It handles secure authentication, user's activity and profile management, playlists, liked songs, and follows system — all backed by MongoDB and Express.

> This backend **does not handle** media-related content like songs, artists, or playlists — that data is fetched from a separate API service by the frontend.

---

## 🧠 Tech Stack

| Layer          | Tech Used                         |
| -------------- | --------------------------------- |
| Runtime        | Node.js 22.1.0                    |
| Framework      | Express.js                        |
| Database       | MongoDB Atlas (via Mongoose)      |
| Authentication | JWT + Google OAuth                |
| Security       | CORS (`hthbeats.vercel.app` only) |
| Email Service  | Brevo (OTP delivery)              |
| Hosting        | Azure App Services                |

---

## 🚀 Features

- Secure login/signup with JWT authentication
- Google OAuth login support
- Protected user routes with middleware
- Playlist and liked song management
- User activity management
- CORS protected: accepts only frontend requests from `hthbeats.vercel.app`
- Modular structure with MVC pattern
- Database hosted on MongoDB Atlas
- No media processing except user's profile pictures — focused solely on user data and state
- Sends OTPs to users via email using Brevo for verification purposes

---

## 📦 Installation

```bash
#clone the project
git clone https://github.com/mahesh548/HTh-Beats-Backend

# go to directory
cd HTh-Beats-Backend

# install requirements
npm install --force

# boot the server in dev mode
npm run dev

```

---

## 📦 Environment Variables

Create a .env file in the root directory

```bash
ENVIROMENT = "LOCAL"
# "PROD" for production

SECRATE = <Secret_to_sign_JWT>
# must be same as API secret

MY_CLIENT_ID = <Google_client_id_for_OAuth>
# to implement Google Login

LOCAL_DATABASE = "mongodb://localhost:<PORT>/<DATABASE>"
# for local enviroment

PROD_DATABASE = <Atlas_cluster_db_url>
# for production enviroment

FURL = <Frontend_url>
#for CORS

LIKE_ICON = <Like_playlist_cover_image_url>
PLAYLIST_ICON = <Playlist_default_cover_image_url>

ABLY_KEY = <Ably_API_Key>
# for creating music room

CLOUD_NAME = <Cloudinary_cloud_name>
CLOUD_API_KEY = <Cloudinary_API_key>
CLOUD_API_SECRET = <Cloudinary_API_secret>
# cloudinary credentials for uploading user profile pic and creating secure url

BREVO_API_KEY = <BREVO_API_key>
SENDER = <Your_email_adress>
#BREVO credentials to send OTP to users
```

---

## 🧠 What I Learned

This backend project helped me understand how to build a real-world Express server from scratch. I learned how to:

- Set up and manage MongoDB databases using Mongoose

- Implement authentication with JWT, including signing, verifying, and enabling seamless one-time login

- Structure a backend in a clean, modular way — separating routes, controllers, and middleware

- Upload user profile pictures to Cloudinary and generate secure, private image URLs

- Handle user input safely with sanitization and validation

- Send OTP emails using Brevo for account verification

- Integrate Google login using OAuth and extract user details from encrypted payloads

- Perform CRUD operations and manage payloads efficiently

- Protect routes using custom middleware and CORS policies

This project played a big role in building my backend fundamentals and preparing me for full-stack development.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork this repository and submit a pull request.

If you find a bug or want to suggest an improvement, please open an issue.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).  
You're free to use, modify, and distribute this project with proper attribution.
