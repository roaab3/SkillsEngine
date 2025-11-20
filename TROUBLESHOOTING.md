# 🔧 Troubleshooting Guide

## בעיית: `ERR_CONNECTION_REFUSED`

### סימפטומים:
- `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- ה-frontend לא מצליח להתחבר ל-backend

### פתרונות:

#### 1. הפעלת ה-Backend

```bash
# בתיקיית backend
cd backend

# התקנת dependencies (אם עדיין לא)
npm install

# הפעלת השרת
npm run dev
```

השרת אמור לרוץ על `http://localhost:8080`

#### 2. בדיקת חיבור למסד הנתונים

```bash
# בתיקיית backend
node check-connection.js
```

אם יש שגיאה:
- בדוק את `DATABASE_URL` ב-`backend/.env`
- ודא שהפרויקט ב-Supabase פעיל
- בדוק את הסיסמה והכתובת

#### 3. שימוש ב-Mock Data (זמני)

אם יש בעיה במסד הנתונים, אפשר להשתמש ב-mock data:

**ב-`frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=true
```

#### 4. בדיקת Health Check

לאחר הפעלת השרת, בדוק:
```bash
curl http://localhost:8080/health
```

אמור להחזיר:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "skills-engine-backend",
  "version": "1.0.0"
}
```

## בעיית: Database Connection Timeout

### סימפטומים:
- `Connection terminated due to connection timeout`
- השרת לא מצליח להתחבר ל-Supabase

### פתרונות:

#### 1. בדיקת DATABASE_URL

פתח את `backend/.env` ובדוק שהכתובת נכונה:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

**חשוב:**
- החלף `[PASSWORD]` בסיסמה האמיתית
- החלף `[PROJECT-REF]` ב-project reference מ-Supabase

#### 2. קבלת Connection String מ-Supabase

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com)
2. בחר את הפרויקט
3. לך ל-Settings > Database
4. העתק את Connection String (URI)
5. הדבק ב-`backend/.env`

#### 3. בדיקת Supabase Project Status

ודא שהפרויקט ב-Supabase פעיל ולא מושעה.

#### 4. הרצת Migrations

אם הטבלאות לא קיימות:

```bash
# בתיקיית backend
npm run migrate:supabase
```

או ידנית:
```bash
# העתק את SQL מ-database/migrations/000_initial_schema.sql
# והרץ ב-Supabase SQL Editor
```

## פתרון מהיר - Mock Mode

אם אתה רוצה להתחיל לעבוד בלי מסד נתונים:

1. **ב-`backend/.env`:**
```env
MOCK_MODE=true
```

2. **ב-`frontend/.env.local`:**
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

3. **הפעל את השרת:**
```bash
cd backend
npm run dev
```

## בדיקות מהירות

```bash
# 1. האם ה-backend רץ?
curl http://localhost:8080/health

# 2. האם יש חיבור למסד הנתונים?
cd backend && node check-connection.js

# 3. האם ה-frontend רץ?
cd frontend && npm run dev
```

## עדכון DATABASE_URL

אם שינית את ה-DATABASE_URL:

1. עדכן את `backend/.env`
2. הפעל מחדש את השרת
3. בדוק עם `node check-connection.js`

## צור קשר

אם הבעיה נמשכת, בדוק:
- [Setup Guide](docs/SETUP_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

