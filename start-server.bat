@echo off
echo =======================================
echo   COTIZADOR PDF - Iniciando servidor
echo =======================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado: 
node --version
echo.

REM Verificar si npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm no esta instalado.
    pause
    exit /b 1
)

echo npm encontrado:
npm --version
echo.

REM Instalar dependencias si no existen
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
    echo.
)

REM Iniciar el servidor
echo Iniciando servidor en http://localhost:8080
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

node server.js

pause
