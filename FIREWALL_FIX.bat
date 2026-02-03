@echo off
:: This script will open ports 5566 (Frontend) and 5577 (Backend) in Windows Firewall.
:: You MUST right-click this file and select "Run as administrator".

echo.
echo ==============================================
echo    STAFF CHECK-IN SYSTEM - NETWORK FIXER
echo ==============================================
echo.

echo [1/2] Opening Port 5566 (Staff Portal UI)...
netsh advfirewall firewall add rule name="Staff-System-UI" dir=in action=allow protocol=TCP localport=5566
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Port 5566 is now open.
) else (
    echo FAILED: Could not open port 5566. Did you run as Admin?
)

echo.
echo [2/2] Opening Port 5577 (Backend Sync)...
netsh advfirewall firewall add rule name="Staff-System-Backend" dir=in action=allow protocol=TCP localport=5577
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Port 5577 is now open.
) else (
    echo FAILED: Could not open port 5577. Did you run as Admin?
)

echo.
echo ==============================================
echo   DONE! You can now try accessing the site 
echo   on your phone again.
echo ==============================================
pause
