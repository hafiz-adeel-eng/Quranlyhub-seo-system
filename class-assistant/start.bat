@echo off
cd /d "%~dp0"
echo Installing / checking packages...
py -m pip install -q -r requirements.txt
echo Starting Class Helper...
py assistant.py
pause
