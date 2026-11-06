#!/bin/bash
# Testa todas as rotas da API (porta 4000) com curl e jq

URL="http://localhost:4000"
TIPO="Content-Type: application/json"

echo "===== CURSOS ====="

echo "1. POST /cursos (201)"
curl -s -X POST $URL/cursos -H "$TIPO" -d '{"nome":"DEV","descricao":"Desenvolvimento de Sistemas","cargaHoraria":400,"status":"ATIVO"}' | jq
curl -s -X POST $URL/cursos -H "$TIPO" -d '{"nome":"Instrumentação","descricao":"Instrumentação Industrial","cargaHoraria":300,"status":"ATIVO"}' | jq
curl -s -X POST $URL/cursos -H "$TIPO" -d '{"nome":"Química","descricao":"Química Industrial","cargaHoraria":320,"status":"ATIVO"}' | jq

echo "2. POST /cursos sem campos (400)"
curl -s -w "HTTP %{http_code}\n" -X POST $URL/cursos -H "$TIPO" -d '{"nome":"Incompleto"}'

echo "3. GET /cursos (lista)"
curl -s $URL/cursos | jq

echo "4. GET /cursos?status=ATIVO (filtro)"
curl -s "$URL/cursos?status=ATIVO" | jq

echo "5. GET /cursos/1 (por ID)"
curl -s $URL/cursos/1 | jq

echo "6. GET /cursos/999 (404)"
curl -s -w "HTTP %{http_code}\n" $URL/cursos/999

echo "7. PUT /cursos/1 (substitui tudo)"
curl -s -X PUT $URL/cursos/1 -H "$TIPO" -d '{"nome":"DEV","descricao":"Desenvolvimento Full Stack","cargaHoraria":420,"status":"ATIVO"}' | jq

echo "8. PATCH /cursos/3 (altera só o status)"
curl -s -X PATCH $URL/cursos/3 -H "$TIPO" -d '{"status":"ENCERRADO"}' | jq

echo
echo "===== MATRÍCULAS ====="

echo "9. POST /matriculas (201)"
curl -s -X POST $URL/matriculas -H "$TIPO" -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"ATIVA"}' | jq
curl -s -X POST $URL/matriculas -H "$TIPO" -d '{"cursoId":1,"aluno":"Emily Sibia de Paula","email":"emily@email.com","status":"ATIVA"}' | jq
curl -s -X POST $URL/matriculas -H "$TIPO" -d '{"cursoId":2,"aluno":"Lucas Silva","email":"lucas@email.com","status":"ATIVA"}' | jq

echo "10. POST /matriculas sem campos (400)"
curl -s -w "HTTP %{http_code}\n" -X POST $URL/matriculas -H "$TIPO" -d '{"aluno":"Teste"}'

echo "11. POST /matriculas com curso inexistente (404)"
curl -s -w "HTTP %{http_code}\n" -X POST $URL/matriculas -H "$TIPO" -d '{"cursoId":999,"aluno":"Ana","email":"ana@email.com","status":"ATIVA"}'

echo "12. GET /matriculas (lista)"
curl -s $URL/matriculas | jq

echo "13. GET /matriculas?cursoId=1 (filtro por curso)"
curl -s "$URL/matriculas?cursoId=1" | jq

echo "14. GET /matriculas?status=ATIVA (filtro por status)"
curl -s "$URL/matriculas?status=ATIVA" | jq

echo "15. GET /matriculas/1 (por ID)"
curl -s $URL/matriculas/1 | jq

echo "16. GET /matriculas/999 (404)"
curl -s -w "HTTP %{http_code}\n" $URL/matriculas/999

echo "17. PUT /matriculas/1 (substitui tudo)"
curl -s -X PUT $URL/matriculas/1 -H "$TIPO" -d '{"cursoId":1,"aluno":"Eduarda Kramer dos Santos","email":"eduarda@email.com","status":"CONCLUIDA"}' | jq

echo "18. PATCH /matriculas/2 (altera só o status)"
curl -s -X PATCH $URL/matriculas/2 -H "$TIPO" -d '{"status":"CANCELADA"}' | jq

echo
echo "===== DELETE ====="

echo "19. DELETE /matriculas/3"
curl -s -X DELETE $URL/matriculas/3 | jq

echo "20. DELETE /cursos/3"
curl -s -X DELETE $URL/cursos/3 | jq

echo "21. DELETE /cursos/999 (404)"
curl -s -w "HTTP %{http_code}\n" -X DELETE $URL/cursos/999

echo
echo "===== FIM DOS TESTES ====="
