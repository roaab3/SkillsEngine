# 🚀 הוראות פריסה - Skills Engine

## 📋 רשימת בדיקה לפני הפריסה

### ✅ קבצים נדרשים
- [x] `railway.json` - קובץ תצורת Railway
- [x] `backend/railway.toml` - תצורת Railway עבור Backend
- [x] `frontend/vercel.json` - תצורת Vercel עבור Frontend
- [x] `.github/workflows/deploy.yml` - GitHub Actions workflow
- [x] `.gitignore` - קבצים להתעלמות
- [x] `backend/.gitignore` - קבצים להתעלמות Backend
- [x] `frontend/.gitignore` - קבצים להתעלמות Frontend

### ✅ קבצי Package.json
- [x] `backend/package.json` - עם scripts נדרשים
- [x] `frontend/package.json` - עם scripts נדרשים

### ✅ קבצי תצורה
- [x] `backend/tsconfig.json` - תצורת TypeScript
- [x] `frontend/tsconfig.json` - תצורת TypeScript
- [x] `frontend/next.config.js` - תצורת Next.js
- [x] `frontend/tailwind.config.js` - תצורת Tailwind CSS

## 🔧 שלבי הפריסה

### 1. הכנת הפרויקט
```bash
# וידוא שהכל עובד מקומית
cd backend
npm ci
npm run build
npm test

cd ../frontend
npm ci
npm run build
```

### 2. הגדרת GitHub Secrets
הוסף את הסודות הבאים ב-GitHub Repository → Settings → Secrets and variables → Actions:

```
RAILWAY_TOKEN          # Token מ-Railway
VERCEL_TOKEN           # Token מ-Vercel
DATABASE_URL           # כתובת מסד הנתונים (אופציונלי)
BACKEND_URL            # URL של ה-Backend (לאחר הפריסה)
FRONTEND_URL           # URL של ה-Frontend (לאחר הפריסה)
```

### 3. יצירת חשבונות

#### Railway (Backend)
1. לך ל-[railway.app](https://railway.app)
2. התחבר/הירשם
3. צור פרויקט חדש
4. Account Settings → Tokens → Create Token
5. העתק את ה-Token

#### Vercel (Frontend)
1. לך ל-[vercel.com](https://vercel.com)
2. התחבר/הירשם
3. Account Settings → Tokens → Create Token
4. העתק את ה-Token

### 4. Push ל-GitHub
```bash
# הוסף את כל הקבצים
git add .

# Commit
git commit -m "feat: add deployment configuration for Railway and Vercel"

# Push ל-main branch
git push origin main
```

### 5. בדיקת הפריסה
לאחר ה-push, GitHub Actions יתחיל לפרוס אוטומטית:

1. **Backend** יפורס ל-Railway
2. **Frontend** יפורס ל-Vercel
3. **Health Checks** יבדקו שהכל עובד

## 🔍 בדיקות לאחר הפריסה

### Backend Health Check
```
GET https://your-railway-app.railway.app/health
```

### Frontend
```
GET https://your-vercel-app.vercel.app
```

## 🛠️ פתרון בעיות

### שגיאות Build
- בדוק את הלוגים ב-Railway/Vercel dashboards
- וודא שכל ה-dependencies מותקנים
- בדוק שגיאות TypeScript

### שגיאות Environment Variables
- וודא שכל ה-Secrets מוגדרים ב-GitHub
- בדוק שה-Variables מוגדרים ב-Railway/Vercel

### שגיאות Database
- וודא שה-DATABASE_URL נכון
- בדוק חיבור למסד הנתונים

## 📞 תמיכה
- Railway: https://railway.app/help
- Vercel: https://vercel.com/help
- GitHub Actions: https://docs.github.com/en/actions

---

**✅ הפרויקט מוכן לפריסה!**
