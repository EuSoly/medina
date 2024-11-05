const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Porta do servidor
const porta = 3000;

// Carregar os pedidos dos clientes
function carregarPedidos() {
    try {
        const data = fs.readFileSync('pedidos.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Retorna um array vazio caso o arquivo não exista ou seja inválido
    }
}

// Atualizar os pedidos no arquivo JSON
function atualizarPedidos(pedidos) {
    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 4), 'utf8');
}

// Servir o arquivo HTML
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

// Servir arquivos estáticos (CSS, JS)
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

    // Rota para a página principal (index.html)
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
    // Rota para arquivos CSS
    else if (parsedUrl.pathname === '/style.css') {
        serveStaticFile(res, path.join(__dirname, 'style.css'), 'text/css');
    }
    // Rota para arquivos JS
    else if (parsedUrl.pathname === '/script.js') {
        serveStaticFile(res, path.join(__dirname, 'script.js'), 'application/javascript');
    }
    // Rota para atualizar o arquivo JSON (remover pedido)
    else if (parsedUrl.pathname === '/atualizar-pedidos' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const pedidosAtualizados = JSON.parse(body);
                atualizarPedidos(pedidosAtualizados);
                res.statusCode = 200;
                res.end('Pedidos atualizados com sucesso!');
            } catch (error) {
                res.statusCode = 400;
                res.end('Erro ao processar a requisição.');
            }
        });
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
