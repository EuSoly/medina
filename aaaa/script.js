document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar os pedidos
    async function carregarPedidos() {
        const response = await fetch('/pedidos');
        const pedidos = await response.json();

        const pedidosList = document.getElementById('pedidos-list');
        pedidosList.innerHTML = ''; // Limpar a lista antes de adicionar novos pedidos

        pedidos.forEach((pedido, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Pedido:</strong> ${pedido.data} <br>
                <strong>Total:</strong> R$ ${pedido.total.toFixed(2)} <br>
                <strong>Itens:</strong><br>
                ${pedido.itens.map(item => `${item.nome} (${item.tamanho}) - R$ ${item.preco.toFixed(2)}`).join('<br>')}
                <br>
                <button class="info-btn" data-index="${index}">INFO</button>
            `;
            pedidosList.appendChild(li);
        });
    }

    // Carregar os pedidos ao carregar a página
    carregarPedidos();

    // Mostrar o modal com informações do pedido
    document.getElementById('pedidos-list').addEventListener('click', (event) => {
        if (event.target.classList.contains('info-btn')) {
            const pedidoIndex = event.target.getAttribute('data-index');
            mostrarInfoPedido(pedidoIndex);
        }
    });

    // Mostrar informações do pedido no modal
    async function mostrarInfoPedido(index) {
        console.log("Mostrando informações do pedido:", index); // Depuração

        const response = await fetch('/pedidos');
        const pedidos = await response.json();

        const pedido = pedidos[index];
        document.getElementById('modal-nome').textContent = pedido.cliente.nome;
        document.getElementById('modal-endereco').textContent = pedido.cliente.endereco;

        // Exibir o modal
        const modal = document.getElementById('pedido-info-modal');
        modal.style.display = 'flex'; // Mostrar o modal

        // Adicionar a ação para concluir o pedido (evitar múltiplos event listeners)
        const concluirButton = document.getElementById('concluir-pedido');
        concluirButton.onclick = async () => {
            console.log("Pedido concluído:", index); // Depuração
            await concluirPedido(index);
            modal.style.display = 'none'; // Fechar o modal
            carregarPedidos(); // Recarregar a lista de pedidos
        };
    }

    // Função para concluir o pedido e removê-lo do arquivo JSON
    async function concluirPedido(index) {
        const response = await fetch('/pedidos');
        const pedidos = await response.json();

        // Remover o pedido concluído
        pedidos.splice(index, 1);

        // Atualizar o arquivo JSON
        await fetch('/atualizar-pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidos)
        });

        console.log("Pedidos atualizados após remoção do pedido", pedidos); // Depuração
    }

    // Fechar o modal ao clicar no botão "Fechar"
    document.getElementById('fechar-modal').addEventListener('click', () => {
        document.getElementById('pedido-info-modal').style.display = 'none';
    });

    // Função para logout (simulação)
    document.getElementById('logout-button').addEventListener('click', () => {
        alert('Você foi deslogado!');
        // Aqui seria o redirecionamento ou limpeza de sessão
    });
});
