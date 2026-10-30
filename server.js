// ============================================================
// PORTAL DO ALUNO - API de Cursos e Matrículas
// Projeto Final Integrador - Back-End 1 (PBE1)
// ============================================================

// 1) Importa o Express (biblioteca que cria o servidor web)
const express = require('express');

// 2) Cria a aplicação
const app = express();

// 3) Permite que a API entenda JSON enviado no corpo (body) das requisições
app.use(express.json());

// ============================================================
// BANCO DE DADOS EM MEMÓRIA
// São apenas listas (arrays). Ao reiniciar o servidor, tudo some.
// ============================================================
const cursos = [];
const matriculas = [];

// Contadores para gerar o ID de cada novo registro
let proximoIdCurso = 1;
let proximoIdMatricula = 1;

// ============================================================
// ROTAS DE CURSOS
// Campos: nome, descricao, cargaHoraria, status (ATIVO ou ENCERRADO)
// ============================================================

// GET /cursos -> lista todos os cursos
// Aceita filtro opcional: /cursos?status=ATIVO
app.get('/cursos', (req, res) => {
  const status = req.query.status; // pega o ?status= da URL

  // Se veio um status, filtra a lista. Se não, devolve tudo.
  if (status) {
    const filtrados = cursos.filter((curso) => curso.status === status.toUpperCase());
    return res.status(200).json(filtrados);
  }

  res.status(200).json(cursos);
});

// GET /cursos/:id -> busca um curso pelo ID
app.get('/cursos/:id', (req, res) => {
  const id = Number(req.params.id); // o id vem da URL como texto, converte para número
  const curso = cursos.find((c) => c.id === id);

  // Se não achou, responde 404
  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  res.status(200).json(curso);
});

// POST /cursos -> cria um curso novo
app.post('/cursos', (req, res) => {
  const body = req.body || {};

  // Validação: todos os campos são obrigatórios. Se faltar, responde 400.
  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, descricao, cargaHoraria, status',
    });
  }

  // Monta o novo curso
  const novoCurso = {
    id: proximoIdCurso,
    nome: body.nome,
    descricao: body.descricao,
    cargaHoraria: body.cargaHoraria,
    status: body.status.toUpperCase(),
  };

  proximoIdCurso = proximoIdCurso + 1; // prepara o próximo ID
  cursos.push(novoCurso);              // salva na lista

  res.status(201).json(novoCurso);     // 201 = criado
});

// PUT /cursos/:id -> substitui TODOS os campos do curso
app.put('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  // No PUT, todos os campos são obrigatórios
  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({ erro: 'PUT exige todos os campos' });
  }

  curso.nome = body.nome;
  curso.descricao = body.descricao;
  curso.cargaHoraria = body.cargaHoraria;
  curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// PATCH /cursos/:id -> atualiza SÓ os campos enviados
app.patch('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  // Precisa vir pelo menos um campo
  if (!body.nome && !body.descricao && !body.cargaHoraria && !body.status) {
    return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar' });
  }

  // Só altera o que foi enviado
  if (body.nome) curso.nome = body.nome;
  if (body.descricao) curso.descricao = body.descricao;
  if (body.cargaHoraria) curso.cargaHoraria = body.cargaHoraria;
  if (body.status) curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// DELETE /cursos/:id -> remove o curso
app.delete('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const posicao = cursos.findIndex((c) => c.id === id); // posição na lista

  // findIndex devolve -1 quando não encontra
  if (posicao === -1) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  cursos.splice(posicao, 1); // remove 1 item daquela posição
  res.status(200).json({ mensagem: 'Curso removido com sucesso' });
});

// ============================================================
// ROTAS DE MATRÍCULAS
// (serão adicionadas no Passo 4)
// ============================================================

// ============================================================
// INICIA O SERVIDOR
// ============================================================
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Portal do Aluno rodando em http://localhost:${PORT}`);
});
