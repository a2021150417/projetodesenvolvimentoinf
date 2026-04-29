# Backend - API Sistema de Bilhetes

## Instalação

```bash
cd backend
npm install
```

## Configuração

Abre o ficheiro `.env` e preenche a password da tua base de dados:

```
DB_NAME=quickpass     ← nome da base de dados que criaste no DBngin
DB_USER=postgres      ← utilizador padrão do PostgreSQL
DB_PASSWORD=          ← deixa vazio se não definiste password
```

## Iniciar o servidor

```bash
# Modo normal
npm start

# Modo desenvolvimento (reinicia automaticamente ao guardar)
npm run dev
```

O servidor fica disponível em: http://localhost:3001

---

## Rotas disponíveis

### Utilizadores
| Método | Rota                        | Descrição              |
|--------|-----------------------------|------------------------|
| GET    | /api/utilizadores           | Listar todos           |
| GET    | /api/utilizadores/:id       | Obter um utilizador    |
| POST   | /api/utilizadores           | Criar utilizador       |
| PUT    | /api/utilizadores/:id       | Atualizar utilizador   |
| DELETE | /api/utilizadores/:id       | Apagar utilizador      |

### Eventos
| Método | Rota                  | Descrição         |
|--------|-----------------------|-------------------|
| GET    | /api/eventos          | Listar todos      |
| GET    | /api/eventos/:id      | Obter um evento   |
| POST   | /api/eventos          | Criar evento      |
| PUT    | /api/eventos/:id      | Atualizar evento  |
| DELETE | /api/eventos/:id      | Apagar evento     |

### Bilhetes
| Método | Rota                              | Descrição                    |
|--------|-----------------------------------|------------------------------|
| GET    | /api/bilhetes                     | Listar todos                 |
| GET    | /api/bilhetes/utilizador/:id      | Bilhetes de um utilizador    |
| POST   | /api/bilhetes                     | Comprar bilhete              |
| DELETE | /api/bilhetes/:id                 | Cancelar bilhete             |

---

## Exemplo de uso no React

```javascript
// Buscar eventos
const response = await fetch("http://localhost:3001/api/eventos");
const eventos = await response.json();

// Comprar bilhete
const response = await fetch("http://localhost:3001/api/bilhetes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id_utilizador: 1, id_evento: 1 })
});
const bilhete = await response.json();
```
