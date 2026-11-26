#!/bin/bash

# [FLUXO] Extrai dados brutos de cursos e matrículas da API (porta 4000)
# [TRANSF] Converte os JSONs para formato tabular CSV com jq
# [ERRO] Interrompe caso a API esteja offline (-f)

curl -s -f http://localhost:4000/cursos | \
jq -r '(["ID","NOME","DESCRICAO","CARGA_HORARIA","STATUS"] | @csv), (.[] | [.id, .nome, .descricao, .cargaHoraria, .status] | @csv)' > dataset_cursos.csv

curl -s -f http://localhost:4000/matriculas | \
jq -r '(["ID","CURSO_ID","ALUNO","EMAIL","STATUS"] | @csv), (.[] | [.id, .cursoId, .aluno, .email, .status] | @csv)' > dataset_matriculas.csv

echo "Datasets gerados com sucesso!"
