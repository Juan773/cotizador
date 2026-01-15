#!/bin/bash

# Script para iniciar el servidor HTTP local
# Uso: ./start-server.sh

echo "🚀 Iniciando servidor HTTP local..."
echo ""
echo "La aplicación estará disponible en:"
echo "  👉 http://127.0.0.1:8080"
echo ""
echo "Presiona CTRL+C para detener el servidor"
echo ""

npx -y http-server -c-1 -p 8080 .
