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

        // Function to try decolecta API (with full data)
        const tryDecolecta = () => {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://api.decolecta.com/v1/sunat/ruc/full?numero=${ruc}`;
                const token = 'sk_12666.QHtvrYeLy5bhexkDFkVRIhJZg5mhOMLb';

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
                        if (proxyRes.statusCode === 200) {
                            resolve({ success: true, data: data, statusCode: 200 });
                        } else {
                            reject({ success: false, statusCode: proxyRes.statusCode });
                        }
                    });
                });

                proxyReq.on('error', (error) => {
                    reject({ success: false, error: error.message });
                });

                proxyReq.end();
            });
        };

        // Function to try consultaruc.win API (fallback, basic data only)
        const tryConsultaruc = () => {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://consultaruc.win/api/ruc/${ruc}`;

                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    }
                };

                const proxyReq = https.request(apiUrl, options, (proxyRes) => {
                    let data = '';

                    proxyRes.on('data', (chunk) => {
                        data += chunk;
                    });

                    proxyRes.on('end', () => {
                        if (proxyRes.statusCode === 200) {
                            resolve({ success: true, data: data, statusCode: 200 });
                        } else {
                            reject({ success: false, statusCode: proxyRes.statusCode });
                        }
                    });
                });

                proxyReq.on('error', (error) => {
                    reject({ success: false, error: error.message });
                });

                proxyReq.end();
            });
        };

        // Try decolecta first, fallback to consultaruc if it fails
        tryDecolecta()
            .then(result => {
                console.log('✓ RUC data fetched from decolecta.com (full data)');
                res.writeHead(result.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(result.data);
            })
            .catch(error => {
                console.log('✗ Decolecta failed, trying consultaruc.win fallback...');
                return tryConsultaruc()
                    .then(result => {
                        console.log('✓ RUC data fetched from consultaruc.win (basic data)');
                        res.writeHead(result.statusCode, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(result.data);
                    })
                    .catch(fallbackError => {
                        console.log('✗ Both APIs failed');
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            error: 'No se pudo obtener información del RUC',
                            details: 'Ambas APIs fallaron'
                        }));
                    });
            });

        return;
    }

    // Unified file resolution logic for standalone executable
    let urlPath = req.url.split('?')[0];
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

    const internalPath = path.join(__dirname, relativePath);
    const externalPath = process.pkg ? path.join(path.dirname(process.execPath), relativePath) : internalPath;

    // Logic: 
    // 1. If it's companies.json, prioritize EXTERNAL first (so user can edit it)
    // 2. For everything else, prioritize INTERNAL snaphot first (standalone reliability)
    // 3. Fallback to whatever exists.

    let finalPath = internalPath;

    if (relativePath === 'companies.json') {
        if (fs.existsSync(externalPath)) {
            finalPath = externalPath;
        } else {
            finalPath = internalPath;
        }
    } else {
        // Core files: Try internal (snaphot) first
        if (fs.existsSync(internalPath)) {
            finalPath = internalPath;
        } else if (fs.existsSync(externalPath)) {
            finalPath = externalPath;
        }
    }

    const extname = String(path.extname(finalPath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(finalPath, (error, content) => {
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
    console.log(`✓ Servidor iniciado en: ${url}`);
    console.log(`✓ Build ID: 2026-02-03-0140 (V3.3-FINAL-FIX)`);
    console.log('\nAbriendo navegador...\n');
    console.log('Presiona Ctrl+C para detener el servidor\n');
    console.log('═════════════════════════════════════════════════════');

    // Open browser automatically
    const start = process.platform === 'win32' ? 'start' :
        process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${start} ${url}`);
});
