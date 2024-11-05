import json
import os
from datetime import datetime

# Função para limpar a tela do terminal
def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

# Função para carregar os dados de clientes do arquivo JSON
def carregar_dados(arquivo):
    dados = {}
    try:
        with open(arquivo, 'r') as file:
            dados = json.load(file)
    except FileNotFoundError:
        print("Arquivo não encontrado. Um novo arquivo será criado.")
    except json.JSONDecodeError:
        print("Erro ao ler os dados do arquivo. O formato pode estar incorreto.")
    return dados

# Função para salvar os dados de clientes no arquivo JSON
def salvar_dados(arquivo, dados):
    with open(arquivo, 'w') as file:
        json.dump(dados, file, indent=4)

# Função para cadastrar um novo cliente
def cadastrar_cliente(arquivo, dados):
    nome = input("Digite seu nome: ")
    cpf = input("Digite seu CPF: ")
    
    if cpf in dados:
        print("CPF já cadastrado. Tente novamente.")
        return
    
    senha = input("Digite sua Senha: ")
    endereco = input("Digite seu endereço de entrega: ")
    
    dados[cpf] = {
        'Nome': nome,
        'Senha': senha,
        'Endereco': endereco
    }
    
    salvar_dados(arquivo, dados)
    print("Cliente cadastrado com sucesso!")

# Função para realizar o login de um cliente
def realizar_login(arquivo):
    dados = carregar_dados(arquivo)
    cpf = input("Digite seu CPF: ")
    
    if cpf not in dados:
        print("CPF não encontrado.")
        return False, None
    
    senha = input("Digite sua Senha: ")
    if dados[cpf]['Senha'] == senha:
        print("Login bem-sucedido!")
        return True, cpf  # Retorna o CPF do cliente após o login
    else:
        print("Senha incorreta.")
        return False, None

# Cardápio de Pizzas com Preços por Tamanho
cardapio = {
    'Salgadas': [
        {'nome': 'Calabresa', 'preco': {'Broto': 15.0, 'Big': 25.0, 'Gigante': 35.0}},
        {'nome': 'Frango com Catupiry', 'preco': {'Broto': 17.0, 'Big': 28.0, 'Gigante': 38.0}},
        {'nome': 'Mussarela', 'preco': {'Broto': 12.0, 'Big': 22.0, 'Gigante': 32.0}},
        {'nome': 'Portuguesa', 'preco': {'Broto': 18.0, 'Big': 30.0, 'Gigante': 40.0}}
    ],
    'Doces': [
        {'nome': 'Chocolate com Morango', 'preco': {'Broto': 16.0, 'Big': 26.0, 'Gigante': 36.0}},
        {'nome': 'Banana com Canela', 'preco': {'Broto': 14.0, 'Big': 24.0, 'Gigante': 34.0}},
        {'nome': 'Romeu e Julieta', 'preco': {'Broto': 15.0, 'Big': 25.0, 'Gigante': 35.0}},
        {'nome': 'Brigadeiro', 'preco': {'Broto': 16.0, 'Big': 27.0, 'Gigante': 37.0}}
    ]
}

# Carrinho de compras
carrinho = []

# Função para exibir o cardápio de uma categoria
def exibir_cardapio_categoria(categoria):
    while True:
        limpar_tela()
        print(f"\n===== Cardápio de Pizzas {categoria} =====")
        for idx, pizza in enumerate(cardapio[categoria], 1):
            print(f"{idx}. {pizza['nome']}")
        print("0. Voltar")
        print("============================")

        escolha = input("Escolha o número da pizza ou digite 0 para voltar: ")
        
        if escolha == '0':
            break  # Volta ao menu de categorias
        elif escolha.isdigit() and 1 <= int(escolha) <= len(cardapio[categoria]):
            pizza_escolhida = cardapio[categoria][int(escolha) - 1]
            escolher_tamanho_pizza(pizza_escolhida)
        else:
            print("Opção inválida. Tente novamente.")
            input("Pressione Enter para continuar...")

# Função para escolher o tamanho da pizza
def escolher_tamanho_pizza(pizza):
    while True:
        limpar_tela()
        print(f"\nVocê escolheu: {pizza['nome']}")
        print("Escolha o tamanho da pizza:")
        print("1. Broto (4 pedaços) - R$ {:.2f}".format(pizza['preco']['Broto']))
        print("2. Big (8 pedaços) - R$ {:.2f}".format(pizza['preco']['Big']))
        print("3. Gigante (12 pedaços) - R$ {:.2f}".format(pizza['preco']['Gigante']))
        print("0. Voltar")

        tamanho_escolha = input("Digite o número do tamanho desejado: ")
        
        if tamanho_escolha == '1':
            tamanho = 'Broto'
            preco = pizza['preco']['Broto']
        elif tamanho_escolha == '2':
            tamanho = 'Big'
            preco = pizza['preco']['Big']
        elif tamanho_escolha == '3':
            tamanho = 'Gigante'
            preco = pizza['preco']['Gigante']
        elif tamanho_escolha == '0':
            break  # Volta ao menu de pizzas
        else:
            print("Opção inválida. Tente novamente.")
            input("Pressione Enter para continuar...")
            continue

        # Adiciona pizza e tamanho ao carrinho
        carrinho.append({'nome': pizza['nome'], 'tamanho': tamanho, 'preco': preco})
        print(f"\n{pizza['nome']} ({tamanho}) - R$ {preco:.2f} adicionado ao carrinho!")
        input("Pressione Enter para voltar ao cardápio de tamanhos...")
        break

# Função para escolher a categoria de pizza
def escolher_categoria(cpf_cliente):
    while True:
        limpar_tela()
        print("Escolha a categoria de pizza:")
        print("1. Pizzas Salgadas")
        print("2. Pizzas Doces")
        print("3. Ver Carrinho")
        print("4. Sair")
        
        escolha = input("Digite sua escolha: ")
        
        if escolha == '1':
            exibir_cardapio_categoria('Salgadas')
        elif escolha == '2':
            exibir_cardapio_categoria('Doces')
        elif escolha == '3':
            ver_carrinho(cpf_cliente)
        elif escolha == '4':
            print("Saindo do menu de escolha.")
            break
        else:
            print("Opção inválida.")
            input("Pressione Enter para continuar...")

# Função para ver o carrinho de compras
def ver_carrinho(cpf_cliente):
    while True:
        limpar_tela()
        if not carrinho:
            print("Seu carrinho está vazio.")
        else:
            print("\n===== Carrinho de Compras =====")
            total = 0
            for idx, item in enumerate(carrinho, 1):
                print(f"{idx}. {item['nome']} ({item['tamanho']}) - R$ {item['preco']:.2f}")
                total += item['preco']
            print(f"\nTotal: R$ {total:.2f}")
            print("1. Finalizar Pedido")
            print("0. Voltar")
        
        escolha = input("\nEscolha uma opção: ")
        
        if escolha == '1' and carrinho:
            finalizar_pedido(cpf_cliente)  # Passando o cpf_cliente aqui
            break
        elif escolha == '0':
            break
        else:
            print("Opção inválida. Tente novamente.")
            input("Pressione Enter para continuar...")

# Função para salvar o pedido em um arquivo JSON
def salvar_pedido(arquivo, cpf_cliente, carrinho, total):
    pedido = {
        'cpf': cpf_cliente,
        'itens': [{'nome': item['nome'], 'tamanho': item['tamanho'], 'preco': item['preco']} for item in carrinho],
        'total': total,
        'data': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    # Carregar os pedidos existentes
    try:
        with open(arquivo, 'r') as file:
            pedidos = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        pedidos = []

    # Adicionar o novo pedido
    pedidos.append(pedido)

    # Salvar novamente no arquivo
    with open(arquivo, 'w') as file:
        json.dump(pedidos, file, indent=4)

# Função para finalizar o pedido
def finalizar_pedido(cpf_cliente):
    limpar_tela()
    if not carrinho:
        print("Seu carrinho está vazio.")
    else:
        # Calcular o total do pedido
        total = sum(item['preco'] for item in carrinho)

        print("\n===== Finalizando Pedido =====")
        print("Resumo do Pedido:")
        for item in carrinho:
            print(f"{item['nome']} ({item['tamanho']}) - R$ {item['preco']:.2f}")
        print(f"\nTotal a pagar: R$ {total:.2f}")

        # Salvar o pedido no arquivo
        arquivo_pedidos = 'pedidos.json'
        salvar_pedido(arquivo_pedidos, cpf_cliente, carrinho, total)
        
    carrinho.clear()  # Limpa o carrinho após o pagamento
    input("Pressione Enter para concluir o pedido...")

# Função principal
def main():
    arquivo = 'clientes.json'
    while True:
        limpar_tela()
        print("1. Cadastrar novo cliente")
        print("2. Fazer login")
        print("3. Sair")
        opcao = input("Escolha uma opção: ")

        if opcao == '1':
            dados = carregar_dados(arquivo)
            cadastrar_cliente(arquivo, dados)
        elif opcao == '2':
            sucesso, cpf_cliente = realizar_login(arquivo)
            if sucesso:
                limpar_tela()
                print("Bem-vindo ao sistema da Pizzaria!")
                escolher_categoria(cpf_cliente)  # Passando o cpf_cliente para a função
                break
        elif opcao == '3':
            print("Saindo...")
            break
        else:
            print("Opção inválida. Tente novamente.")

# Rodar o programa
main()
