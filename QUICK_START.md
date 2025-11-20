# 🚀 Quick Start - פתרון מהיר לבעיית Connection

## הבעיה: `ERR_CONNECTION_REFUSED`

הבעיה נובעת משתי סיבות:
1. **ה-backend לא רץ** - השרת לא מופעל
2. **בעיית חיבור למסד הנתונים** - Connection timeout

## פתרון מהיר (3 שלבים):

### שלב 1: הפעל את ה-Backend

```bash
cd backend
npm install  # אם עדיין לא התקנת
npm run dev
```

אמור לראות:
```
🚀 Skills Engine Backend running on port 8080
📊 Health check available at http://localhost:8080/health
```

### שלב 2: בדוק את החיבור למסד הנתונים

בטרמינל חדש:
```bash
cd backend
node check-connection.js
```

אם יש שגיאה:
- פתח את `backend/.env`
- בדוק את `DATABASE_URL`
- ודא שהפרויקט ב-Supabase פעיל

### שלב 3: הפעל את ה-Frontend

בטרמינל חדש:
```bash
cd frontend
npm install  # אם עדיין לא התקנת
npm run dev
```

## פתרון זמני - Mock Data

אם יש בעיה במסד הנתונים, אפשר להשתמש ב-mock data:

**1. ב-`frontend/.env.local` (צור אם לא קיים):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=true
```

**2. הפעל מחדש את ה-frontend:**
```bash
cd frontend
npm run dev
```

## בדיקות מהירות

```bash
# בדוק אם ה-backend רץ
curl http://localhost:8080/health

# בדוק את החיבור למסד הנתונים
cd backend && node check-connection.js
```

## עדכון DATABASE_URL

אם צריך לעדכן את ה-DATABASE_URL:

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com)
2. בחר את הפרויקט
3. Settings > Database > Connection string (URI)
4. העתק והדבק ב-`backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```
5. הפעל מחדש את השרת

## עוד עזרה

ראה [TROUBLESHOOTING.md](TROUBLESHOOTING.md) לפרטים נוספים.

