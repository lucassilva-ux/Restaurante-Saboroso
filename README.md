# Projeto Restaurante Saboroso

<p align="center">
  Aplicação web desenvolvida com <strong>Node.js</strong>, <strong>Express</strong>,
  <strong>EJS</strong> e <strong>MySQL</strong>, simulando o sistema de um restaurante
  com área pública e painel administrativo completo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

---

## Sobre o projeto

Este projeto foi desenvolvido para praticar conceitos de:

- Node.js e Express
- Renderização dinâmica com EJS
- CRUD completo no painel administrativo
- Integração com MySQL
- Upload de arquivos
- Paginação e filtros
- Gráficos com Chart.js
- Atualização em tempo real com Socket.io

A aplicação possui:

- área pública do restaurante;
- formulário de reservas;
- formulário de contatos;
- painel administrativo com autenticação e gerenciamento de dados.

---

# 📂 Estrutura do projeto

```bash
Restaurante-Saboroso
├── bin
├── inc
├── public
│   ├── admin
│   ├── css
│   ├── db
│   │   └── mysql.sql
│   ├── fonts
│   ├── images
│   └── js
├── routes
├── views
│   ├── admin
│   ├── inc
│   ├── contact.ejs
│   ├── error.ejs
│   ├── index.ejs
│   ├── menu.ejs
│   ├── reservations.ejs
│   └── services.ejs
├── .env
├── .env.example
├── app.js
├── package.json
└── README.md
```

---

# Importante

Para o projeto funcionar corretamente, é necessário ter:

- ✅ MySQL em execução
- ✅ Redis em execução
- ✅ Banco importado a partir do arquivo `public/db/mysql.sql`
- ✅ Arquivo `.env` configurado

O painel administrativo utiliza sessão com Redis e os dados principais são persistidos no MySQL.

---

# Funcionalidades

- ✅ Página inicial pública do restaurante
- ✅ Exibição do menu do restaurante
- ✅ Formulário de reservas
- ✅ Formulário de contatos
- ✅ Cadastro de e-mails
- ✅ Painel administrativo com login
- ✅ CRUD de menus
- ✅ CRUD de reservas
- ✅ CRUD de usuários
- ✅ Exclusão de contatos e e-mails
- ✅ Paginação nas listagens
- ✅ Filtro por data em reservas
- ✅ Gráfico de reservas
- ✅ Dashboard com atualização em tempo real via Socket.io
- ✅ Upload de imagens para menus

---

# Tecnologias utilizadas

| Tecnologia | Descrição |
|------------|------------|
| Node.js | Ambiente backend |
| Express.js | Framework web |
| EJS | Renderização de views |
| MySQL | Banco de dados principal |
| Redis | Sessão do painel administrativo |
| Socket.io | Atualização em tempo real |
| Chart.js | Gráfico de reservas |
| Formidable | Upload e parse de formulários |
| JavaScript | Linguagem principal |
| HTML/CSS | Interface da aplicação |

---

# Como executar o projeto

## Clone o repositório

```bash
git clone https://github.com/lucassilva-ux/Restaurante-Saboroso.git
```

---

# Configuração inicial

## 1️⃣ Acesse a pasta do projeto

```bash
cd Restaurante-Saboroso
```

---

## 2️⃣ Instale as dependências

```bash
npm install
```

---

## 3️⃣ Configure o arquivo `.env`

Use o `.env.example` como base:

```env
DB_HOST=*
DB_USER=*
DB_PASSWORD=*
DB_NAME=*
```

---

## 4️⃣ Importe o banco de dados

Importe o arquivo:

```bash
public/db/mysql.sql
```

no seu MySQL.

---

## 5️⃣ Inicie o Redis

O projeto espera o Redis rodando localmente na porta padrão `6379`.

---

## 6️⃣ Execute a aplicação

```bash
npm start
```

Servidor disponível em:

```bash
http://localhost:3000
```

---

# Área administrativa

Após iniciar a aplicação, o painel administrativo pode ser acessado em:

```bash
http://localhost:3000/admin
```

No painel é possível gerenciar:

- reservas;
- contatos;
- usuários;
- menus;
- e-mails cadastrados.

---

# Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm start` | Inicia a aplicação com `nodemon app.js` |

---

# Recursos utilizados

| Recurso | Link |
|---|---|
| Express.js | https://expressjs.com/ |
| Socket.io | https://socket.io/ |
| Chart.js | https://www.chartjs.org/ |
| MySQL | https://dev.mysql.com/doc/ |
| Redis | https://redis.io/docs/ |
| Formidable | https://github.com/node-formidable/formidable |

---

# Aprendizados

Durante o desenvolvimento deste projeto foram praticados conceitos como:

- estruturação de aplicações Node.js;
- organização de rotas e views;
- autenticação administrativa;
- integração com MySQL e Redis;
- upload de arquivos;
- paginação e filtros;
- gráficos dinâmicos;
- comunicação em tempo real com Socket.io.

---

Projeto desenvolvido para fins de estudo e prática na trilha da **Saipos**.

---
