# Supabase Deployment Guide

מדריך לדחיפת migrations ל-Supabase.

---

## 🔧 הגדרת Supabase

### 1. קבלת Connection String

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com)
2. בחר את הפרויקט שלך
3. לך ל-**Settings** → **Database**
4. העתק את ה-**Connection string** (URI format)

**פורמט:**
```
postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

---

## 🚀 דחיפה ידנית ל-Supabase

### שיטה 1: שימוש ב-psql

```bash
# הגדר את ה-DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# הרץ את ה-migration
psql "$DATABASE_URL" -f database/migrations/000_initial_schema.sql
```

### שיטה 2: שימוש ב-Script

```bash
# הגדר את ה-DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# הרץ את ה-script
./scripts/migrate-supabase.sh
```

### שיטה 3: שימוש ב-npm script

```bash
# הגדר את ה-DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# הרץ את ה-migration
cd backend
npm run migrate:supabase
```

---

## 🔄 דחיפה אוטומטית ב-GitHub Actions

ה-`deploy.yml` כבר מוגדר לדחוף migrations ל-Supabase אוטומטית!

### מה צריך לעשות:

1. **הוסף Secret ל-GitHub:**
   - לך ל-**Settings** → **Secrets and variables** → **Actions**
   - לחץ על **New repository secret**
   - שם: `DATABASE_URL`
   - ערך: ה-connection string מ-Supabase

2. **Push ל-main:**
   ```bash
   git push origin main
   ```

3. **GitHub Actions יריץ אוטומטית:**
   - ✅ Deploy Backend
   - ✅ Run Migrations to Supabase
   - ✅ Health Checks

---

## 📋 מה ה-migration כולל?

ה-`000_initial_schema.sql` כולל:

- ✅ **POLYNOMIAL_HASH function** - Hash indexing
- ✅ **9 טבלאות:**
  - `skills`
  - `competencies`
  - `competency_skill`
  - `skill_subSkill`
  - `competency_subCompetency`
  - `users`
  - `userCompetency`
  - `userSkill`
  - `official_sources`
- ✅ **כל ה-indexes** (B-TREE, Hash, GIN)
- ✅ **Triggers** לעדכון `updated_at`

---

## ✅ בדיקה שהכל עבד

### בדיקת טבלאות:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### בדיקת indexes:

```sql
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 🔒 אבטחה

⚠️ **חשוב:**
- לעולם אל תעלה את ה-`DATABASE_URL` ל-Git
- השתמש ב-GitHub Secrets ל-production
- בדוק שה-SSL מופעל ב-production (`ssl: { rejectUnauthorized: false }`)

---

## 🆘 פתרון בעיות

### שגיאה: "connection refused"
- בדוק שה-IP שלך מורשה ב-Supabase (Settings → Database → Connection Pooling)
- בדוק שה-password נכון

### שגיאה: "permission denied"
- ודא שאתה משתמש ב-`postgres` user
- בדוק שה-password נכון

### שגיאה: "relation already exists"
- הטבלאות כבר קיימות - זה בסדר
- אם אתה רוצה לרוץ מחדש, מחק את הטבלאות קודם

---

## 📚 משאבים נוספים

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL psql Documentation](https://www.postgresql.org/docs/current/app-psql.html)
- [Database Migrations README](../database/migrations/README.md)




