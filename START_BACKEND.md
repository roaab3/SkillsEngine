# 🚀 הפעלת ה-Backend

## הבעיה: `ERR_CONNECTION_REFUSED`

השגיאה `ERR_CONNECTION_REFUSED` אומרת שה-backend **לא רץ**. צריך להפעיל אותו.

## פתרון מהיר:

### Windows:
```bash
# שיטה 1: עם הסקריפט
start-backend.bat

# שיטה 2: ידנית
cd backend
npm run dev
```

### Linux/Mac:
```bash
# שיטה 1: עם הסקריפט
chmod +x start-backend.sh
./start-backend.sh

# שיטה 2: ידנית
cd backend
npm run dev
```

## שלבים ידניים:

### 1. עבור לתיקיית backend:
```bash
cd backend
```

### 2. ודא שיש .env:
```bash
# אם אין .env, צור אחד:
cp env.example .env
# ואז עדכן את DATABASE_URL ב-.env
```

### 3. התקן dependencies (אם צריך):
```bash
npm install
```

### 4. בדוק את החיבור למסד הנתונים:
```bash
node check-connection.js
```

### 5. הפעל את השרת:
```bash
npm run dev
```

## מה אמור לקרות:

אחרי הפעלת השרת, אמור לראות:
```
🚀 Skills Engine Backend running on port 8080
📊 Health check available at http://localhost:8080/health
📚 API endpoints:
   - Skills: http://localhost:8080/api/skills
   - Competencies: http://localhost:8080/api/competencies
   - User: http://localhost:8080/api/user
```

## בדיקה:

פתח בדפדפן או בטרמינל:
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

## פתרון זמני - Mock Data:

אם יש בעיה במסד הנתונים, אפשר להשתמש ב-mock data:

**ב-`frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=true
```

אז ה-frontend ישתמש ב-mock data גם אם ה-backend לא רץ.

## בעיות נפוצות:

### 1. Port 8080 תפוס
```bash
# בדוק מה רץ על פורט 8080:
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# או שנה את הפורט ב-backend/.env:
PORT=8081
```

### 2. DATABASE_URL לא מוגדר
```bash
# פתח backend/.env ועדכן:
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

### 3. Dependencies לא מותקנים
```bash
cd backend
npm install
```

## אחרי שהשרת רץ:

1. **פתח טרמינל חדש** להפעלת ה-frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. **פתח בדפדפן:**
   - Frontend: `http://localhost:3000`
   - Backend Health: `http://localhost:8080/health`

3. **בדוק את התקשורת:**
   ```bash
   cd frontend
   npm run test:connection
   ```



