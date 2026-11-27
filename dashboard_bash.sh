#!/bin/bash

# [FLUXO] Coleta métricas diretamente da API do Portal do Aluno
CURSOS_JSON=$(curl -s http://localhost:4000/cursos)
MATRICULAS_JSON=$(curl -s http://localhost:4000/matriculas)

# [ERRO] Valida se a API está respondendo
if [ -z "$CURSOS_JSON" ] || [ -z "$MATRICULAS_JSON" ]; then
  echo "[ERRO] API offline na porta 4000."
  exit 1
fi

# [TRANSF] Conta totais e filtra por status usando jq
TOTAL_CURSOS=$(echo "$CURSOS_JSON" | jq 'length')
CURSOS_ATIVOS=$(echo "$CURSOS_JSON" | jq '[.[] | select(.status=="ATIVO")] | length')
TOTAL_MATRICULAS=$(echo "$MATRICULAS_JSON" | jq 'length')
MATRICULAS_ATIVAS=$(echo "$MATRICULAS_JSON" | jq '[.[] | select(.status=="ATIVA")] | length')

# Função para desenhar barra proporcional
barra() {
  local qtd=$1
  local str=""
  for ((i=0; i<qtd; i++)); do str+="█"; done
  echo "$str ($qtd)"
}

echo "=================================================="
echo "   DASHBOARD ANALÍTICO - PORTAL DO ALUNO (CLI)"
echo "=================================================="
printf "%-20s | %s\n" "Total de Cursos" "$(barra $TOTAL_CURSOS)"
printf "%-20s | %s\n" "Cursos Ativos" "$(barra $CURSOS_ATIVOS)"
printf "%-20s | %s\n" "Total Matrículas" "$(barra $TOTAL_MATRICULAS)"
printf "%-20s | %s\n" "Matrículas Ativas" "$(barra $MATRICULAS_ATIVAS)"
echo "=================================================="
