# Backend - Blog API 📝

API desenvolvida em **Node.js + Express + TypeScript** com banco **MySQL**, responsável por autenticação de usuários e gerenciamento de artigos (posts) de um sistema de blog.

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- JWT (jsonwebtoken)
- bcrypt
- multer (upload de imagens)
- dotenv
- cors

---

## 📌 Funcionalidades

### 👤 Autenticação

- Cadastro de usuário
- Login com geração de token JWT
- Senhas criptografadas com bcrypt

### 📰 Posts (Artigos)

- Listar posts (público)
- Visualizar post por ID (público)
- Criar post (restrito - usuário autenticado)
- Editar post (restrito - somente autor)
- Remover post (restrito - somente autor)
- Upload de imagem banner do post

---

## 🗂️ Estrutura do projeto

```
src/
  config/
  controllers/
  database/
  middlewares/
  routes/
  services/
  utils/
  app.ts
  server.ts
uploads/
dump.sql
```

---

## ⚙️ Configuração do projeto

### 1) Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd backend-blog
```

### 2) Instalar dependências

```bash
npm install
```

---

## 🛠️ Configuração do Banco de Dados

Este projeto utiliza **MySQL**.

### 1) Criar o banco a partir do dump

O arquivo `dump.sql` está disponível na raiz do projeto.

#### Importando via terminal:

```bash
mysql -u root -p < dump.sql
```

Ou, se preferir, importe usando o **MySQL Workbench**:

- Server → Data Import
- Import from Self-Contained File
- Selecione o arquivo `dump.sql`
- Start Import

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto seguindo este exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUASENHA
DB_NAME=blog_db

JWT_SECRET=supersecret123
```

> Recomenda-se criar também um `.env.example` para facilitar a configuração.

---

## ▶️ Rodando o projeto

### Ambiente de desenvolvimento

```bash
npm run dev
```

O servidor ficará disponível em:

```
http://localhost:3000
```

---

## 📍 Rotas da API

### Health Check

#### `GET /health`

Resposta:

```json
{ "status": "ok" }
```

---

## 👤 Auth

### Cadastro

#### `POST /auth/register`

Body:

```json
{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "123456"
}
```

Resposta (exemplo):

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com"
  }
}
```

---

### Login

#### `POST /auth/login`

Body:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

Resposta (exemplo):

```json
{
  "token": "SEU_TOKEN_JWT",
  "user": {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com"
  }
}
```

---

## 📰 Posts

### Listar posts (público)

#### `GET /posts`

---

### Buscar post por ID (público)

#### `GET /posts/:id`

---

### Criar post (privado)

#### `POST /posts`

### Editar post (privado)

#### PUT /posts/:id

### Remover post (privado)

#### DELETE /posts/:id

### Listar meus posts (privado)

### Usuário Logado

#### GET /posts/me (privado)

Requer Header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

Formato: `multipart/form-data`

Campos:

- `title` (texto)
- `content` (texto)
- `banner` (arquivo - imagem)

---

### Editar post (privado)

#### `PUT /posts/:id`

Requer Header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

Body:

```json
{
  "title": "Novo título",
  "content": "Novo conteúdo"
}
```

---

### Remover post (privado)

#### `DELETE /posts/:id`

Requer Header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

---

## 🖼️ Uploads (imagens)

As imagens são salvas localmente na pasta:

```
/uploads
```

E ficam disponíveis via URL:

```
http://localhost:3000/uploads/NOME_DO_ARQUIVO.png
```

---

## ✅ Observações importantes

- Apenas usuários autenticados podem criar/editar/remover posts.
- Apenas o autor do post pode editar/remover seu próprio post.
- O banco pode ser recriado facilmente usando o arquivo `dump.sql`.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
