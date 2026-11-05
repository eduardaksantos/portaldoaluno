// ================================================================
// PORTAL DO ALUNO - API de Cursos e Matrículas
// ================================================================

const express = require('express');
const app = express();

// Permite que a API entenda JSON enviado no corpo (body) das requisições
app.use(express.json());

// ---------------- BANCO DE DADOS EM MEMÓRIA ----------------
// Listas (arrays). Ao reiniciar o servidor, tudo é apagado.
const cursos = [];
const matriculas = [];

// Guardam o ID do próximo registro
let proximoIdCurso = 1;
let proximoIdMatricula = 1;


// ================================================================
// CURSOS: id, nome, descricao, cargaHoraria, status (ATIVO | ENCERRADO)
// ================================================================

// GET /cursos -> lista (filtro opcional: ?status=ATIVO)
app.get('/cursos', (req, res) => {
  const status = req.query.status;

  if (status) {
    const filtrados = cursos.filter((c) => c.status === status.toUpperCase());
    return res.status(200).json(filtrados);
  }

  res.status(200).json(cursos);
});

// GET /cursos/:id -> busca um curso
app.get('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);

  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  res.status(200).json(curso);
});

// POST /cursos -> cria um curso
app.post('/cursos', (req, res) => {
  const body = req.body || {};

  // Todos os campos são obrigatórios (senão, 400)
  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, descricao, cargaHoraria, status',
    });
  }

  const novoCurso = {
    id: proximoIdCurso,
    nome: body.nome,
    descricao: body.descricao,
    cargaHoraria: body.cargaHoraria,
    status: body.status.toUpperCase(),
  };

  proximoIdCurso = proximoIdCurso + 1;
  cursos.push(novoCurso);

  res.status(201).json(novoCurso);
});

// PUT /cursos/:id -> substitui TODOS os campos
app.put('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({ erro: 'PUT exige todos os campos' });
  }

  curso.nome = body.nome;
  curso.descricao = body.descricao;
  curso.cargaHoraria = body.cargaHoraria;
  curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// PATCH /cursos/:id -> altera SÓ os campos enviados
app.patch('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  if (!body.nome && !body.descricao && !body.cargaHoraria && !body.status) {
    return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar' });
  }

  if (body.nome) curso.nome = body.nome;
  if (body.descricao) curso.descricao = body.descricao;
  if (body.cargaHoraria) curso.cargaHoraria = body.cargaHoraria;
  if (body.status) curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// DELETE /cursos/:id -> apaga um curso
app.delete('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const posicao = cursos.findIndex((c) => c.id === id);

  if (posicao === -1) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  cursos.splice(posicao, 1);

  res.status(200).json({ mensagem: 'Curso removido com sucesso' });
});


// ================================================================
// MATRÍCULAS: id, cursoId, aluno, email, status (ATIVA | CANCELADA | CONCLUIDA)
// O "cursoId" liga a matrícula a um curso (um curso tem várias matrículas)
// ================================================================

// GET /matriculas -> lista (filtros opcionais: ?status=ATIVA e ?cursoId=1)
app.get('/matriculas', (req, res) => {
  const status = req.query.status;
  const cursoId = req.query.cursoId;
  let resultado = matriculas;

  if (status) {
    resultado = resultado.filter((m) => m.status === status.toUpperCase());
  }

  if (cursoId) {
    resultado = resultado.filter((m) => m.cursoId === Number(cursoId));
  }

  res.status(200).json(resultado);
});

// GET /matriculas/:id -> busca uma matrícula
app.get('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);

  if (!matricula) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  res.status(200).json(matricula);
});

// POST /matriculas -> cria uma matrícula
app.post('/matriculas', (req, res) => {
  const body = req.body || {};

  if (!body.cursoId || !body.aluno || !body.email || !body.status) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: cursoId, aluno, email, status',
    });
  }

  // O curso informado precisa existir
  const curso = cursos.find((c) => c.id === Number(body.cursoId));
  if (!curso) {
    return res.status(404).json({ erro: 'Curso informado não existe' });
  }

  const novaMatricula = {
    id: proximoIdMatricula,
    cursoId: Number(body.cursoId),
    aluno: body.aluno,
    email: body.email,
    status: body.status.toUpperCase(),
  };

  proximoIdMatricula = proximoIdMatricula + 1;
  matriculas.push(novaMatricula);

  res.status(201).json(novaMatricula);
});

// PUT /matriculas/:id -> substitui TODOS os campos
app.put('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);
  const body = req.body || {};

  if (!matricula) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  if (!body.cursoId || !body.aluno || !body.email || !body.status) {
    return res.status(400).json({ erro: 'PUT exige todos os campos' });
  }

  const curso = cursos.find((c) => c.id === Number(body.cursoId));
  if (!curso) {
    return res.status(404).json({ erro: 'Curso informado não existe' });
  }

  matricula.cursoId = Number(body.cursoId);
  matricula.aluno = body.aluno;
  matricula.email = body.email;
  matricula.status = body.status.toUpperCase();

  res.status(200).json(matricula);
});

// PATCH /matriculas/:id -> altera SÓ os campos enviados
app.patch('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);
  const body = req.body || {};

  if (!matricula) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  if (!body.cursoId && !body.aluno && !body.email && !body.status) {
    return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar' });
  }

  // Se trocar de curso, o novo curso também precisa existir
  if (body.cursoId) {
    const curso = cursos.find((c) => c.id === Number(body.cursoId));
    if (!curso) {
      return res.status(404).json({ erro: 'Curso informado não existe' });
    }
    matricula.cursoId = Number(body.cursoId);
  }

  if (body.aluno) matricula.aluno = body.aluno;
  if (body.email) matricula.email = body.email;
  if (body.status) matricula.status = body.status.toUpperCase();

  res.status(200).json(matricula);
});

// DELETE /matriculas/:id -> apaga uma matrícula
app.delete('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const posicao = matriculas.findIndex((m) => m.id === id);

  if (posicao === -1) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  matriculas.splice(posicao, 1);

  res.status(200).json({ mensagem: 'Matrícula removida com sucesso' });
});


// ================================================================
// LIGA O SERVIDOR
// ================================================================
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Portal do Aluno rodando em http://localhost:${PORT}`);
});
