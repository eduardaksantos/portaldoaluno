# portaldoaluno
Portal do Aluno: Plataforma de Cursos e Matrículas; API RESTful para gerenciamento de cursos e matrículas, desenvolvida com Node.js, Express, Bash e Linux Debian como Projeto Final Integrador

👩‍💻 Dupla

- Eduarda Kramer dos Santos
- Emily Sibia de Paula

**Tema escolhido:** 6 — Plataforma de Cursos e Matrículas
**Entidades:** `Cursos` e `Matriculas` (um curso possui várias matrículas)

Pré-requisitos

```bash
sudo apt update
sudo apt install -y nodejs npm curl jq git


## 📥 Como clonar, instalar e executar

```bash
# 1. Clonar o repositório
git clone https://github.com/eduardaksantos/portaldoaluno.git
cd portaldoaluno

# 2. Instalar as dependências
npm install

# 3. Subir o servidor Node.js (deixe este terminal aberto)
npm start


**Terminal 1 — subir o servidor (deixe aberto):**

```bash
cd ~/portaldoaluno
npm start
```

**Terminal 2 — executar os testes:**

```bash
cd ~/portaldoaluno
chmod +x testes_automacao.sh
./testes_automacao.sh > resultado_execucao.log
cat resultado_execucao.log
```
```
# Cadastrar um curso
curl -s -X POST http://localhost:4000/cursos \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq

# Listar todos os cursos
curl -s http://localhost:4000/cursos | jq

# Filtrar cursos por status
curl -s "http://localhost:4000/cursos?status=ATIVO" | jq

# Buscar curso por ID
curl -s http://localhost:4000/cursos/1 | jq

# Atualizar curso completo (PUT)
curl -s -X PUT http://localhost:4000/cursos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":420,"status":"ATIVO"}' | jq

# Atualizar curso parcialmente (PATCH)
curl -s -X PATCH http://localhost:4000/cursos/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"ENCERRADO"}' | jq

# Cadastrar uma matrícula
curl -s -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq

# Listar matrículas de um curso
curl -s "http://localhost:4000/matriculas?cursoId=1" | jq

# Buscar matrícula por ID
curl -s http://localhost:4000/matriculas/1 | jq

# Atualizar matrícula completa (PUT)
curl -s -X PUT http://localhost:4000/matriculas/1 \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"CONCLUIDA"}' | jq

# Atualizar matrícula parcialmente (PATCH)
curl -s -X PATCH http://localhost:4000/matriculas/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELADA"}' | jq

# Remover matrícula
curl -s -X DELETE http://localhost:4000/matriculas/1 | jq

# Remover curso
curl -s -X DELETE http://localhost:4000/cursos/1 | jq

### Para sair mais Limpo!!
Bash
cd ~/portaldoaluno
pkill -f node
npm start &
sleep 2
./testes_automacao.sh > resultado_execucao.log
cat resultado_execucao.log
Ao incluir o sleep 2, o servidor estará 100% ativo quando o script começar a enviar as requisições, gerando o relatório com os registros limpos (IDs de 1 a 5).


### Testes de erro

```bash
# 400 - corpo incompleto
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST http://localhost:4000/matriculas \
  -H "Content-Type: application/json" \
  -d '{"aluno":"Teste"}'

# 404 - curso inexistente
curl -s -w "\nHTTP Status: %{http_code}\n" http://localhost:4000/cursos/999
```

```bash
# 1. (Terminal 1) Subir o servidor e deixar rodando
npm start

# 2. (Terminal 2) Dar permissão de execução (apenas na primeira vez)
chmod +x testes_automacao.sh

# 3. Executar os testes e gerar o log de auditoria
./testes_automacao.sh > resultado_execucao.log

# 4. Ler o log gerado
cat resultado_execucao.log

## 🖥️ Gerenciamento de processos (Linux Debian)

```bash
# Iniciar o servidor em background (os logs vão para servidor.log)
nohup npm start > servidor.log 2>&1 &

# Localizar o processo Node.js (anote o PID)
ps aux | grep node

# Encerrar o processo
kill -9 <PID>

# Confirmar que foi encerrado
ps aux | grep node
```
