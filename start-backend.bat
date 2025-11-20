@echo off
REM Start Backend Server Script for Windows
REM Usage: start-backend.bat

echo 🚀 Starting Skills Engine Backend...
echo.

cd backend

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from env.example...
    copy env.example .env
    echo ✅ .env created. Please update DATABASE_URL in backend/.env
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Check database connection
echo 🔍 Checking database connection...
node check-connection.js
set DB_STATUS=%ERRORLEVEL%

if %DB_STATUS%==0 (
    echo.
    echo ✅ Database connection OK
    echo.
    echo 🚀 Starting backend server...
    echo 📡 Server will run on: http://localhost:8080
    echo 📊 Health check: http://localhost:8080/health
    echo.
    call npm run dev
) else (
    echo.
    echo ⚠️  Database connection failed!
    echo 💡 You can still run the server, but database operations will fail.
    echo 💡 To fix: Update DATABASE_URL in backend/.env
    echo.
    set /p CONTINUE="Continue anyway? (y/n) "
    if /i "%CONTINUE%"=="y" (
        echo 🚀 Starting backend server anyway...
        call npm run dev
    ) else (
        echo ❌ Aborted. Please fix database connection first.
        exit /b 1
    )
)

