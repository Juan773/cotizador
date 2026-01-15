# Cotizador PDF - Digital Trade Group

Aplicación web para generar cotizaciones en formato PDF.

## 🐛 Problema Resuelto

El error "No se pudo generar el PDF" ocurría porque:

1. **Protocolo file://** - Al abrir `index.html` directamente desde el navegador (usando `file:///`), las políticas de seguridad CORS del navegador impedían que `html2pdf.js` exportara el canvas a PDF.

2. **Tainted Canvas** - Las imágenes locales (como el logo) "contaminan" el canvas, haciendo imposible exportarlo como PDF cuando se sirve desde `file://`.

## ✅ Solución

Para evitar estos problemas de CORS, la aplicación **debe ejecutarse desde un servidor HTTP local**. He incluido un script para hacerlo fácilmente.

## 🚀 Cómo Usar

### Opción 1: Script Automático (Recomendado)

```bash
./start-server.sh
```

El script iniciará automáticamente un servidor en `http://127.0.0.1:8080`.

### Opción 2: Comando Manual

Si el script no funciona, ejecuta:

```bash
npx -y http-server -c-1 -p 8080 .
```

### Pasos de Uso

1. Ejecuta el servidor (usa una de las opciones anteriores)
2. Abre tu navegador en: **http://127.0.0.1:8080**
3. Completa el formulario de cotización
4. Haz clic en **"Generar PDF"**
5. El PDF se descargará automáticamente

## 📋 Requisitos

- Node.js (para ejecutar `npx`)
- Navegador web moderno

## 🔧 Cambios Realizados

1. **Descargado `html2pdf.bundle.min.js`** localmente para evitar dependencias de CDN
2. **Actualizado `index.html`** para usar la versión local de la librería
3. **Agregado `allowTaint: true`** en la configuración de `html2canvas` (aunque no fue suficiente para `file://`)
4. **Creado `start-server.sh`** para facilitar el inicio del servidor

## ⚠️ Importante

**NO** abras `index.html` directamente desde el explorador de archivos. Siempre usa el servidor HTTP local para evitar problemas de CORS.

## 📁 Estructura de Archivos

```
cotizador_pdf_app/
├── index.html              # Página principal
├── app.js                  # Lógica de la aplicación
├── styles.css              # Estilos
├── html2pdf.bundle.min.js  # Librería PDF (local)
├── start-server.sh         # Script para iniciar servidor
├── assets/
│   └── logo.jpeg          # Logo de la empresa
└── README.md              # Este archivo
```

## 🆘 Solución de Problemas

### El PDF no se genera

- Verifica que estés accediendo a través de `http://127.0.0.1:8080` y NO desde `file:///`
- Revisa la consola del navegador (F12) para ver errores específicos
- Asegúrate de completar todos los campos obligatorios

### El servidor no inicia

- Verifica que tengas Node.js instalado: `node --version`
- Intenta ejecutar manualmente: `npx http-server -c-1 -p 8080 .`

---

**Digital Trade Group** - Technology & Imports
