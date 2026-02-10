@echo off
echo --- KILLING PROCESSES ON PORT 8001 ---
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /f /pid %%a
echo --- STARTING BACKEND IN DEBUG MODE ---
"d:\cnn+agey\venv\Scripts\python.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8001 --log-level debug
pause
