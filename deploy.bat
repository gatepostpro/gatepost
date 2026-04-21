@echo off
echo Deploying Gatepost to GitHub...

cd /d "H:\My Drive\gatepost"

git add -f app.html
git add -f index.html

git commit -m "Deploy: single file app.html"

git push origin main

echo.
echo Done! Wait 60 seconds then open in incognito.
pause
