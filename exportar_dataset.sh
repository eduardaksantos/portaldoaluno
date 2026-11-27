#!/bin/bash

# [FLUXO] Definindo endpoint de origem e arquivo CSV de destino
API_URL="http://localhost:4000/matriculas"
CSV_OUT="dataset_analitico.csv"

echo "[FLUXO] Extraindo dados brutos da API..."
DADOS_JSON=$(curl -s "$API_URL")

# [ERRO] Verificando se a API respondeu com conteúdo válido
if [ -z "$DADOS_JSON" ] || [ "$DADOS_JSON" == "[]" ]; then
  echo "[ERRO] Falha na extração: API offline ou sem registros."
  exit 1
fi

# [TRANSF] Convertendo JSON para formato tabular CSV usando jq
echo "[TRANSF] Transformando JSON em CSV..."
echo "$DADOS_JSON" | jq -r '(["ID","CURSO_ID","ALUNO","EMAIL","STATUS"] | @csv), (.[] | [.id, .cursoId, .aluno, .email, .status] | @csv)' > "$CSV_OUT"

echo "[SUCESSO] Dataset gerado em $CSV_OUT:"
cat "$CSV_OUT"
