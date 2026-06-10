# Deployment Guide — AquaSense AI

## 1. MongoDB Atlas Setup
1. Create free cluster at mongodb.com/atlas
2. Add database user (username + password)
3. Allow IP `0.0.0.0/0` in Network Access
4. Copy connection string → MONGO_URI

## 2. Render — Backend
1. Connect GitHub repo
2. New Web Service → root: `backend/`
3. Build: `npm install`   Start: `node server.js`
4. Env vars: MONGO_URI, JWT_SECRET, AI_SERVICE_URL, CLIENT_URL

## 3. Render — AI Service
1. New Web Service → root: `ai-service/`
2. Build: `pip install -r requirements.txt`
3. Start: `gunicorn app:app`
4. Copy URL → use as AI_SERVICE_URL in backend

## 4. Vercel — Frontend
1. Import GitHub repo to Vercel
2. Framework: Vite
3. Root: `frontend/`
4. Build: `npm run build`   Output: `dist`
5. Env: VITE_API_URL=https://your-backend.onrender.com/api

## Sample CSV format for import
```
date,liters,location,department,notes
2026-06-01,2840,Block A,Facilities,Morning reading
2026-06-02,3100,Cafeteria,Cafeteria,Lunch peak
```
