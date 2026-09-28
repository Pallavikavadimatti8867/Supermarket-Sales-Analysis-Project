@echo off
setlocal
title Supermarket Sales Analysis Dashboard
echo ========================================================
echo   Supermarket Sales Analysis Dashboard - One-Click Start
echo ========================================================
echo.

:: 1. Check if python is available
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [*] Starting via Python server...
    python run.py
    goto :end
)

:: 2. Check if py launcher is available
where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [*] Starting via Python launcher...
    py run.py
    goto :end
)

:: 3. Check if Node / npm is available
where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [*] Python not detected. Starting via npm dev server...
    if not exist node_modules (
        echo [*] Installing dependencies...
        npm install
    )
    npm run dev
    goto :end
)

echo [!] Error: Neither Python nor Node.js was found on your system PATH.
echo.
echo To run this dashboard in VS Code:
echo   Option A (Recommended): Install Python (https://www.python.org) and run:
echo      python run.py
echo.
echo   Option B: Install Node.js (https://nodejs.org) and run:
echo      npm install
echo      npm run dev
echo.
pause

:end
endlocal
