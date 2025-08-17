# Roxiler assignment for fullstack developer intern
---

## description
We need a web application that allows users to submit ratings for stores registered on the
platform. The ratings should range from 1 to 5.
A single login system should be implemented for all users. Based on their roles, users will
have access to different functionalities upon logging in.
Normal users should be able to sign up on the platform through a registration page.
---

## tech stack
- Node js , express js prisma ORM with postgresql , docker (optional for database)
- React js , Tailwind css , shadcn ui

## Installation

### Clone the repository
```bash
git clone https://github.com/dhananjaykakade/roxiler-assignment
cd roxiler-assignment
```

---
### root folder
```bash
npm install 
```

### roxiler fronend folder
```bash
cd roxlier-frontend
 npm install
```

### add .env to frontend folder with this vars
```env
VITE_API_URL=http://localhost:{yourPORT}
```
---
### server folder
```bash
cd server
 npm install
```
### Start PostgreSQL with Docker Compose (optional) you can use you database 

```bash
docker compose up -d
```
### create .env file to server folder and copy the following vars 
```env
DATABASE_URL="postgresql://postgress:postgress@localhost:8090/roxilerDB?schema=public"
PORT=5000
JWT_SECRET=your-secret-key
```

### generate the prismam client (optional)
```bash
npx prisma generate 
```

### migrate database to create tables using prisma 
```bash
npx prisma migrate dev
```
---
### go to root directory 
```bash
npm run dev
```
