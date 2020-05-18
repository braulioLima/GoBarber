# Atualização do perfil

**RF**
  - O usuário deve poder atualizar seus dados:
  nome, e-mail, senha.

**RNF**

**RN**
 - O usuário não pode alterar seu email para um email já utilizado.
 - Para atualizar sua senha, o usuário deve informar sua senha antiga.
 - Para atualizar sua senha, o usuário deve confirmar a nova senha.
---

# Recuperação de senha

**RF**

  - O usuário deve poder recuperar sua senha informando seu e-mail.
  - O usuário deve receber um e-mail com instruções de recuperação de senha.
  - O usuário deve poder resetar sua senha.

**RNF**

- Utilizar mailtrap para testar envios em ambiente de desenvolvimento.
- Utilizar o Amazon SES pra envios em produção.
- O envio de e-mails deve acontecer em segundo plano (background job).

**RN**
- O link enviado por e-mail deve expirar em 2 horas.
- O usuário precisa confirmar a nova senha ao resetar sua senha.

-----

# Painel do Prestador

**RF**
  - O usuário deve poder listar seus agendamentos de um dia específico.
  - O prestador deve receber uma nova notificação sempre que houver um novo agendamento.
  - O prestador deve poder visualizar as notificações não lidas.


**RNF**

  - Os agendamentos diários do prestador devem ser amazenados em cache.
  - As notificações do prestador devem ser armazenadas no MongoDB.
  - As notificações do usuário devem ser enviadas em tempo real usando Socket.io .

**RN**

  - A notificação deve ter um status, lida ou não lida, para que o prestador possa controlar.

----
# Agendamento de serviços

**RF**

 - O usuário deve poder listar todos os prestadores de serviço cadastrados.
 - O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador.
 - O usuário deve poder listar os horários disponíveis em um dia específico de um prestador.
 - O usuário deve poder realizar um agendamento com um prestador.

**RNF**

- A listagem de prestadores deve ser armazenada em cache.


**RN**
  - Cada agendamento deve durar 1h exatamente.
  - Os agendamentos devem estar disponíveis entre 08h às 18h ( primeiro horário às 8h e último às 17h).
  - O usuário não pode agendar em um horário já ocupado.
  - O usuário não pode agendar em um horário que já passou.
  - O usuário não pode agendar serviços consigo mesmo.
