#!/bin/bash

# [FLUXO] Definindo endpoint de origem e arquivo CSV de destino
API_URL="http://localhost:4000/cursos"
CSV_OUT="dataset_analitico.csv"

echo "[FLUXO] Extraindo dados brutos da API..."
DADOS_JSON=$(curl -s "$API_URL")

# [ERRO] Verificando se a API respondeu com conteúdo válido
if [ -z "$DADOS_JSON" ] || [ "$DADOS_JSON" == "[]" ]; then
  echo "[ERRO] Falha na extração: API offline ou sem registros."
  exit 1
fi

# [TRANSF] Remove duplicados preservando a ordem de cadastro e gera CSV
echo "[TRANSF] Transformando JSON em CSV..."
echo "$DADOS_JSON" | jq -r '
  (reduce .[] as $item ([]; if any(.[]; .nome == $item.nome) then . else . + [$item] end)) as $unicos |
  (["ID","NOME","DESCRICAO","CARGA_HORARIA","STATUS"] | @csv),
  (range(0; $unicos | length) as $i | [$i + 1, $unicos[$i].nome, $unicos[$i].descricao, $unicos[$i].cargaHoraria, $unicos[$i].status] | @csv)
' > "$CSV_OUT"

echo "[SUCESSO] Dataset gerado em $CSV_OUT:"
cat "$CSV_OUT"
