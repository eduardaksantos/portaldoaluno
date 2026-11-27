#!/bin/bash
URL="http://localhost:4000/cursos"

echo "[FLUXO] Extraindo dados da API..."
DADOS=$(curl -s "$URL" | jq -c 'reduce .[] as $item ([]; if any(.[]; .nome == $item.nome) then . else . + [$item] end)')

echo ""
echo "Carga horária por curso (cada # = 20h)"
echo "--------------------------------------"

echo "$DADOS" | jq -c '.[]' | while read -r linha; do
  NOME=$(echo "$linha" | jq -r '.nome')
  HORAS=$(echo "$linha" | jq -r '.cargaHoraria')
  BLOCOS=$((HORAS / 20))
  BARRA=$(printf '#%.0s' $(seq 1 $BLOCOS))

  printf "%-18s | %s %sh\n" "$NOME" "$BARRA" "$HORAS"
done
echo ""
