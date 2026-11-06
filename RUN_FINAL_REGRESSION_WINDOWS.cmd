@echo off
setlocal
cd /d "%~dp0"
title Ta7ady ElGeel - Final Regression
set "EXIT_CODE=1"
echo.
echo ================================================
echo      TA7ADY ELGEEL - FINAL REGRESSION
echo ================================================
echo No Host Panel, no Playwright, no UI screenshots.
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found in PATH.
  goto FINISH
)
where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm not found in PATH.
  goto FINISH
)
echo Node:
node --version
echo.
node "scripts\release\final-regression.mjs"
set "EXIT_CODE=%ERRORLEVEL%"
:FINISH
echo.
echo ================================================
echo FINAL REGRESSION EXIT CODE: %EXIT_CODE%
echo Results in release-check\FINAL_REGRESSION_SUMMARY.txt
echo ================================================
echo.
pause
exit /b %EXIT_CODE%
