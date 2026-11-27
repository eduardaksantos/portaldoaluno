#!/bin/bash

# [FLUXO] Define endpoint da API
API_URL="http://localhost:4000/cursos"

echo "[FLUXO] Extraindo dados da API..."
DADOS_JSON=$(curl -s "$API_URL")

# [ERRO] Verifica se há dados
if [ -z "$DADOS_JSON" ] || [ "$DADOS_JSON" == "[]" ]; then
  echo "[ERRO] API offline ou sem registros."
  exit 1
fi

echo ""
echo "Carga horária por curso (cada # = 20h)"
echo "--------------------------------------"

# [TRANSF] Remove duplicados preservando a ordem original e desenha barras
echo "$DADOS_JSON" | jq -r '
  reduce .[] as $item ([]; if any(.[]; .nome == $item.nome) then . else . + [$item] end) |
  .[] | "\(.nome)|\(.cargaHoraria)"
' | while IFS='|' read NOME HORAS; do
  QTD=$((HORAS / 20))
  BARRA=$(printf "%${QTD}s" | tr ' ' '#')
  printf "%-18s | %s %sh\n" "$NOME" "$BARRA" "$HORAS"
done
