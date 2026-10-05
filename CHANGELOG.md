# 📢 Recados e Histórico de Alterações

## [04/10/2026] - Refatoração de Obras e Adição de Testes Unitários
Olá, Andreia! Deixei anotado aqui o resumo do que foi ajustado nesta branch:

### 1. Entidade e Módulo de Obras (`ObrasEmpreendimentos`)
- **Novos campos adicionados na entidade**: `clienteId`, `cno`, `endereco_localizacao`, `valor_previsto`, `status`, `ativo` e `deleted_at` (soft delete).
- **Módulo**: Adicionado o repositório de `Cliente` no `TypeOrmModule.forFeature` para validações de relacionamento.
- **Service**: 
  - Regra que bloqueia salvar obra se a filial ou o cliente não existirem no banco.
  - Regra que impede o cadastro de obras com o mesmo nome.
  - Métodos `desativar` (`ativo: false`) e `excluir` (com `softDelete`).
- **Controller**: Remoção da injeção direta do TypeORM Repository (agora tudo passa pelo Service).

### 2. Testes Unitários
- Criamos a suíte de testes unitários do Service (`9 testes passando`) e do Controller de Obras (`7 testes passando`).
- Criamos a base de testes unitários para o módulo de Clientes.
- Para ver como rodar todos os testes, dê uma olhada no arquivo `TESTS.md` que criei na raiz do projeto!

### 3. substiruida o iD de ususarios 
- alterado para uuid
---
### 📌 Recado / Atualizações Recentes (04/10/2026)
> **Atenção:** Atualizamos a entidade `Obras` com novos campos (cliente, CNO, endereço, valor previsto e soft delete) e implementamos os testes unitários de **Obras** e **Clientes**.
> Para conferir os detalhes e comandos dos testes, consulte o arquivo [`TESTS.md`](./TESTS.md).
---