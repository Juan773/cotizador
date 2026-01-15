# Guía de Despliegue - CotizadorPDF para Windows

## 📦 Contenido del Paquete

El archivo `CotizadorPDF-Windows.zip` contiene:

```
CotizadorPDF-Windows.zip
├── CotizadorPDF.exe          (36 MB) - Ejecutable principal
├── index.html                - Interfaz de usuario
├── styles.css                - Estilos de la aplicación
├── app.js                    - Lógica de la aplicación
├── html2pdf.bundle.min.js    - Generador de PDF
├── LEEME.txt                 - Guía de usuario
└── assets/
    ├── logo.jpeg             - Logo de la empresa
    ├── bcp_logo.jpg          - Logo del BCP
    ├── visa.jpg              - Logo Visa
    ├── mastercard.jpg        - Logo Mastercard
    ├── pagoefectivo.jpg      - Logo PagoEfectivo
    └── benefits_new.png      - Iconos de beneficios
```

## 🚀 Instrucciones de Instalación

### Para el Usuario Final:

1. **Descomprimir el archivo:**
   - Extraer `CotizadorPDF-Windows.zip` a una carpeta (ejemplo: `C:\CotizadorPDF`)

2. **Ejecutar la aplicación:**
   - Hacer doble clic en `CotizadorPDF.exe`
   - Windows Defender puede mostrar una advertencia:
     * Click en "Más información"
     * Click en "Ejecutar de todas formas"
   - El navegador se abrirá automáticamente en `http://127.0.0.1:8080`

3. **Usar la aplicación:**
   - Llenar los datos de la cotización
   - Agregar ítems según sea necesario
   - Click en "Generar PDF" para crear el documento

4. **Cerrar la aplicación:**
   - Cerrar la ventana del navegador
   - En la ventana de consola (negra), presionar `Ctrl+C`
   - O simplemente cerrar la ventana de consola

## 🔧 Requisitos del Sistema

- **Sistema Operativo:** Windows 7 o superior
- **RAM:** 100 MB mínimo
- **Disco:** 50 MB de espacio libre
- **Navegador:** Cualquiera (Chrome, Firefox, Edge, etc.)
- **Conexión a Internet:** NO requerida

## 📋 Características Principales

✅ **Funcionamiento Offline Completo**
- No requiere instalación adicional
- No necesita internet para operar (excepto autocompletado de RUC)
- Ejecutable portable (no requiere permisos de administrador)

✅ **Autocompletado de RUC (Nuevo)**
- Consulta automática a SUNAT vía API Decolecta
- Autocompleta: Razón Social, Dirección, Departamento, Distrito
- Validación automática de RUC (11 dígitos)
- Construcción inteligente de dirección desde componentes
- Fallback a entrada manual si la API falla
- Requiere conexión a internet solo para esta función

✅ **Interfaz Moderna**
- Diseño responsive
- Preview en tiempo real
- Cálculos automáticos

✅ **Generación de PDF**
- PDFs profesionales con logo
- Datos del cliente en 3 columnas
- Tabla de ítems con numeración automática
- Información bancaria integrada
- Métodos de pago con logos

## 🛠️ Solución de Problemas

### El ejecutable no inicia
- Verificar que todos los archivos estén en la misma carpeta
- Verificar que la carpeta `assets/` esté presente
- Intentar "Ejecutar como administrador"

### Windows Defender bloquea el archivo
- Es normal para ejecutables no firmados
- Seguir los pasos mencionados arriba
- O agregar excepción en Windows Defender

### El puerto 8080 está en uso
- Cerrar otras aplicaciones que puedan usar el puerto
- O cerrar cualquier instancia previa del CotizadorPDF

### Error al generar PDF
- Verificar que `html2pdf.bundle.min.js` esté en la carpeta
- Verificar que todos los archivos de `assets/` estén presentes
- Intentar cerrar y volver a abrir la aplicación

## 📝 Notas Técnicas

**Arquitectura:**
- Node.js v18 embebido
- Servidor HTTP simple (puerto 8080)
- Librería html2pdf.js para generación de PDFs

**Archivos Estáticos:**
- Todos los assets se cargan desde el sistema de archivos local
- El ejecutable actúa como servidor web local
- No se realizan peticiones externas

**Seguridad:**
- Solo escucha en localhost (127.0.0.1)
- No expone puerto a la red
- No recopila ni envía datos

## 📞 Distribución

**Para enviar a clientes:**
1. Compartir el archivo `CotizadorPDF-Windows.zip`
2. Incluir el archivo `LEEME.txt` para instrucciones
3. Opcional: Crear un acceso directo al `.exe`

**Tamaño del paquete:**
- ZIP comprimido: ~14 MB
- Descomprimido: ~37 MB

## 🔄 Actualizaciones

Para actualizar a una nueva versión:
1. Reemplazar el contenido de la carpeta con la nueva versión
2. Mantener cualquier configuración personalizada

---

© 2026 Digital Trade Group - Technology & Imports

**Versión:** 1.1.0  
**Fecha:** Enero 2026  
**Plataforma:** Windows (x64)

### Novedades v1.1.0:
- ✨ Autocompletado de RUC mediante API de SUNAT
- 🏢 Construcción inteligente de direcciones
- 🔄 Sincronización automática de datos del cliente
- 🛡️ Proxy integrado para seguridad de API
