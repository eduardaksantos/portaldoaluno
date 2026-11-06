# 🎓 Portal do Aluno

API RESTful para gerenciamento de **Cursos** e **Matrículas**, desenvolvida com Node.js, Express, Shell Script (Bash) e Linux.

Projeto Final Integrador, Back-End 1 (PBE1), SENAI / Binário Tech.

## 👩‍💻 Dupla

- Eduarda Kramer dos Santos
- Emily Sibia de Paula

**Tema escolhido:** 6, Plataforma de Cursos e Matrículas
**Entidades:** Cursos e Matrículas (um curso possui várias matrículas)

---

## 📁 Estrutura do projeto

```
portaldoaluno/
├── server.js               # API REST (Express)
├── testes_automacao.sh     # Script Bash de testes (curl + jq)
├── resultado_execucao.log  # Log de auditoria gerado pelo script
├── package.json
└── README.md
```

---

## ⚙️ Pré-requisitos

```bash
sudo apt update
sudo apt install -y nodejs npm curl jq git
```

---

## 📥 Como clonar, instalar e executar

```bash
# 1. Clonar o repositório
git clone https://github.com/eduardaksantos/portaldoaluno.git
cd portaldoaluno

# 2. Instalar as dependências
npm install

# 3. Subir o servidor (deixe este terminal aberto)
npm start
```

O servidor sobe em **http://localhost:4000**.

> Os dados ficam armazenados **em memória**: ao reiniciar o servidor, tudo é apagado.

---

## 📦 Modelos de dados

**Curso**

| Campo | Descrição |
|---|---|
| id | Gerado automaticamente |
| nome | Nome do curso |
| descricao | Descrição do curso |
| cargaHoraria | Carga horária em horas |
| status | `ATIVO` ou `ENCERRADO` |

**Matrícula**

| Campo | Descrição |
|---|---|
| id | Gerado automaticamente |
| cursoId | ID de um curso existente |
| aluno | Nome do aluno |
| email | E-mail do aluno |
| status | `ATIVA`, `CANCELADA` ou `CONCLUIDA` |

---

## 📡 Endpoints

### Cursos

| Método | Endpoint | Parâmetros | Descrição |
|---|---|---|---|
| GET | `/cursos` | `?status=ATIVO` (opcional) | Lista cursos, com filtro por status |
| GET | `/cursos/:id` | `id` na URL | Busca um curso por ID |
| POST | `/cursos` | Body: nome, descricao, cargaHoraria, status | Cria um curso |
| PUT | `/cursos/:id` | `id` + body completo | Substitui todos os campos |
| PATCH | `/cursos/:id` | `id` + ao menos um campo | Atualiza parcialmente |
| DELETE | `/cursos/:id` | `id` na URL | Remove o curso |

### Matrículas

| Método | Endpoint | Parâmetros | Descrição |
|---|---|---|---|
| GET | `/matriculas` | `?status=ATIVA`, `?cursoId=1` (opcionais) | Lista matrículas, com filtros |
| GET | `/matriculas/:id` | `id` na URL | Busca uma matrícula por ID |
| POST | `/matriculas` | Body: cursoId, aluno, email, status | Cria matrícula (o curso precisa existir) |
| PUT | `/matriculas/:id` | `id` + body completo | Substitui todos os campos |
| PATCH | `/matriculas/:id` | `id` + ao menos um campo | Atualiza parcialmente |
| DELETE | `/matriculas/:id` | `id` na URL | Remove a matrícula |

### Códigos de status HTTP

| Código | Quando ocorre |
|---|---|
| `200 OK` | Consulta, atualização ou remoção bem-sucedida |
| `201 Created` | Recurso criado |
| `400 Bad Request` | Campos obrigatórios ausentes |
| `404 Not Found` | Curso ou matrícula não encontrado |

---

## 🧪 Testes automatizados (Bash)

**Terminal 1**, subir o servidor:

```bash
cd ~/portaldoaluno
npm start
```

**Terminal 2**, executar os testes e gerar o log de auditoria:

```bash
cd ~/portaldoaluno
chmod +x testes_automacao.sh
./testes_automacao.sh > resultado_execucao.log
cat resultado_execucao.log
```

Para começar com dados limpos (IDs a partir de 1), reinicie o servidor antes:

```bash
pkill -f "node server.js"
npm start &
sleep 2
./testes_automacao.sh > resultado_execucao.log
cat resultado_execucao.log
```

O `sleep 2` garante que o servidor esteja ativo antes das requisições.

### Exemplos manuais com curl

```bash
# Criar curso
curl -s -X POST http://localhost:4000/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq

# Listar cursos ativos
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq

# Criar matrícula
curl -s -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq

# Listar matrículas de um curso
curl -s "http://localhost:4000/matriculas?cursoId=1" | jq

# Atualizar parcialmente (PATCH)
curl -s -X PATCH http://localhost:4000/matriculas/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELADA"}' | jq
```

### Testes de erro

```bash
# 400 - corpo incompleto
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"aluno":"Teste"}'

# 404 - curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:4000/cursos/999
```

---

## 🖥️ Gerenciamento de processos

```bash
# Iniciar o servidor em background (logs em servidor.log)
nohup npm start > servidor.log 2>&1 &

# Localizar o processo Node.js (anote o PID)
ps aux | grep node

# Encerrar o processo
kill -9 <PID>

# Confirmar que foi encerrado
ps aux | grep node
```
