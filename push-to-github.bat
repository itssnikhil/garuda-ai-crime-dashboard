@echo off
title Push GARUDA-AI to GitHub
echo ========================================================
echo   GARUDA-AI: Push Project to Your GitHub Repository
echo ========================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/downloads and try again.
    pause
    exit /b 1
)

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/your-username/garuda-ai.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL cannot be empty.
    pause
    exit /b 1
)

echo.
echo [1/4] Initializing Git repository...
if not exist ".git" (
    git init -b main
) else (
    git branch -M main
)

echo.
echo [2/4] Staging files...
git add .

echo.
echo [3/4] Committing files...
git commit -m "feat: GARUDA-AI MP Police & Indore Commissionerate Crime Intelligence Dashboard"

echo.
echo [4/4] Setting remote and pushing to GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main --force

echo.
echo ========================================================
echo   SUCCESS! Project pushed to: %REPO_URL%
echo ========================================================
pause
