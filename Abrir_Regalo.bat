@echo off
title Galaxia con Corazones de Amor 🪐
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  echo Iniciando galaxia en el navegador...
  node server.js
) else (
  echo Abriendo galaxia directamente...
  start "" "%~dp0index.html"
)
exit
