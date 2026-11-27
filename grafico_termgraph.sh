#!/bin/bash

# [FLUXO] Garante que o dataset CSV está atualizado
./exportar_dataset.sh > /dev/null

# [TRANSF] Extrai NOME e CARGA_HORARIA do CSV para formato do termgraph
awk -F',' 'NR>1 {gsub(/"/, "", $2); print $2 " " $4}' dataset_analitico.csv > dados_termgraph.dat

echo ""
echo "=== VISUALIZAÇÃO TERMGRAPH (CARGA HORÁRIA) ==="
PYTHONPATH=./py_libs ./py_libs/bin/termgraph dados_termgraph.dat --color blue --suffix "h"
