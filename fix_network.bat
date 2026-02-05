@echo off
TITLE Checking System Network Configuration
CLS
ECHO ===================================================
ECHO      FIXING NETWORK & FIREWALL SETTINGS
ECHO ===================================================
ECHO.
ECHO This script needs to run as Administrator to add firewall rules.
ECHO.
pause

ECHO.
ECHO [1] Adding Firewall Rule for Backend (Port 5577)...
netsh advfirewall firewall delete rule name="CheckIn-Backend-5577" >nul
netsh advfirewall firewall add rule name="CheckIn-Backend-5577" dir=in action=allow protocol=TCP localport=5577 profile=any
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Failed to add firewall rule. Please Run As Administrator.
) ELSE (
    ECHO [SUCCESS] Firewall rule added for Port 5577.
)

ECHO.
ECHO [2] Adding Firewall Rule for Frontend (Port 5566)...
netsh advfirewall firewall delete rule name="CheckIn-Frontend-5566" >nul
netsh advfirewall firewall add rule name="CheckIn-Frontend-5566" dir=in action=allow protocol=TCP localport=5566 profile=any
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Failed to add firewall rule. Please Run As Administrator.
) ELSE (
    ECHO [SUCCESS] Firewall rule added for Port 5566.
)

ECHO.
ECHO ===================================================
ECHO      YOUR IP ADDRESSES
ECHO ===================================================
ECHO Use one of these IP addresses on your other devices:
ECHO.
ipconfig | findstr "IPv4"
ECHO.
ECHO Example: http://192.168.1.X:5566
ECHO.
PAUSE
