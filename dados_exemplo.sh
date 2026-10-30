#!/bin/bash
# ============================================================
# DADOS DE EXEMPLO - Portal do Aluno
# Cadastra 5 cursos de exemplo na API para simulação.
# Uso: ./dados_exemplo.sh   (a API precisa estar rodando)
# ============================================================

# Endereço da rota de cursos (a API roda na porta 4000)
URL="http://localhost:4000/cursos"

# Cabeçalho que avisa a API que estamos enviando JSON
TIPO="Content-Type: application/json"

# Cada comando abaixo faz um POST (cria um curso).
#   -s  = modo silencioso (não mostra barra de progresso)
#   -X  = método HTTP usado (POST)
#   -H  = cabeçalho da requisição
#   -d  = dados (body) enviados em JSON
# O "echo" sozinho só pula uma linha, para a saída ficar organizada.

# Curso 1
curl -s -X POST $URL -H "$TIPO" -d '{"nome":"DEV","descricao":"Desenvolvimento de sistemas","cargaHoraria":400,"status":"ATIVO"}'
echo

# Curso 2
curl -s -X POST $URL -H "$TIPO" -d '{"nome":"Instrumentação","descricao":"Controle de processos industriais","cargaHoraria":360,"status":"ATIVO"}'
echo

# Curso 3
curl -s -X POST $URL -H "$TIPO" -d '{"nome":"Química","descricao":"Análises químicas","cargaHoraria":320,"status":"ATIVO"}'
echo

# Curso 4
curl -s -X POST $URL -H "$TIPO" -d '{"nome":"Petroquímica","descricao":"Indústria petroquímica","cargaHoraria":380,"status":"ATIVO"}'
echo

# Curso 5 (status ENCERRADO, para testar o filtro ?status=)
curl -s -X POST $URL -H "$TIPO" -d '{"nome":"Eletroeletrônica","descricao":"Eletricidade e automação","cargaHoraria":340,"status":"ENCERRADO"}'
echo
