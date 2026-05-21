# Hidropag API 🚀

API corporativa robusta desenvolvida para a gestão e otimização do ecossistema de obras, empreendimentos e fluxos financeiros (como faturação de notas fiscais e controlo de alçadas de aprovação). Desenvolvida com a plataforma **Node.js** utilizando a framework progressiva **NestJS** sob princípios rigorosos de arquitetura de software, visando manutenibilidade, testabilidade e segurança *by design*.

Este projeto foi consolidado para a disciplina de **Desenvolvimento de Aplicações Corporativas / Arquitetura de Software** na **Faculdade Senac Porto Alegre**.

---

## 👥 Autores do Projeto
* **Ivan Silva**
* **Andreia Dias**
* **Data:** Maio de 2026

---

## 🏛️ Estrutura do Sistema e Arquitetura

O ecossistema backend está estruturado seguindo os padrões de **Arquitetura em Camadas (Layered Architecture)**, combinando a modularidade nativa do NestJS com conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)**. 

### Módulos Implementados:
* **`UsuariosModule`:** Controlo de credenciais, criptografia de palavras-passe com `bcrypt` (através do `HashService`) e login com geração de tokens JWT efémeros.
* **`PerfilModule`:** Gestão dos perfis e papéis (*Roles*) de acesso associados a cada utilizador.
* **`FiliaisModule`:** Registo e controlo das filiais corporativas que gerem as operações.
* **`ObrasEmpreendimentosModule`:** Mapeamento físico dos empreendimentos atrelados diretamente a uma filial corporativa.
* **`NotasFiscaisModule`:** Centralização da receção e auditoria de faturação vinculada obrigatoriamente a uma obra específica.
* **`AprovaçoesModule`:** Fluxo e motor de alçadas para controlo do histórico e estado de autorizações financeiras.

---

## 🔒 Decisões Técnicas de Destaque (Foco no Conceito A)

1. **Validação Defensiva Global (`src/main.ts`)**:
   Inclusão do `ValidationPipe` utilizando as *flags* `whitelist: true` e `forbidNonWhitelisted: true`. Qualquer tentativa de injeção de parâmetros adicionais ou *payloads* maliciosos (*Mass Assignment*) é intercetada de forma imediata na camada HTTP, respondendo com um erro `400 Bad Request`.
   
2. **Segurança Centralizada com JWT e RBAC**:
   * **`TokenMiddleware`**: Registado de forma global no `AppModule`, interceta todas as requisições privadas do sistema, descodifica o token usando a chave secreta e injeta o objeto do utilizador na requisição. Rotas de autenticação (como login) são explicitamente excluídas do filtro para permitir o fluxo de entrada.
   * **`RolesGuard`**: Guarda de rota que faz uso do `Reflector` do NestJS para garantir um controlo fino sobre quais os perfis de acesso que podem interagir com *endpoints* críticos.

3. **Autenticação Direta pelo Swagger**:
   A configuração OpenAPI inclui o método `addBearerAuth()`. Isto adiciona visualmente o ícone de cadeado na interface do Swagger (`/api`), permitindo que os programadores ou auditores façam login, obtenham o Token JWT, cliquem em "Authorize" e testem os *endpoints* protegidos em tempo real.

4. **Persistência Relacional Segura**:
   O ficheiro `src/data-source.ts` padroniza o uso do **PostgreSQL** através do **TypeORM** utilizando o *design pattern Data Mapper*, mantendo regras relacionais estritas, chaves estrangeiras bem delimitadas e transações isoladas para evitar quebras de consistência nos dados.

---

## 🛠️ Stack Tecnológica
* **Framework Principal:** NestJS (v11.x) com TypeScript nativo
* **Mapeamento Objeto-Relacional (ORM):** TypeORM (v0.3.x)
* **Base de Dados:** PostgreSQL
* **Criptografia e Sessão:** bcrypt + `@nestjs/jwt`
* **Documentação Viva:** OpenAPI / Swagger
* **Motor de Testes:** Jest (Testes unitários e testes *End-to-End* `e2e` integrados)

---

## 🚀 Como Executar e Testar o Projeto no VS Code

### 1. Pré-requisitos
Antes de iniciar, certifique-se de que tem instalado no seu ambiente:
* [Node.js](https://nodejs.org/) (Versão LTS recomendada)
* Instância do [PostgreSQL](https://www.postgresql.org/) ativa (local ou via *container* Docker)

### 2. Clonar e Instalar Dependências
Abra o terminal integrado do seu VS Code (atalho `` Ctrl + ` ``) e execute:
```bash
# Clone o repositório do projeto
git clone <url-do-seu-repositorio>

# Aceda à pasta do projeto
cd hidropag

# Instale os pacotes necessários
npm install