@echo off
:: STAFF SYSTEM NETWORK FIXER v2.0
:: Right-click this file and select "Run as administrator".

echo.
echo ==============================================
echo    STAFF CHECK-IN SYSTEM - NETWORK FIXER
echo ==============================================
echo.

:: 1. Force Network Profile to Private (Fixes many Windows 10/11 blocks)
echo [1/3] Setting Network Profile to 'Private'...
powershell -Command "Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Private"
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Network set to Private.
) else (
    echo NOTE: Could not change network category (Skipping).
)

echo.
:: 2. Delete old rules to avoid duplicates
echo [2/3] Cleaning up old firewall rules...
netsh advfirewall firewall delete rule name="Staff-System-UI" >nul 2>&1
netsh advfirewall firewall delete rule name="Staff-System-Backend" >nul 2>&1
netsh advfirewall firewall delete rule name="Staff-System-Vite" >nul 2>&1

:: 3. Add fresh, detailed rules
echo [3/3] Opening Ports 5566 and 5577...
netsh advfirewall firewall add rule name="Staff-System-UI" dir=in action=allow protocol=TCP localport=5566 profile=any
netsh advfirewall firewall add rule name="Staff-System-Backend" dir=in action=allow protocol=TCP localport=5577 profile=any

if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: All ports are now open on ALL profiles (Public/Private/Domain).
) else (
    echo FAILED: Could not add firewall rules. Please run this as Administrator!
)

echo.
echo ==============================================
echo   DONE! Please RESTART YOUR LAPTOP (Optional)
echo   or Close and Open the Website again.
echo ==============================================
echo.
echo Your current IP is:
powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike '*Loopback*'}).IPAddress"
echo.
pause
