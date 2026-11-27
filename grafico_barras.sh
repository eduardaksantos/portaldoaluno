#!/bin/bash

# [FLUXO] Definindo endpoint de origem
API_URL="http://localhost:4015/cursos"

echo "[FLUXO] Extraindo dados da API..."
DADOS_JSON=$(curl -s "$API_URL")

# [ERRO] Verificando se a API respondeu com conteúdo válido
if [ -z "$DADOS_JSON" ] || [ "$DADOS_JSON" == "[]" ]; then
  echo "[ERRO] Falha na extração: API offline ou sem registros."
  exit 1
fi

echo ""
echo "Carga horária por curso (cada # = 20h)"
echo "--------------------------------------"

# [TRANSF] Extraindo nome e carga horária separados por TAB
echo "$DADOS_JSON" | jq -r '.[] | [.nome, .cargaHoraria] | @tsv' | while IFS=$'\t' read -r nome carga; do
  # [FLUXO] Desenhando a barra: repete # (carga / 20) vezes
  barra=$(printf '%*s' $((carga / 20)) '' | tr ' ' '#')
  printf "%-18s | %s %sh\n" "$nome" "$barra" "$carga"
done
