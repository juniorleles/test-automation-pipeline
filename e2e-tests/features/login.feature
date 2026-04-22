# language: pt

@login
Funcionalidade: Autenticação de Usuário
  Como um usuário do sistema
  Quero fazer login na aplicação
  Para acessar as funcionalidades protegidas

  Contexto:
    Dado que estou na página de login

  # ─────────────────────────────────────────────
  # FLUXOS POSITIVOS
  # ─────────────────────────────────────────────

  @positivo @smoke
  Cenário: Login com credenciais válidas
    Quando preencho o usuário com "tomsmith"
    E preencho a senha com "SuperSecretPassword!"
    E clico no botão de login
    Então devo ser redirecionado para a área segura
    E devo ver a mensagem de boas-vindas "You logged into a secure area!"
    E devo ver o botão de logout

  @positivo
  Cenário: Login bem-sucedido e navegação para área segura
    Quando preencho o usuário com "tomsmith"
    E preencho a senha com "SuperSecretPassword!"
    E clico no botão de login
    Então devo estar na URL "/secure"
    E o heading da página deve conter "Secure Area"

  @positivo
  Cenário: Logout após login bem-sucedido
    Quando preencho o usuário com "tomsmith"
    E preencho a senha com "SuperSecretPassword!"
    E clico no botão de login
    Então devo ser redirecionado para a área segura
    Quando clico no botão de logout
    Então devo ser redirecionado para a página de login
    E devo ver a mensagem "You logged out of the secure area!"

  # ─────────────────────────────────────────────
  # FLUXOS NEGATIVOS
  # ─────────────────────────────────────────────

  @negativo
  Cenário: Login com senha incorreta
    Quando preencho o usuário com "tomsmith"
    E preencho a senha com "senhaerrada123"
    E clico no botão de login
    Então devo ver a mensagem de erro "Your password is invalid!"
    E devo permanecer na página de login

  @negativo
  Cenário: Login com usuário inexistente
    Quando preencho o usuário com "usuario_que_nao_existe"
    E preencho a senha com "SuperSecretPassword!"
    E clico no botão de login
    Então devo ver a mensagem de erro "Your username is invalid!"
    E devo permanecer na página de login

  @negativo
  Cenário: Login com ambos os campos em branco
    Quando deixo o campo usuário em branco
    E deixo o campo senha em branco
    E clico no botão de login
    Então devo ver a mensagem de erro "Your username is invalid!"
    E devo permanecer na página de login

  @negativo
  Cenário: Login apenas com usuário preenchido e senha em branco
    Quando preencho o usuário com "tomsmith"
    E deixo o campo senha em branco
    E clico no botão de login
    Então devo ver a mensagem de erro "Your password is invalid!"
    E devo permanecer na página de login

  @negativo
  Cenário: Login apenas com senha preenchida e usuário em branco
    Quando deixo o campo usuário em branco
    E preencho a senha com "SuperSecretPassword!"
    E clico no botão de login
    Então devo ver a mensagem de erro "Your username is invalid!"
    E devo permanecer na página de login

  @negativo
  Esquema do Cenário: Login com múltiplas credenciais inválidas
    Quando preencho o usuário com "<usuario>"
    E preencho a senha com "<senha>"
    E clico no botão de login
    Então devo ver a mensagem de erro "<mensagem_erro>"
    E devo permanecer na página de login

    Exemplos:
      | usuario              | senha                 | mensagem_erro              |
      | wronguser            | SuperSecretPassword!  | Your username is invalid!  |
      | tomsmith             | wrongpassword         | Your password is invalid!  |
      | admin                | admin                 | Your username is invalid!  |
      | tomsmith@email.com   | SuperSecretPassword!  | Your username is invalid!  |
