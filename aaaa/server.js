const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const porta = 3000;

// Função para carregar os pedidos
function carregarPedidos() {
    try {
        const data = fs.readFileSync('pedidos.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Retorna um array vazio caso o arquivo não exista ou seja inválido
    }
}

// Função para carregar os clientes
function carregarClientes() {
    try {
        const data = fs.readFileSync('clientes.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {}; // Retorna um objeto vazio caso o arquivo não exista ou seja inválido
    }
}

// Função para servir o arquivo HTML (index.html)
function serveHTML(res) {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, html) => {
        if (err) {
            res.statusCode = 500;
            res.end('Erro ao carregar a página.');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
}

// Função para servir arquivos estáticos (CSS, JS)
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.statusCode = 500;
            res.end('Erro ao carregar o arquivo.');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
    });
}

// Criar o servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Rota para carregar a página inicial (index.html)
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        serveHTML(res);
    }
    // Rota para carregar pedidos
    else if (parsedUrl.pathname === '/pedidos' && method === 'GET') {
        const pedidos = carregarPedidos();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(pedidos));
    }
    // Rota para carregar clientes
    else if (parsedUrl.pathname === '/clientes' && method === 'GET') {
        const clientes = carregarClientes();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(clientes));
    }
    // Rota para arquivos CSS
    else if (parsedUrl.pathname === '/style.css') {
        serveStaticFile(res, path.join(__dirname, 'style.css'), 'text/css');
    }
    // Rota para arquivos JS
    else if (parsedUrl.pathname === '/script.js') {
        serveStaticFile(res, path.join(__dirname, 'script.js'), 'application/javascript');
    }
    // Caso a rota não seja encontrada
    else {
        res.statusCode = 404;
        res.end('Página não encontrada');
    }
});

// Iniciar o servidor
server.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/`);
});
