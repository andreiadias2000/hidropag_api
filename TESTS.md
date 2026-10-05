# 📋 Guia de Testes Unitários da API

Este documento descreve os testes unitários automatizados desenvolvidos para o backend, explicando o que cada suíte cobre e como executá-los localmente.

---

## 🏗️ 1. Módulo: Obras e Empreendimentos

### 🔹 `obras-empreendimentos.service.spec.ts`
Testa a camada de **regras de negócio**, isolando o banco de dados via mocks dos repositórios TypeORM.

* **Validações de Inserção (`inserir`)**:
  * Bloqueia o cadastro e retorna erro 404 (`NotFoundException`) se a filial vinculada não existir.
  * Bloqueia o cadastro e retorna erro 404 (`NotFoundException`) se o cliente vinculado for informado e não existir.
  * Impede duplicação retornando erro 400 (`BadRequestException`) se já houver uma obra com o mesmo nome.
  * Cria e persiste a obra com sucesso se todos os dados forem válidos.
* **Consulta por ID (`buscarPorId`)**:
  * Retorna os dados da obra carregando seus relacionamentos (`filial`, `cliente`, `notas`).
  * Lança erro 404 (`NotFoundException`) se o identificador não for localizado.
* **Status Operacional (`desativar`)**:
  * Altera a propriedade `ativo` para `false` mantendo o registro no banco.
* **Exclusão Lógica (`excluir`)**:
  * Executa o `softDelete` preenchendo a coluna `deleted_at`.

### 🔹 `obras-empreendimentos.controller.spec.ts`
Testa a camada de **transporte HTTP** (rotas e parâmetros), garantindo que os dados da requisição cheguem ao serviço.

* **`POST /obras`**: Repassa o DTO de criação para o método `service.inserir`.
* **`GET /obras`**: Aciona a listagem completa via `service.listar`.
* **`GET /obras/:id`**: Envia o UUID recebido na rota para `service.buscarPorId`.
* **`PUT /obras/:id`**: Envia o UUID e os campos de atualização para `service.alterar`.
* **`PATCH /obras/:id/desativar`**: Solicita a desativação operacional via `service.desativar`.
* **`DELETE /obras/:id`**: Dispara a exclusão lógica via `service.excluir`.

---

## 👥 2. Módulo: Clientes

### 🔹 `clientes.service.spec.ts`
Testa os métodos base do serviço de clientes:
* **`create`**: Confirma o retorno da ação de cadastro.
* **`findAll`**: Confirma a listagem geral de clientes.
* **`findOne`**: Valida a resposta formatada para o identificador pesquisado.
* **`update`**: Valida a mensagem de confirmação da atualização do cliente.
* **`remove`**: Valida a mensagem de confirmação de exclusão do cliente.

### 🔹 `clientes.controller.spec.ts`
Testa os endpoints HTTP do módulo de clientes:
* **`POST /clientes`**: Encaminha o corpo da requisição para `service.create`.
* **`GET /clientes`**: Invoca `service.findAll`.
* **`GET /clientes/:id`**: Converte a string da URL para numérico e repassa para `service.findOne`.
* **`PATCH /clientes/:id`**: Converte o ID, repassa o DTO e chama `service.update`.
* **`DELETE /clientes/:id`**: Converte o ID e chama `service.remove`.

---

## 💻 3. Comandos de Execução

Abra o terminal na raiz do projeto (`hidropag_api`) e execute conforme o objetivo:

### Rodar Todos os Testes
Executa todas as suítes e exibe o resumo:
```bash
npm run test