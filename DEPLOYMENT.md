# 🚀 Despliegue en Vercel

Sigue estos pasos para poner tu cotizador en línea GRATIS usando Vercel.

## 1. Preparación
Tu código ya está listo y sincronizado en GitHub:
👉 [https://github.com/Juan773/cotizador](https://github.com/Juan773/cotizador)

> [!NOTE]
> He corregido un error en el archivo `package.json`. Vercel intentaba generar el ejecutable de Windows (.exe) durante el despliegue web, lo cual causaba un fallo. Ahora el despliegue web ignorará la creación del exe.

He añadido una carpeta `api/` especial para que la búsqueda de RUC funcione en la nube sin configurar nada extra.

## 2. Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**.
3. Selecciona **"Continue with GitHub"** y usa tu cuenta `Juan773`.

## 3. Importar Proyecto
1. En tu panel de Vercel (Dashboard), haz clic en **"Add New..."** -> **"Project"**.
2. Verás una lista de tus repositorios de GitHub.
3. Busca `cotizador` y haz clic en el botón **"Import"**.

## 4. Configurar
Vercel detectará que es un proyecto estático.
- **Framework Preset**: Déjalo en `Other` (o Static).
- **Build Command**: Déjalo vacío.
- **Output Directory**: Déjalo vacío (o `Public` si te lo pide, pero por defecto usa la raíz).
- **Environment Variables**: No necesitas configurar nada por ahora.

Haz clic en **"Deploy"**.

## 5. ¡Listo!
Vercel te dará un dominio automático, por ejemplo: `cotizador-juan773.vercel.app`.

---

### 🌐 Alternativas (Render / Railway)
Si prefieres un servidor Node.js tradicional en lugar de funciones Serverless:

**En Render:**
1. Conecta tu GitHub.
2. New -> **Web Service**.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. En **Environment Variables**, añade `DECOLECTA_TOKEN`.

### ✅ Qué está incluido:
- **Web App**: Todo el diseño y funcionalidad.
- **API RUC**: He creado una "Serverless Function" en `/api/ruc/[ruc].js` que Vercel ejecutará automáticamente.
- **Configuración Segura**: Ahora usamos Variables de Entorno para proteger tus tokens.

### 🔄 Para actualizar:
Cada vez que hagas un cambio en tu código y ejecutes `git push`, Vercel/Render detectará el cambio y actualizará la web automáticamente.
