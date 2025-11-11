# Islamic College Attendance System - Frontend
# Vercel Deployment Guide

## Quick Deploy to Vercel

### Method 1: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy Islamic College frontend"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com/
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

3. **Vercel Configuration**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables** (Add in Vercel Dashboard):
   ```
   VITE_API_URL = https://islamic-college-backend.onrender.com
   ```

5. **Deploy**: Click "Deploy"

### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up project: Y
# - Link to existing project: N
# - Project name: islamic-college-frontend
# - Directory: ./
# - Override settings: N
```

## Your Frontend URL will be:
`https://islamic-college-frontend.vercel.app`

---

## Default Login Credentials:
- **👑 Admin**: admin@college.com / password123
- **👨‍🏫 Teacher**: teacher@college.com / password123  
- **👨‍🎓 Student**: STU001 / password123

## Features Available:
✅ User Management  
✅ Attendance Tracking  
✅ Grade Management  
✅ AI Predictions  
✅ Smart Chatbot  
✅ Islamic & School Subjects  
✅ Automated Reports  
✅ Role-based Dashboards  

---

## Post-Deployment:
1. Test all login credentials
2. Verify API connectivity
3. Test AI features
4. Generate sample reports