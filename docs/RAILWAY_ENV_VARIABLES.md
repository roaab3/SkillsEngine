# Railway Environment Variables (Backend)

This document lists all required and optional environment variables for deploying the Skills Engine Backend on Railway.

## Required Variables

### Database Configuration
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```
**או** משתנים נפרדים:
```bash
DB_HOST=[YOUR-PROJECT-REF].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
```

### Server Configuration
```bash
NODE_ENV=production
PORT=8080
```

### CORS - Frontend URL (חשוב מאוד!)
```bash
FRONTEND_URL=https://your-app.vercel.app,https://*.vercel.app
```
**הערה:** החלף `your-app.vercel.app` בכתובת ה-Vercel שלך. הוסף כל כתובת frontend שצריכה גישה, מופרדת בפסיקים.

### Authentication
```bash
JWT_SECRET=your_very_secure_jwt_secret_here_minimum_32_characters
JWT_EXPIRES_IN=24h
```

## Optional but Recommended

### External Services - Gemini AI
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_FLASH_MODEL=gemini-1.5-flash
GEMINI_DEEP_SEARCH_MODEL=gemini-1.5-pro
```

### Logging
```bash
LOG_LEVEL=info
```

### Rate Limiting
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

## Microservice Integration (Optional)

אם אתה משתמש במיקרו-שירותים נוספים:

```bash
DIRECTORY_SERVICE_TOKEN=your_directory_service_token
ASSESSMENT_SERVICE_TOKEN=your_assessment_service_token
CONTENT_STUDIO_TOKEN=your_content_studio_token
COURSE_BUILDER_TOKEN=your_course_builder_token
LEARNER_AI_TOKEN=your_learner_ai_token
LEARNING_ANALYTICS_TOKEN=your_learning_analytics_token
RAG_CHATBOT_TOKEN=your_rag_chatbot_token

DIRECTORY_SERVICE_URL=https://your-directory-service.com
ASSESSMENT_SERVICE_URL=https://your-assessment-service.com
CONTENT_STUDIO_URL=https://your-content-studio.com
COURSE_BUILDER_URL=https://your-course-builder.com
LEARNER_AI_URL=https://your-learner-ai.com
LEARNING_ANALYTICS_URL=https://your-analytics.com
RAG_CHATBOT_URL=https://your-rag-chatbot.com
```

## How to Set Environment Variables in Railway

1. פתח את הפרויקט שלך ב-Railway
2. לחץ על השירות (Service) של ה-backend
3. לחץ על הכרטיסייה **Variables**
4. לחץ על **+ New Variable**
5. הוסף כל משתנה עם הערך שלו
6. לחץ על **Deploy** כדי להפעיל מחדש עם המשתנים החדשים

## בדיקת חיבור

לאחר הגדרת המשתנים, בדוק שהחיבור עובד:

```bash
# בדוק את ה-health endpoint
curl https://your-railway-app.railway.app/health

# בדוק את ה-root endpoint
curl https://your-railway-app.railway.app/
```

## בעיות נפוצות

### CORS Errors
- ודא ש-`FRONTEND_URL` מכיל את כתובת ה-Vercel המדויקת
- ודא שאין רווחים מיותרים בכתובת
- אם יש לך preview URLs, הוסף גם אותם: `https://your-app.vercel.app,https://your-app-git-main.vercel.app`

### Database Connection Errors
- ודא ש-`DATABASE_URL` נכון
- ודא שהפרויקט Supabase פעיל
- בדוק שהסיסמה נכונה

### Port Issues
- Railway מגדיר אוטומטית את ה-PORT, אבל ודא ש-`PORT=8080` מוגדר
- בדוק את ה-`railway.json` שהפורט נכון

