# COTIZADOR PDF - Versión para Windows

## 📋 Descripción
Aplicación web para generar cotizaciones en PDF con diseños personalizados por empresa.

## ✅ Requisitos Previos
- **Node.js** (versión 14 o superior)
  - Descargar desde: https://nodejs.org/
  - Durante la instalación, asegúrate de marcar la opción "Add to PATH"

## 🚀 Instalación y Uso

### Primera vez:
1. Extrae todos los archivos del ZIP en una carpeta de tu elección
2. Haz doble clic en `start-server.bat`
3. El script instalará automáticamente las dependencias necesarias
4. Una vez iniciado, abre tu navegador en: http://localhost:8080

### Usos posteriores:
- Simplemente haz doble clic en `start-server.bat`
- El servidor se iniciará automáticamente

### Detener el servidor:
- Presiona `Ctrl+C` en la ventana del terminal
- O cierra la ventana directamente

## 📁 Estructura del Proyecto
```
cotizador_pdf_app/
├── start-server.bat      # Script de inicio para Windows
├── server.js             # Servidor Node.js
├── index.html            # Interfaz del formulario
├── app.js                # Lógica de la aplicación
├── styles.css            # Estilos
├── companies.json        # Configuración de empresas
├── assets/               # Recursos (logos, etc.)
└── dist/                 # Archivos de distribución
```

## 🏢 Gestión de Empresas

### Agregar una nueva empresa:
1. Abre el archivo `companies.json` con un editor de texto
2. Copia una empresa existente y modifica sus datos
3. Coloca el logo de la empresa en la carpeta `assets/` (formato PNG recomendado)
4. Reinicia el servidor

### Campos configurables:
- **ruc**: RUC de la empresa (sin guiones)
- **name**: Nombre comercial
- **address**: Dirección completa
- **email**: Correo de contacto
- **phone**: Teléfono (opcional)
- **logo**: Ruta al logo (`/assets/logo-empresa.png`)
- **theme**: Configuración de colores y estilos

## 🎨 Características

### Layout Vertical de Ítems
Los productos/servicios se muestran en formato de tarjeta con todos los campos organizados verticalmente para mejor legibilidad.

### Información del Cliente Organizada
Los datos del cliente están agrupados lógicamente:
- **Columna 1**: Datos básicos (Señores, RUC, Atención)
- **Columna 2**: Ubicación (Dirección, Departamento, Distrito)
- **Columna 3**: Datos comerciales (Entrega, Moneda, Condiciones de Venta)

### Texto Adaptable
El texto largo en las descripciones de productos se ajusta automáticamente con saltos de línea en la vista previa del PDF.

### Personalización por Empresa
Cada empresa puede tener:
- Colores personalizados
- Tipografía específica
- Layout personalizado
- Términos comerciales propios

## 🔧 Solución de Problemas

### El servidor no inicia:
- Verifica que Node.js esté instalado: abre CMD y ejecuta `node --version`
- Si no está instalado, descárgalo desde https://nodejs.org/

### El navegador no carga la página:
- Asegúrate que el servidor esté corriendo (ve la ventana del terminal)
- Verifica que la dirección sea exactamente: http://localhost:8080
- Intenta cerrar y reabrir el navegador

### No se puede generar el PDF:
- Presiona `Ctrl+Shift+R` en el navegador para limpiar la caché
- Verifica que todos los campos requeridos estén completos
- Revisa la consola del navegador (F12) para ver errores

### El botón "+ Agregar ítem" no funciona:
- Haz un hard refresh en el navegador: `Ctrl+Shift+R`
- Si persiste, cierra y reinicia el servidor

## 📞 Soporte
Para reportar problemas o solicitar nuevas características, contacta al administrador del sistema.

## 📝 Versión
- **Versión actual**: 2.0
- **Última actualización**: Enero 2026
- **Cambios recientes**:
  - Layout vertical de ítems para mejor UX
  - Reorganización de información del cliente
  - Ajuste automático de texto largo
  - Eliminación de campos opcionales innecesarios
  - Corrección de errores JavaScript

---

**Desarrollado con ❤️ para optimizar tu flujo de trabajo**
