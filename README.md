# 🎓 Portal do Aluno

API RESTful para gerenciamento de **Cursos** e **Matrículas**, desenvolvida com Node.js, Express, Shell Script (Bash) e Linux Debian.

Projeto Final Integrador, Back-End 1 (PBE1), SENAI / Binário Tech.

## 👩‍💻 Dupla

- Eduarda Kramer dos Santos
- Emily Sibia de Paula

**Tema escolhido:** 6, Plataforma de Cursos e Matrículas.
**Entidades:** Cursos e Matrículas (um curso possui várias matrículas).

## 📁 Estrutura do projeto

```
portaldoaluno/
├── server.js               # API REST (Express)
├── testes_automacao.sh     # Script Bash de testes (curl + jq)
├── resultado_execucao.log  # Log gerado pelo script
├── package.json
├── .gitignore              # ignora node_modules/
└── README.md
```

## ⚙️ Pré-requisitos

```bash
sudo apt update
sudo apt install -y nodejs npm curl jq git
```

## 📥 Como clonar, instalar e executar

```bash
# 1. Clonar o repositório
git clone https://github.com/eduardaksantos/portaldoaluno.git
cd portaldoaluno

# 2. Instalar as dependências (obrigatório em cada máquina nova)
npm install

# 3. Subir o servidor (deixe este terminal aberto)
npm start
```

O servidor sobe em `http://localhost:4000`.

> Os dados ficam armazenados **em memória**: ao reiniciar o servidor, tudo é apagado e os IDs voltam a começar em 1.
>
> A pasta `node_modules` não vai para o GitHub. Se aparecer `Cannot find module 'express'`, rode `npm install`.

## 📦 Modelos de dados

### Curso

| Campo | Descrição |
|---|---|
| id | Gerado automaticamente |
| nome | Nome do curso |
| descricao | Descrição do curso |
| cargaHoraria | Carga horária em horas |
| status | ATIVO ou ENCERRADO |

### Matrícula

| Campo | Descrição |
|---|---|
| id | Gerado automaticamente |
| cursoId | ID de um curso existente |
| aluno | Nome do aluno |
| email | E-mail do aluno |
| status | ATIVA, CANCELADA ou CONCLUIDA |

## 📡 Endpoints

### Cursos

| Método | Endpoint | Parâmetros | Descrição |
|---|---|---|---|
| GET | /cursos | `?status=ATIVO` (opcional) | Lista cursos, com filtro por status |
| GET | /cursos/:id | id na URL | Busca um curso por ID |
| POST | /cursos | Body: nome, descricao, cargaHoraria, status | Cria um curso |
| PUT | /cursos/:id | id + body completo | Substitui todos os campos |
| PATCH | /cursos/:id | id + ao menos um campo | Atualiza parcialmente |
| DELETE | /cursos/:id | id na URL | Remove o curso |

### Matrículas

| Método | Endpoint | Parâmetros | Descrição |
|---|---|---|---|
| GET | /matriculas | `?status=ATIVA`, `?cursoId=1` (opcionais) | Lista matrículas, com filtros |
| GET | /matriculas/:id | id na URL | Busca uma matrícula por ID |
| POST | /matriculas | Body: cursoId, aluno, email, status | Cria matrícula (o curso precisa existir) |
| PUT | /matriculas/:id | id + body completo | Substitui todos os campos |
| PATCH | /matriculas/:id | id + ao menos um campo | Atualiza parcialmente |
| DELETE | /matriculas/:id | id na URL | Remove a matrícula |

### Códigos de status HTTP

| Código | Quando ocorre |
|---|---|
| 200 OK | Consulta, atualização ou remoção bem-sucedida |
| 201 Created | Recurso criado |
| 400 Bad Request | Campos obrigatórios ausentes |
| 404 Not Found | Curso ou matrícula não encontrado |

## 🧪 Testes automatizados (Bash)

**Terminal 1**, subir o servidor:

```bash
cd ~/portaldoaluno
npm start
```

**Terminal 2**, executar os testes e gerar o log:

```bash
cd ~/portaldoaluno
chmod +x testes_automacao.sh
./testes_automacao.sh | tee resultado_execucao.log
```

Para começar com dados limpos (IDs a partir de 1), reinicie o servidor antes:

```bash
pkill -f "node server.js"
npm start &
sleep 2
./testes_automacao.sh | tee resultado_execucao.log
```

O `sleep 2` garante que o servidor esteja ativo antes das requisições.

## 🔎 Testes manuais com curl (um de cada vez)

Com o servidor ligado em outro terminal e **recém-reiniciado**, rode na ordem abaixo.

### 1. Criar os cursos (201)

```bash
curl -s -X POST http://localhost:4000/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq
```

```bash
curl -s -X POST http://localhost:4000/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Instrumentação","descricao":"Instrumentação Industrial","cargaHoraria":300,"status":"ATIVO"}' | jq
```

### 2. Listar cursos ativos (200)

```bash
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq
```

### 3. Criar as matrículas (201)

Matrícula 1, Eduarda (curso 1):

```bash
curl -s -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq
```

Matrícula 2, Emily (curso 1):

```bash
curl -s -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Emily Sibia de Paula","email":"emily@email.com","status":"ATIVA"}' | jq
```

Matrícula 3, Lucas (curso 2):

```bash
curl -s -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":2,"aluno":"Lucas Silva","email":"lucas@email.com","status":"ATIVA"}' | jq
```

### 4. Listar matrículas de um curso (200)

O filtro `cursoId` usa o ID do **curso**. O curso 1 retorna Eduarda e Emily; o curso 2 retorna só o Lucas.

```bash
curl -s "http://localhost:4000/matriculas?cursoId=1" | jq
```

### 5. Resumo organizado de todas as matrículas (200)

```bash
curl -s http://localhost:4000/matriculas | jq -r '.[] | "\(.id) | curso \(.cursoId) | \(.aluno) | \(.status)"'
```

### 6. Atualizar parcialmente, PATCH (200)

```bash
curl -s -X PATCH http://localhost:4000/matriculas/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELADA"}' | jq
```

### 7. Atualizar tudo, PUT (200)

```bash
curl -s -X PUT http://localhost:4000/cursos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento Full Stack","cargaHoraria":420,"status":"ATIVO"}' | jq
```

### 8. Remover (200)

```bash
curl -s -X DELETE http://localhost:4000/matriculas/3 | jq
```

```bash
curl -s -X DELETE http://localhost:4000/cursos/2 | jq
```

### Testes de erro (400 e 404)

```bash
# 400 - corpo incompleto
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"aluno":"Teste"}'

# 404 - curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:4000/cursos/999

# 404 - matrícula com curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":999,"aluno":"Teste","email":"teste@email.com","status":"ATIVA"}'
```

## 🖥️ Gerenciamento de processos

```bash
# Iniciar o servidor em background (logs em servidor.log)
nohup npm start > servidor.log 2>&1 &

# Localizar o processo Node.js (anote o PID)
ps aux | grep node

# Encerrar o processo
kill -9 <PID>   # troque <PID> pelo número da segunda coluna do ps aux

# Ou encerrar pelo nome
pkill -f "node server.js"

# Confirmar que foi encerrado
ps aux | grep node
```

Se aparecer `EADDRINUSE`, já existe um servidor na porta 4000: encerre-o com `kill` antes de subir outro.

# Subir servidor Limpo e cadastrar os 5 cursos
```bash
cd ~/portaldoaluno
npm start &
sleep 2

curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Petroquímica","descricao":"Processos Petroquímicos","cargaHoraria":360,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Química","descricao":"Química Industrial","cargaHoraria":360,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Eletroeletrônica","descricao":"Sistemas Eletroeletrônicos","cargaHoraria":400,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Instrumentação","descricao":"Instrumentação Industrial","cargaHoraria":300,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Mecânica","descricao":"Mecânica Industrial","cargaHoraria":300,"status":"ENCERRADO"}' | jq
# o ultimo é uma demonstração de curso ENCERRADO

# Para remover cursos

```bash
curl -s -X DELETE http://localhost:4000/cursos/n° do curso q deseja remover | jq
curl -s -X DELETE http://localhost:4000/cursos/6 | jq
curl -s -X DELETE http://localhost:4000/cursos/7 | jq

# Listar novamente para confirmar
```bash
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq
```
# Exemplo de curso INATIVO para demonstração
```bash
Descrição: Depois de cadastrar os 5 cursos como ATIVO, você mostra o PATCH /cursos/5 mudando o curso de Instrumentação para ENCERRADO:

# 1. Altera apenas o status do curso 5 para ENCERRADO (PATCH - 200)
curl -s -X PATCH http://localhost:4000/cursos/5 \
  -H "Content-Type: application/json" \
  -d '{"status":"ENCERRADO"}' | jq

# 2. Filtra só os ATIVOS (vai mostrar apenas os cursos 1, 2, 3 e 4!)
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq

# 3. Filtra só os ENCERRADOS (vai mostrar apenas o curso 5!)
curl -s "http://localhost:4000/cursos?status=ENCERRADO" | jq

Descrição: Já cadastrar um 6º curso como ENCERRADO desde o início
Se quiser manter os 5 cursos intactos como ATIVO, basta adicionar um curso extra de exemplo (ex: Mecânica) já nascendo ENCERRADO:
```

# Remove Matrícula
```bash
curl -s -X DELETE http://localhost:4000/matriculas/3 | jq


curl -s -X POST http://localhost:4000/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mecânica","descricao":"Mecânica Industrial","cargaHoraria":300,"status":"ENCERRADO"}' | jq
```

# PASSO A PASSO DEMONSTRAÇÃO0:
```bash

Reiniciar e Ligar o Servidor Limpo

pkill -f "node"
cd ~/portaldoaluno
npm start &
sleep 2
--------------------------------------------------------------------------------------------------------------------------------------
Passo 1: Criar os Cursos (POST — Status 201)

# Os 5 cursos principais (ATIVOS - IDs 1 a 5)
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Petroquímica","descricao":"Processos Petroquímicos","cargaHoraria":360,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Química","descricao":"Química Industrial","cargaHoraria":360,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Eletroeletrônica","descricao":"Sistemas Eletroeletrônicos","cargaHoraria":400,"status":"ATIVO"}' | jq
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Instrumentação","descricao":"Instrumentação Industrial","cargaHoraria":300,"status":"ATIVO"}' | jq

# 1 curso inativo para demonstrar o filtro depois (ENCERRADO - ID 6)
curl -s -X POST http://localhost:4000/cursos -H "Content-Type: application/json" -d '{"nome":"Mecânica","descricao":"Mecânica Industrial","cargaHoraria":300,"status":"ENCERRADO"}' | jq
--------------------------------------------------------------------------------------------------------------------------------------
Passo 2: Criar as Matrículas (POST — Status 201)

# Matrícula 1: Eduarda em DEV (cursoId: 1)
curl -s -X POST http://localhost:4000/matriculas -H "Content-Type: application/json" -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq

# Matrícula 2: Emily em Petroquímica (cursoId: 2)
curl -s -X POST http://localhost:4000/matriculas -H "Content-Type: application/json" -d '{"cursoId":2,"aluno":"Emily Sibia de Paula","email":"emily@email.com","status":"ATIVA"}' | jq

# Matrícula 3: Eduarda em Química (cursoId: 3)
curl -s -X POST http://localhost:4000/matriculas -H "Content-Type: application/json" -d '{"cursoId":3,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq
--------------------------------------------------------------------------------------------------------------------------------------
Passo 3: Atualizar Parcial (PATCH) e Completo (PUT) — Status 200

# PATCH: altera só o status da matrícula 1
curl -s -X PATCH http://localhost:4000/matriculas/1 -H "Content-Type: application/json" -d '{"status":"CONCLUIDA"}' | jq

# PUT: substitui o curso 1 completo
curl -s -X PUT http://localhost:4000/cursos/1 -H "Content-Type: application/json" -d '{"nome":"DEV","descricao":"Desenvolvimento Full Stack","cargaHoraria":420,"status":"ATIVO"}' | jq
Passo 4: Consultar e Filtrar (GET + Query Params — Status 200)

# Filtra cursos ATIVOS (mostra os 5 cursos principais)
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq

# Filtra cursos ENCERRADOS (mostra SOMENTE Mecânica)
curl -s "http://localhost:4000/cursos?status=ENCERRADO" | jq

# Filtra matrículas por cursoId (mostra só o curso 1)
curl -s "http://localhost:4000/matriculas?cursoId=1" | jq

# Busca individual por ID (:id)
curl -s http://localhost:4000/cursos/2 | jq
-------------------------------------------------------------------------------------------------------------------------------------------

Passo 5: Remover (DELETE — Status 200)

# Remove a matrícula 3
curl -s -X DELETE http://localhost:4000/matriculas/3 | jq
Passo 6: Testar Erros (400 e 404)
Bash
# 400 Bad Request - corpo incompleto
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas -H "Content-Type: application/json" -d '{"aluno":"Teste"}'

# 404 Not Found - curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:4000/cursos/999

# 404 Not Found - matrícula em curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas -H "Content-Type: application/

-----------------------------------------------------------------------------------------------------------------------------------------------
#Para ver o número (PID) e matar manualmente (como o professor costuma pedir):
Liste o processo rodando:

```bash
ps aux | grep node
Pegue o número na segunda coluna (o PID) da linha node server.js e mate com:

Bash
kill -9 <NUMERO_DO_PID>
------------------------------------------------------------------------------------------------------------------------------------------------
# Para apagar algo cadastrado
```bash
curl -s -X DELETE http://localhost:4000/cursos/n° do ID | jq

ex:
curl -s -X DELETE http://localhost:4000/cursos/11 | jq

com matriculas:
curl -s -X DELETE http://localhost:4000/matriculas/1 | jq

conferir se foi apagada:
curl -s http://localhost:4000/matriculas | jq
```
