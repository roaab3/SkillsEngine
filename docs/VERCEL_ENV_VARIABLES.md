# Vercel Environment Variables (Frontend)

This document lists all required and optional environment variables for deploying the Skills Engine Frontend on Vercel.

## Required Variables

### Backend API URL (חשוב מאוד!)
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```
**הערה:** החלף `your-railway-app.railway.app` בכתובת ה-Railway של ה-backend שלך.

**חשוב:** משתנים שמתחילים ב-`NEXT_PUBLIC_` חשופים ללקוח (client-side), אז ודא שאתה לא מכניס מידע רגיש.

## Optional Variables

### Mock Data Mode
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
```
הגדר ל-`true` אם אתה רוצה להשתמש בנתונים מדומים במקום להתחבר ל-backend (שימושי לפיתוח).

## How to Set Environment Variables in Vercel

### דרך ה-Dashboard:
1. פתח את הפרויקט שלך ב-Vercel
2. לחץ על **Settings** (הגדרות)
3. לחץ על **Environment Variables** בתפריט הצד
4. לחץ על **Add New**
5. הוסף את השם והערך של המשתנה
6. בחר את הסביבות (Production, Preview, Development)
7. לחץ על **Save**
8. **חשוב:** לאחר הוספת משתנים חדשים, תצטרך לעשות **Redeploy** לפרויקט

### דרך CLI:
```bash
# התקן Vercel CLI אם עדיין לא
npm i -g vercel

# התחבר
vercel login

# הוסף משתנה סביבה
vercel env add NEXT_PUBLIC_API_URL

# או הוסף ישירות עם ערך
vercel env add NEXT_PUBLIC_API_URL production https://your-railway-app.railway.app
```

## בדיקת חיבור

לאחר הגדרת המשתנים:

1. **Redeploy** את הפרויקט ב-Vercel
2. פתח את הקונסול בדפדפן (F12)
3. בדוק שאין שגיאות CORS או חיבור
4. בדוק שהבקשות ל-API נשלחות לכתובת הנכונה

### בדיקה ידנית:
```bash
# בדוק שהמשתנה מוגדר נכון
# פתח את הקונסול בדפדפן והרץ:
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## הגדרת משתנים לסביבות שונות

ב-Vercel אתה יכול להגדיר משתנים שונים לסביבות שונות:

- **Production**: הסביבה הראשית (your-app.vercel.app)
- **Preview**: כל ה-preview deployments (branch deployments)
- **Development**: סביבת הפיתוח המקומית

**דוגמה:**
- Production: `NEXT_PUBLIC_API_URL=https://api-production.railway.app`
- Preview: `NEXT_PUBLIC_API_URL=https://api-staging.railway.app`
- Development: `NEXT_PUBLIC_API_URL=http://localhost:8080`

## בעיות נפוצות

### המשתנה לא נטען
- ודא שהמשתנה מתחיל ב-`NEXT_PUBLIC_`
- ודא שעשית **Redeploy** לאחר הוספת המשתנה
- בדוק שהמשתנה מוגדר לסביבה הנכונה (Production/Preview/Development)

### CORS Errors
- ודא שה-backend מוגדר עם `FRONTEND_URL` שמכיל את כתובת ה-Vercel
- בדוק את הקונסול בדפדפן לראות את השגיאה המדויקת

### Connection Refused
- ודא ש-`NEXT_PUBLIC_API_URL` מכיל את הכתובת הנכונה של ה-backend
- ודא שה-backend רץ וזמין
- בדוק שה-backend מאפשר CORS מהכתובת שלך

### Mixed Content (HTTP/HTTPS)
- אם ה-frontend ב-HTTPS, ה-backend גם חייב להיות ב-HTTPS
- ודא ש-`NEXT_PUBLIC_API_URL` מתחיל ב-`https://`

## בדיקת חיבור מקומי

לפני deployment, בדוק שהחיבור עובד מקומית:

1. צור קובץ `.env.local` בתיקיית `frontend/`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. הרץ את ה-frontend:
```bash
cd frontend
npm run dev
```

3. בדוק שהחיבור עובד

## Next Steps

לאחר הגדרת המשתנים:
1. ודא שה-backend ב-Railway מוגדר עם `FRONTEND_URL` שמכיל את כתובת ה-Vercel
2. Deploy מחדש את ה-frontend ב-Vercel
3. בדוק שהחיבור עובד בפרודקשן

