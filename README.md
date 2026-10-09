<p align="center">
  <img src="ueg_logo.png" width="250">
</p>

# Avaliação N1 - Programação Web II

Este repositório contém o projeto Fullstack desenvolvido como parte da Avaliação N1.

**Universidade:** Universidade Estadual de Goiás (UEG)  
**Disciplina:** Programação Web II  
**Professor:** Braully  
**Aluno:** Danillo Araújo de Paiva  

O projeto implementa uma arquitetura em camadas no Backend utilizando Spring Boot e um Frontend SPA em React, com comunicação via API REST (JSON). A aplicação consiste em um sistema completo de operações CRUD (Criar, Ler, Atualizar, Excluir).

## 🚀 Funcionalidades Implementadas

A aplicação conta com as seguintes entidades, seguindo o padrão de projeto `Controller -> Service -> Repository`:

1. **Usuários**: Cadastro de usuários, com controle de campos (nome, username, email, senha).
2. **Permissões**: Controle e listagem de permissões e descrições do sistema.
3. **Produtos (Entidade de Interesse)**: Entidade escolhida pelo aluno para desenvolvimento das funcionalidades próprias. Possui validações e regras de negócio próprias definidas na camada de serviço (não é permitido produtos com preço negativo ou com nome vazio).

### 🌟 Diferenciais da Entrega

Durante o desenvolvimento do Front-end, o projeto foi expandido para apresentar uma experiência de usuário (UX) premium:
- **Design System Customizado**: Ao invés de CSS padrão, o sistema conta com uma interface moderna com cartões (`cards`), botões estilizados, e modo escuro sutil de alto contraste.
- **Menu de Navegação em Abas (Tabs)**: O sistema original possuía os 3 CRUDs na mesma tela. Para esta entrega, foi desenvolvido um componente de abas interativo, garantindo navegação fluída sem recarregamento da página.
- **Tratamento de Máscara de Moedas**: O cadastro de Produtos possui campo de entrada que converte transparentemente o formato brasileiro (com vírgula) para decimal na comunicação com a API.
- **UX de Formulários**: Adição de validações de exclusão sem pop-ups intrusivos e limpeza automática dos estados para evitar cadastros duplicados acidentais.

## 🛠️ Tecnologias Utilizadas

### Back-end
- Java 17 / 21
- Spring Boot
- Spring Web (Criação da API RESTful)
- Spring Data JPA (Mapeamento Objeto-Relacional)
- Banco de Dados H2 (Em memória para testes)
- Spring Security (Preparação para autenticações futuras)

### Front-end
- React (utilizando Vite)
- TypeScript
- Axios (Integração de APIs)

## 📋 Arquitetura do Projeto

* O **Back-end** está dividido nas camadas `controller`, `service`, `repository` e `model`. Toda a lógica e regra de negócios (como a validação de preços) ocorre exclusivamente dentro da camada de **Serviço**. O Controller apenas delega e roteia as requisições HTTP.
* O **Front-end** utiliza formulários controlados (`useState`) e separa sua estrutura em:
  - `src/components/`: Para formulários, itens da lista e botões de interface reaproveitáveis.
  - `src/pages/`: Para telas que concentram a lógica, buscam os dados da API com Axios e gerenciam estados.

## ⚙️ Como executar o projeto

### Executando o Back-end
Na raiz do projeto (onde está o `pom.xml`), você pode inicializar a aplicação pelo Maven:
```bash
./mvnw spring-boot:run
```
*(O servidor do Spring Boot e o banco de dados H2 subirão automaticamente na porta 8081)*

### 🗄️ Acesso ao Banco de Dados (H2 Console)
Para visualizar o banco de dados e as tabelas criadas:
1. Com o back-end rodando, acesse no navegador: `http://localhost:8081/h2-console`
2. **JDBC URL:** `jdbc:h2:file:./database.db`
3. **User Name:** `sa`
4. **Password:** *(deixe em branco)*

### Executando o Front-end
Para inicializar o React, navegue até a pasta `src/main/frontend` e utilize o NPM:
```bash
cd src/main/frontend
npm install
npm run dev
```
*(Acesse `http://localhost:5173` pelo seu navegador para acessar as telas do sistema)*
