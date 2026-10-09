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
*(O banco de dados H2 subirá automaticamente na porta 8080)*

### Executando o Front-end
Para inicializar o React, navegue até a pasta `src/main/frontend` e utilize o NPM:
```bash
cd src/main/frontend
npm install
npm run dev
```
*(Acesse `http://localhost:5173` pelo seu navegador para acessar as telas do sistema)*
