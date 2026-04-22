# language: pt

@checkout @saucedemo
Funcionalidade: Checkout de Produtos — SauceDemo
  Como um cliente do e-commerce
  Quero adicionar produtos ao carrinho e finalizar a compra
  Para receber meus produtos com sucesso

  Contexto:
    Dado que estou logado no SauceDemo como "standard_user"

  # ─────────────────────────────────────────────
  # FLUXOS POSITIVOS
  # ─────────────────────────────────────────────

  @positivo @smoke
  Cenário: Compra completa com um produto e dados válidos
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Então o carrinho deve conter 1 produto
    Quando prossigo para o checkout
    E preencho os dados de entrega com nome "João" sobrenome "Silva" e CEP "01310-100"
    E confirmo os dados do pedido
    Então devo ver o resumo do pedido com o produto "Sauce Labs Backpack"
    Quando finalizo a compra
    Então devo ver a mensagem de confirmação "Thank you for your order!"

  @positivo
  Cenário: Compra com múltiplos produtos
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E adiciono o produto "Sauce Labs Bike Light" ao carrinho
    E adiciono o produto "Sauce Labs Bolt T-Shirt" ao carrinho
    E acesso o carrinho
    Então o carrinho deve conter 3 produtos
    Quando prossigo para o checkout
    E preencho os dados de entrega com nome "Maria" sobrenome "Oliveira" e CEP "04538-133"
    E confirmo os dados do pedido
    Então o valor total do pedido deve ser maior que 0
    Quando finalizo a compra
    Então devo ver a mensagem de confirmação "Thank you for your order!"

  @positivo
  Cenário: Remover produto do carrinho antes do checkout
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E adiciono o produto "Sauce Labs Bike Light" ao carrinho
    E acesso o carrinho
    Então o carrinho deve conter 2 produtos
    Quando removo o produto "Sauce Labs Backpack" do carrinho
    Então o carrinho deve conter 1 produto
    Quando prossigo para o checkout
    E preencho os dados de entrega com nome "Carlos" sobrenome "Santos" e CEP "20040-020"
    E confirmo os dados do pedido
    Quando finalizo a compra
    Então devo ver a mensagem de confirmação "Thank you for your order!"

  @positivo
  Cenário: Continuar comprando após adicionar ao carrinho
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    Então o badge do carrinho deve exibir "1"
    Quando adiciono o produto "Sauce Labs Fleece Jacket" ao carrinho
    Então o badge do carrinho deve exibir "2"
    E acesso o carrinho
    Então o carrinho deve conter 2 produtos

  # ─────────────────────────────────────────────
  # FLUXOS NEGATIVOS
  # ─────────────────────────────────────────────

  @negativo
  Cenário: Tentar finalizar checkout com formulário em branco
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E clico em continuar sem preencher os dados
    Então devo ver o erro de campo obrigatório "First Name is required"

  @negativo
  Cenário: Tentar finalizar checkout sem sobrenome
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E preencho apenas o primeiro nome com "João"
    E clico em continuar sem preencher os dados restantes
    Então devo ver o erro de campo obrigatório "Last Name is required"

  @negativo
  Cenário: Tentar finalizar checkout sem CEP
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E preencho o nome "João" e sobrenome "Silva" sem CEP
    E clico em continuar sem preencher os dados restantes
    Então devo ver o erro de campo obrigatório "Postal Code is required"

  @negativo
  Cenário: Cancelar checkout e retornar ao carrinho
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E cancelo o checkout
    Então devo retornar à página do carrinho

  @negativo
  Cenário: Cancelar na página de revisão do pedido
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E preencho os dados de entrega com nome "João" sobrenome "Silva" e CEP "01310-100"
    E confirmo os dados do pedido
    E cancelo o pedido na revisão
    Então devo retornar à página de produtos

  @negativo
  Cenário: Tentar checkout com carrinho vazio
    Quando acesso o carrinho diretamente
    Então o carrinho deve estar vazio
    Quando prossigo para o checkout
    E preencho os dados de entrega com nome "João" sobrenome "Silva" e CEP "01310-100"
    E confirmo os dados do pedido
    Então o resumo do pedido não deve conter produtos

  @negativo
  Esquema do Cenário: Validação de campos obrigatórios com múltiplas combinações
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E acesso o carrinho
    Quando prossigo para o checkout
    E preencho o formulário com firstName "<primeiro_nome>" lastName "<sobrenome>" postalCode "<cep>"
    E clico em continuar sem preencher os dados restantes
    Então devo ver o erro de campo obrigatório "<mensagem_erro>"

    Exemplos:
      | primeiro_nome | sobrenome | cep        | mensagem_erro               |
      |               | Silva     | 01310-100  | First Name is required      |
      | João          |           | 01310-100  | Last Name is required       |
      | João          | Silva     |            | Postal Code is required     |
