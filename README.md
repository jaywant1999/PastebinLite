# PastebinLite

This is a assignment project

PastebinLite is a lightweight paste-sharing application inspired by Pastebin.  
It allows users to create text pastes with optional **expiry time (TTL)** and **view limits**, backed by **Upstash Redis** and deployed on **Vercel** using **Node.js & Express**.

---

## Features

- Create text pastes via REST API
- Optional time-based expiration (TTL)
- Optional maximum view limits
- Serverless Redis storage using Upstash
- Fast & scalable (Vercel Serverless Functions)
- simple HTML frontend
- Health check endpoint

---

##  Tech Stack

- **Backend**: Node.js, Express
- **Database**: Upstash Redis (REST-based)
- **Frontend**: HTML, CSS (Tailwind-ready)
- **Deployment**: Vercel
- **Utilities**: UUID, dotenv

---

##  Project Structure
PastebinLite/
│
├── server.js
├── vercel.json
├── package.json
├── README.md
│
├── public/
  ├── index.html
  ├── view.html

## Clone Repository
git clone https://github.com/jaywant1999/PastebinLite.git

## Add Project
cd PasteBinLite

## Install dependencies
npm install

## setup env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url  |  
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

## Start the server
npm start
