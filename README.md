<p align="center">
  <img src="ueg_logo.png" width="250" alt="Logo UEG">
</p>

# Avaliação N2 — Trabalho Final: Sistema de E-Commerce & Gestão de Vendas
### Programação Web II — Universidade Estadual de Goiás (UEG)

**Universidade:** Universidade Estadual de Goiás — Câmpus Metropolitano de Trindade  
**Curso:** Bacharelado em Sistemas de Informação  
**Disciplina:** Programação Web II  
**Professor:** Prof. Me. Braully Rocha da Silva  
**Aluno:** Danillo Araújo de Paiva  
**Repositório Oficial:** [https://github.com/Danillosdd/programacao-web-II](https://github.com/Danillosdd/programacao-web-II)

---

## 📌 Visão Geral do Projeto

Este repositório contém a aplicação web **Full-Stack** desenvolvida como **Trabalho Final da Avaliação N2**. 

O projeto expande o esqueleto construído na etapa N1 para uma plataforma completa de **Gestão de E-Commerce e Catálogo Comercial**, integrando controle de acesso baseado em papéis (**RBAC**), autenticação segura stateless com **JSON Web Tokens (JWT)**, validações em camadas com **Bean Validation** e interface Single Page Application (**SPA**) moderna construída com **React**, **TypeScript** e **Tailwind CSS**.

---

## 🏗️ Arquitetura do Sistema

A aplicação adota separação estrita de responsabilidades em arquitetura em camadas no back-end e componentes modulares no front-end:

```
[ Front-end: React 19 + TypeScript + Tailwind CSS ]
                      │  (JSON / HTTP REST + Bearer JWT)
                      ▼
[ Back-end: Spring Boot (Spring Web + Spring Security) ]
  ├── Controller    -> Endpoints RESTful, CORS e controle de acesso (@PreAuthorize)
  ├── Security      -> Filtro JwtFilter, JwtUtil e codificação de senhas (BCrypt)
  ├── Service       -> Regras de negócio, transações e validações de integridade
  ├── Repository   -> Camada de persistência via Spring Data JPA
  └── Model        -> Entidades relacionais mapeadas com Hibernate
                      │
                      ▼
           [ Banco de Dados H2 / PostgreSQL ]
```

---

## 📦 Modelos de Dados e Relacionamentos

A aplicação atende a todos os requisitos mínimos da N2, implementando **5 entidades completas** com seus respectivos repositórios, serviços e controladores:

### 1. Entidades Herdadas da N1
* **`Usuario`**: cadastro de usuários com `nome`, `username`, `email` e `senha` criptografada com `BCryptPasswordEncoder`.
* **`Permissao`**: controle de privilégios (`ADMIN` e `USER`), associado a usuários via relacionamento **Many-to-Many** (`usuario_permissao`).
* **`Produto`**: catálogo de itens com `nome`, `preco` e vinculação à sua categoria.

### 2. Novas Entidades Desenvolvidas para a N2
* **`Categoria` (Relacionamento One-to-Many com Produto):**
  - **Atributos:** `id` (Long, PK), `nome` (String, `@NotBlank`), `descricao` (String), `produtos` (List).
  - **Regras de Negócio (`CategoriaService`):**
    - Impede cadastro de categorias com nomes em branco ou duplicados (`existsByNomeIgnoreCase`).
    - **Proteção de Integridade:** bloqueia a exclusão de categorias que possuam produtos associados.
* **`Pedido` (Relacionamentos Many-to-One e Many-to-Many):**
  - **Atributos:** `id` (Long, PK), `dataPedido` (LocalDateTime), `status` (`PENDENTE`, `PAGO`, `CANCELADO`), `valorTotal` (Double), `observacoes` (String).
  - **Relacionamentos:** vinculado ao `Usuario` comprador (`@ManyToOne`) e aos itens do pedido (`@ManyToMany` com `Produto` via tabela `pedido_produto`).
  - **Regras de Negócio (`PedidoService`):**
    - Atribuição automática da data atual e status inicial `PENDENTE` no `@PrePersist`.
    - Cálculo dinâmico e consistente do valor total baseado nos preços dos produtos selecionados.
    - **Regra Comercial:** impede a exclusão física de pedidos que já estejam com status `PAGO`.

---

## 🔐 Segurança e Autenticação (Aula 10)

* **Spring Security 7 Stateless**: não utiliza sessões HTTP em memória no servidor; cada requisição é validada pelo token presente no cabeçalho `Authorization: Bearer <token>`.
* **Geração e Validação de Tokens JWT (`JJWT 0.12.6`)**:
  - `JwtUtil`: assina o token com algoritmo HMAC-SHA (chave secreta de 32 bytes) e validade de 8 horas.
  - O payload do token transporta as permissões do usuário (`claims`).
* **Filtro de Interceptação (`JwtFilter`)**:
  - Intercepta requisições, valida a assinatura e expiração do token e injeta as autoridades `ROLE_ADMIN` e `ROLE_USER` no contexto de segurança do Spring.
* **Controle por Papéis (RBAC - Role-Based Access Control)**:
  - Anotações `@PreAuthorize("hasRole('ADMIN')")` em operações administrativas (`UsuarioController`, mutações em `PermissaoController` e `CategoriaController`).
* **Carga Inicial Automática (`ConfiguracaoInicial`)**:
  - Popula automaticamente o banco com dados de teste para avaliação imediata:
    - 👑 **Administrador:** `admin` | Senha: `admin123` (Papéis: `ADMIN`, `USER`)
    - 👤 **Usuário Comum:** `joao` | Senha: `joao123` (Papel: `USER`)
    - Categorias iniciais (*Informática*, *Periféricos*, *Escritório*) com produtos vinculados e pedidos de exemplo.

---

## 💻 Módulos do Front-end (React SPA)

* **Gerenciamento de Sessão (`src/services/auth.ts`)**: funções para armazenamento do token no `localStorage`, leitura de permissões (`temPapel("ADMIN")`) e rotina de logout (`sair()`).
* **Interceptors Axios (`src/services/api.ts`)**:
  - Injeta automaticamente o cabeçalho `Authorization: Bearer` em todas as chamadas HTTP.
  - Trata erros `401 Unauthorized`, limpando a sessão e redirecionando automaticamente para `/login`.
* **Proteção de Rotas com React Router**:
  - Componente `<RequireAuth>` bloqueia acessos a rotas privadas de usuários não autenticados.
* **Telas Implementadas**:
  - 🔑 **`/login` (`LoginPage`)**: formulário de autenticação estilizado com validação de credenciais.
  - 🏠 **`/` (`Home`)**: dashboard com visão geral, cartões dinâmicos de atalho e saudação ao usuário logado.
  - 📁 **`/categorias` (`CategoriasPage`)**: listagem em cards, badges com contagem de produtos e formulário controlado (`CategoriaForm`).
  - 📦 **`/produtos` (`ProdutosPage`)**: CRUD de produtos com seleção de categoria e formatação de moeda em Real (R$).
  - 🛍️ **`/pedidos` (`PedidosPage`)**: histórico de pedidos, abas de filtro por status (*TODOS*, *PENDENTE*, *PAGO*, *CANCELADO*), formulário com checkboxes e **cálculo do total em tempo real**, além de botões rápidos para transição de status (*Marcar Pago*, *Cancelar*, *Marcar Pendente*).
  - 👥 **`/usuarios` e `/atribuir-permissoes`**: módulos administrativos visíveis exclusivamente para quem possui o papel `ADMIN`.

---

## 🛠️ Tecnologias Empregadas

### Back-end
- Java 17+
- Spring Boot
- Spring Web (API RESTful)
- Spring Data JPA & Hibernate
- Spring Boot Starter Validation (Bean Validation)
- Spring Security
- JJWT (io.jsonwebtoken 0.12.6)
- Banco de Dados H2 (Modo arquivo / persistente)

### Front-end
- React 19
- TypeScript
- Vite
- Tailwind CSS (Utility-First CSS)
- React Router DOM
- Axios

---

## 🚀 Como Executar o Projeto Localmente

### 1. Inicializando o Back-end
Na raiz do projeto (onde está localizado o `pom.xml`):
```bash
./mvnw spring-boot:run
```
* O servidor subirá na porta **`8090`**.
* O endpoint raiz (`http://localhost:8090/`) possui redirecionamento automático configurado para a porta do front-end (`http://localhost:5173`).

### 2. Acesso ao Console do Banco de Dados H2
Com o back-end em execução:
1. Acesse: **[http://localhost:8090/h2-console](http://localhost:8090/h2-console)**
2. **JDBC URL:** `jdbc:h2:file:./database.db`
3. **User Name:** `sa`
4. **Password:** *(deixe em branco)*

### 3. Inicializando o Front-end
Em outro terminal, navegue até a pasta `src/main/frontend`:
```bash
cd src/main/frontend
npm install
npm run dev
```
* A aplicação web estará acessível no seu navegador em: **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Credenciais Pré-configuradas para Testes

| Perfil | Usuário | Senha | Permissões | Acesso no Sistema |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | `ADMIN`, `USER` | Acesso total: Usuários, Permissões, Categorias, Produtos e Pedidos |
| **Usuário Comum** | `joao` | `joao123` | `USER` | Acesso ao catálogo de Produtos, Categorias e Emissão/Acompanhamento de Pedidos |

---

## 📄 Documentos de Avaliação

Os documentos formais de entrega e apresentação da Avaliação N2 estão disponíveis:
* **Slides de Apresentação:** `apresentacao_trabalho_final_n2.pdf` (gerado e disponível na Área de Trabalho para anexo no Google Classroom).
* **Definição de Tema e Grupo:** aprovada e entregue via Google Classroom no Marco 1 da N2.
