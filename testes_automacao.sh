#!/bin/bash

# ==============================================================================
# PORTAL DO ALUNO - SCRIPT DE AUTOMAÇÃO DE TESTES RESTful API
# Dupla: Eduarda Kramer dos Santos & Emily Sibia de Paula
# Servidor: Node.js / Express rodando na porta 4000
# Cursos: DEV, Instrumentação, Petroquímica, Química e Eletroeletrônica
# ==============================================================================

URL_BASE="http://localhost:4000"

echo "=================================================="
echo "  INICIANDO TESTES AUTOMATIZADOS - PORTAL DO ALUNO"
echo "  Servidor ativo na porta: 4000"
echo "=================================================="

# ------------------------------------------------------------------------------
# ETAPA 1: Cadastro dos 5 cursos oficiais via POST
# ------------------------------------------------------------------------------
echo -e "\n[1/7] POST /cursos - Cadastrando os 5 Cursos Oficiais..."

curl -s -X POST "$URL_BASE/cursos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq

curl -s -X POST "$URL_BASE/cursos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Instrumentação","descricao":"Instrumentação Industrial","cargaHoraria":300,"status":"ATIVO"}' | jq

curl -s -X POST "$URL_BASE/cursos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Petroquímica","descricao":"Processos Petroquímicos","cargaHoraria":360,"status":"ATIVO"}' | jq

curl -s -X POST "$URL_BASE/cursos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Química","descricao":"Química Industrial","cargaHoraria":320,"status":"ATIVO"}' | jq

curl -s -X POST "$URL_BASE/cursos" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Eletroeletrônica","descricao":"Sistemas Eletroeletrônicos","cargaHoraria":400,"status":"ATIVO"}' | jq

# ------------------------------------------------------------------------------
# ETAPA 2: Consulta geral de cursos via GET
# ------------------------------------------------------------------------------
echo -e "\n[2/7] GET /cursos - Listando todos os cursos cadastrados..."
curl -s "$URL_BASE/cursos" | jq

# ------------------------------------------------------------------------------
# ETAPA 3: Cadastro de Matrículas (1 Eduarda, 1 Emily + Nomes Fictícios)
# ------------------------------------------------------------------------------
echo -e "\n[3/7] POST /matriculas - Cadastrando Matrículas (Dupla + Alunos Fictícios)..."

# 1. Eduarda Kramer dos Santos (DEV)
curl -s -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq

# 2. Emily Sibia de Paula (Petroquímica)
curl -s -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"cursoId":3,"aluno":"Emily Sibia de Paula","email":"emily@email.com","status":"ATIVA"}' | jq

# 3. Lucas Silva (Instrumentação)
curl -s -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"cursoId":2,"aluno":"Lucas Silva","email":"lucas@email.com","status":"ATIVA"}' | jq

# 4. Mariana Oliveira (Química)
curl -s -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"cursoId":4,"aluno":"Mariana Oliveira","email":"mariana@email.com","status":"ATIVA"}' | jq

# 5. Gabriel Santos (Eletroeletrônica)
curl -s -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"cursoId":5,"aluno":"Gabriel Santos","email":"gabriel@email.com","status":"ATIVA"}' | jq

# ------------------------------------------------------------------------------
# ETAPA 4: Filtragem com Query Parameters (?cursoId=1)
# ------------------------------------------------------------------------------
echo -e "\n[4/7] GET /matriculas?cursoId=1 - Consultando matrículas do curso DEV..."
curl -s "$URL_BASE/matriculas?cursoId=1" | jq

# ------------------------------------------------------------------------------
# ETAPA 5: Atualização parcial via PATCH
# ------------------------------------------------------------------------------
echo -e "\n[5/7] PATCH /matriculas/1 - Atualizando status da matrícula de Eduarda..."
curl -s -X PATCH "$URL_BASE/matriculas/1" \
  -H "Content-Type: application/json" \
  -d '{"status":"CANCELADA"}' | jq

# ------------------------------------------------------------------------------
# ETAPA 6: Validação de Payload Inválido (Erro 400 Bad Request)
# ------------------------------------------------------------------------------
echo -e "\n[6/7] TESTE DE ERRO (HTTP 400 Bad Request) - Requisição incompleta..."
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$URL_BASE/matriculas" \
  -H "Content-Type: application/json" \
  -d '{"aluno":"Dados incompletos sem email e cursoId"}'

# ------------------------------------------------------------------------------
# ETAPA 7: Teste de ID inexistente (Erro 404 Not Found)
# ------------------------------------------------------------------------------
echo -e "\n[7/7] TESTE DE ERRO (HTTP 404 Not Found) - Curso inexistente..."
curl -s -w "\nHTTP Status: %{http_code}\n" "$URL_BASE/cursos/999"

echo -e "\n=================================================="
echo "  TESTES NA PORTA 4000 FINALIZADOS COM SUCESSO"
echo "=================================================="
