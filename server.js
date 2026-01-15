const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const HOST = '127.0.0.1';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

// Determine the base path for assets
let basePath;
if (process.pkg) {
    // Running as packaged executable
    basePath = path.dirname(process.execPath);
} else {
    // Running as normal Node.js script
    basePath = __dirname;
}

const server = http.createServer((req, res) => {
    // Proxy endpoint for RUC API to avoid CORS
    if (req.url.startsWith('/api/ruc/')) {
        const ruc = req.url.replace('/api/ruc/', '').split('?')[0];

        const https = require('https');
        const apiUrl = `https://api.decolecta.com/v1/sunat/ruc/full?numero=${ruc}`;
        const token = 'sk_12666.6kGbUsUQQreOfJxTEhdVE9qJ1dmuFR5q';

        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const proxyReq = https.request(apiUrl, options, (proxyRes) => {
            let data = '';

            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        });

        proxyReq.on('error', (error) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });

        proxyReq.end();
        return;
    }

    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(basePath, filePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Error del servidor: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;
    console.log('═════════════════════════════════════════════════════');
    console.log('  COTIZADOR PDF - DIGITAL TRADE GROUP');
    console.log('═════════════════════════════════════════════════════');
    console.log(`\n✓ Servidor iniciado en: ${url}`);
    console.log('\nAbriendo navegador...\n');
    console.log('Presiona Ctrl+C para detener el servidor\n');
    console.log('═════════════════════════════════════════════════════');

    // Open browser automatically
    const start = process.platform === 'win32' ? 'start' :
        process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${start} ${url}`);
});
