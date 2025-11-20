# Environment Variables - Quick Reference

מדריך מהיר להגדרת משתני סביבה עבור Railway (Backend) ו-Vercel (Frontend).

## 🔴 משתנים קריטיים לחיבור Frontend-Backend

### Railway (Backend) - חובה!
```bash
FRONTEND_URL=https://your-app.vercel.app,https://*.vercel.app
```
**זה המשתנה הכי חשוב!** ללא זה, ה-frontend לא יוכל להתחבר ל-backend בגלל CORS.

### Vercel (Frontend) - חובה!
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```
**זה המשתנה הכי חשוב!** זה אומר ל-frontend איפה ה-backend נמצא.

## 📋 רשימה מלאה

### Railway (Backend)

#### חובה:
- `DATABASE_URL` - כתובת ה-Supabase
- `FRONTEND_URL` - כתובת ה-Vercel (מופרדת בפסיקים אם יש כמה)
- `NODE_ENV=production`
- `PORT=8080`
- `JWT_SECRET` - מפתח JWT מאובטח

#### אופציונלי:
- `GEMINI_API_KEY` - מפתח ל-Google Gemini AI
- `LOG_LEVEL=info`
- משתני מיקרו-שירותים (אם נדרש)

### Vercel (Frontend)

#### חובה:
- `NEXT_PUBLIC_API_URL` - כתובת ה-Railway backend

#### אופציונלי:
- `NEXT_PUBLIC_USE_MOCK_DATA=false` - להשתמש בנתונים מדומים

## 🔧 איך להגדיר

### Railway:
1. פרויקט → Service → Variables → + New Variable
2. הוסף כל משתנה
3. Deploy מחדש

### Vercel:
1. פרויקט → Settings → Environment Variables → Add New
2. הוסף כל משתנה
3. **חשוב:** Redeploy את הפרויקט!

## ✅ בדיקת חיבור

### בדוק את ה-Backend:
```bash
curl https://your-railway-app.railway.app/health
```

### בדוק את ה-Frontend:
1. פתח את הקונסול בדפדפן (F12)
2. בדוק שאין שגיאות CORS
3. בדוק שהבקשות נשלחות לכתובת הנכונה

## 🐛 בעיות נפוצות

### CORS Error
- ✅ ודא ש-`FRONTEND_URL` ב-Railway מכיל את כתובת ה-Vercel
- ✅ ודא ש-`NEXT_PUBLIC_API_URL` ב-Vercel מכיל את כתובת ה-Railway
- ✅ ודא שעשית Redeploy בשניהם

### Connection Refused
- ✅ ודא שה-backend רץ ב-Railway
- ✅ בדוק את ה-health endpoint
- ✅ ודא שהפורט נכון (8080)

### Mixed Content (HTTP/HTTPS)
- ✅ אם ה-frontend ב-HTTPS, ה-backend גם חייב להיות ב-HTTPS
- ✅ ודא שכל הכתובות מתחילות ב-`https://`

## 📚 מסמכים מפורטים

- [Railway Environment Variables](./RAILWAY_ENV_VARIABLES.md) - מדריך מפורט ל-Railway
- [Vercel Environment Variables](./VERCEL_ENV_VARIABLES.md) - מדריך מפורט ל-Vercel

