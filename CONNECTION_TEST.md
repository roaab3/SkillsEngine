# 🔌 בדיקת תקשורת Frontend-Backend

## שיטות בדיקה

### 1. בדיקה מהירה עם Node.js (מומלץ)

```bash
cd frontend
node check-backend-connection.js
```

זה יבדוק:
- ✅ Health check endpoint
- ✅ Root endpoint
- ✅ Competencies API
- ✅ Parent competencies API
- ✅ Skills API

### 2. בדיקה עם cURL (מסורתי)

```bash
# בדיקת Health Check
curl http://localhost:8080/health

# בדיקת Root
curl http://localhost:8080/

# בדיקת API
curl http://localhost:8080/api/competencies
```

### 3. בדיקה עם Script (Bash)

```bash
chmod +x scripts/test-connection.sh
./scripts/test-connection.sh
```

### 4. בדיקה ידנית בדפדפן

פתח בדפדפן:
- `http://localhost:8080/health` - אמור להחזיר JSON עם status: "ok"
- `http://localhost:8080/` - אמור להחזיר מידע על ה-API
- `http://localhost:8080/api/competencies` - אמור להחזיר רשימת competencies

### 5. בדיקה מה-Frontend (בדפדפן)

פתח את ה-Developer Console (F12) והרץ:

```javascript
// בדיקת Health Check
fetch('http://localhost:8080/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend error:', err));

// בדיקת API
fetch('http://localhost:8080/api/competencies')
  .then(r => r.json())
  .then(data => console.log('✅ API working:', data))
  .catch(err => console.error('❌ API error:', err));
```

## פתרון בעיות

### שגיאה: `ERR_CONNECTION_REFUSED`

**סיבה:** ה-backend לא רץ

**פתרון:**
```bash
cd backend
npm run dev
```

### שגיאה: `CORS error`

**סיבה:** ה-backend לא מאפשר requests מה-frontend

**פתרון:** ודא ש-`cors` מופעל ב-`backend/src/index.js`:
```javascript
app.use(cors());
```

### שגיאה: `404 Not Found`

**סיבה:** ה-endpoint לא קיים או הנתיב שגוי

**פתרון:** בדוק את ה-routes ב-`backend/src/routes/`

### שגיאה: `Network Error`

**סיבה:** ה-URL לא נכון או ה-backend לא נגיש

**פתרון:**
1. בדוק את `NEXT_PUBLIC_API_URL` ב-`frontend/.env.local`
2. ודא שה-backend רץ על הפורט הנכון (ברירת מחדל: 8080)

## בדיקה אוטומטית

להוספה ל-`package.json`:

```json
{
  "scripts": {
    "test:connection": "node check-backend-connection.js"
  }
}
```

הרצה:
```bash
npm run test:connection
```

