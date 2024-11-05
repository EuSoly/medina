document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar os pedidos
    async function carregarPedidos() {
        try {
            // Carregar os pedidos do arquivo JSON
            const responsePedidos = await fetch('/pedidos');
            const pedidos = await responsePedidos.json();

            const pedidosList = document.getElementById('pedidos-list');
            pedidosList.innerHTML = ''; // Limpar a lista antes de adicionar novos pedidos

            // Carregar os dados dos clientes
            const responseClientes = await fetch('/clientes');
            const clientes = await responseClientes.json();

            // Exibir cada pedido com as informações completas
            pedidos.forEach((pedido) => {
                // Buscar as informações do cliente com base no CPF
                const cliente = clientes[pedido.cpf];

                // Criar o item de pedido com todas as informações
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Nome:</strong> ${cliente.Nome} <br>
                    <strong>Endereço:</strong> ${cliente.Endereco} <br>
                    <strong>Pedido:</strong> ${pedido.data} <br>
                    <strong>Total:</strong> R$ ${pedido.total.toFixed(2)} <br>
                    <strong>Itens:</strong><br>
                    ${pedido.itens.map(item => `${item.nome} (${item.tamanho}) - R$ ${item.preco.toFixed(2)}`).join('<br>')}
                `;
                pedidosList.appendChild(li);
            });
        } catch (err) {
            console.error('Erro ao carregar pedidos ou clientes:', err);
        }
    }

    // Carregar os pedidos ao carregar a página
    carregarPedidos();
});
