@echo off
echo 🔧 DEBUGGING MoneyMate Tailwind CSS Issue...
echo.

echo 📋 Current situation:
echo - package.json shows tailwindcss@^3.4.0
echo - But node_modules still has v4 installed
echo - PostCSS config expects v3 syntax
echo.

echo 🧹 Cleaning up...
echo Removing node_modules and package-lock.json
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo 📦 Installing correct dependencies...
npm install

echo.
echo 🔍 Verifying Tailwind version...
npm list tailwindcss

echo.
echo ✅ Fix complete! Now try:
echo npm start

pause
