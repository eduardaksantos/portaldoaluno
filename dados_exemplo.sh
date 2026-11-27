#!/bin/bash

# [FLUXO] Define URL base da API na porta 4000
BASE="http://localhost:4000"

# [TRANSF] Limpa registros existentes antes de popular
for ID in $(curl -s "$BASE/cursos" | jq -r '.[].id'); do
  curl -s -X DELETE "$BASE/cursos/$ID" > /dev/null
done

# [FLUXO] Cadastra exatamente os 5 cursos do projeto na ordem
curl -s -X POST $BASE/cursos -H "Content-Type: application/json" -d '{"nome":"DEV","descricao":"Desenvolvimento de sistemas","cargaHoraria":400,"status":"ATIVO"}' > /dev/null
curl -s -X POST $BASE/cursos -H "Content-Type: application/json" -d '{"nome":"Instrumentação","descricao":"Controle de processos industriais","cargaHoraria":360,"status":"ATIVO"}' > /dev/null
curl -s -X POST $BASE/cursos -H "Content-Type: application/json" -d '{"nome":"Química","descricao":"Análises químicas","cargaHoraria":320,"status":"ATIVO"}' > /dev/null
curl -s -X POST $BASE/cursos -H "Content-Type: application/json" -d '{"nome":"Petroquímica","descricao":"Indústria petroquímica","cargaHoraria":380,"status":"ATIVO"}' > /dev/null
curl -s -X POST $BASE/cursos -H "Content-Type: application/json" -d '{"nome":"Eletroeletrônica","descricao":"Eletricidade e automação","cargaHoraria":340,"status":"ENCERRADO"}' > /dev/null

echo "[SUCESSO] 5 cursos cadastrados!"
