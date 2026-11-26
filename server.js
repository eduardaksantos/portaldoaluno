// ================================================================
// PORTAL DO ALUNO - API de Cursos e Matrículas
// [FLUXO] (Azul) - Entrada e saída de dados: requisições HTTP (req.body, req.query, req.params) e rotas
// [TRANSF] (Verde) - Regras de negócio e tratamento: filtros (.filter), buscas (.find) e normalização (.toUpperCase)
// [ERRO] (Vermelho) - Validações críticas e falhas: campos obrigatórios ausentes e respostas de erro (400, 404)
// ================================================================

const express = require('express');
const app = express();

// [FLUXO] Permite que a API entenda JSON enviado no corpo (body) das requisições
app.use(express.json());

// ---------------- BANCO DE DADOS EM MEMÓRIA ----------------
const cursos = [];
const matriculas = [];

let proximoIdCurso = 1;
let proximoIdMatricula = 1;


// ================================================================
// CURSOS: id, nome, descricao, cargaHoraria, status (ATIVO | ENCERRADO)
// ================================================================

// [FLUXO] Recebe requisição GET /cursos e lê filtro opcional da query
app.get('/cursos', (req, res) => {
  const status = req.query.status;

  if (status) {
    // [TRANSF] Filtra cursos e normaliza o status para maiúsculo
    const filtrados = cursos.filter((c) => c.status === status.toUpperCase());
    return res.status(200).json(filtrados);
  }

  res.status(200).json(cursos);
});

// [FLUXO] Recebe requisição GET /cursos/:id para buscar um curso específico
app.get('/cursos/:id', (req, res) => {
  // [TRANSF] Converte o parâmetro id para número e busca na lista
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);

  // [ERRO] Retorna 404 caso o curso não exista
  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  res.status(200).json(curso);
});

// [FLUXO] Recebe requisição POST /cursos com dados no req.body
app.post('/cursos', (req, res) => {
  const body = req.body || {};

  // [ERRO] Valida campos obrigatórios e retorna 400 se faltar algum
  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, descricao, cargaHoraria, status',
    });
  }

  // [TRANSF] Estrutura o objeto do novo curso e normaliza o status
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

// [FLUXO] Recebe requisição PUT /cursos/:id para atualização completa
app.put('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  // [ERRO] Retorna 404 se o curso não for encontrado
  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  // [ERRO] Exige todos os campos no método PUT (400 Bad Request)
  if (!body.nome || !body.descricao || !body.cargaHoraria || !body.status) {
    return res.status(400).json({ erro: 'PUT exige todos os campos' });
  }

  // [TRANSF] Atualiza os dados do registro e padroniza o status
  curso.nome = body.nome;
  curso.descricao = body.descricao;
  curso.cargaHoraria = body.cargaHoraria;
  curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// [FLUXO] Recebe requisição PATCH /cursos/:id para atualização parcial
app.patch('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);
  const body = req.body || {};

  // [ERRO] Retorna 404 se o curso não existir
  if (!curso) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  // [ERRO] Valida se ao menos um campo foi enviado no corpo
  if (!body.nome && !body.descricao && !body.cargaHoraria && !body.status) {
    return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar' });
  }

  // [TRANSF] Aplica alterações parciais e normaliza status se enviado
  if (body.nome) curso.nome = body.nome;
  if (body.descricao) curso.descricao = body.descricao;
  if (body.cargaHoraria) curso.cargaHoraria = body.cargaHoraria;
  if (body.status) curso.status = body.status.toUpperCase();

  res.status(200).json(curso);
});

// [FLUXO] Recebe requisição DELETE /cursos/:id para remoção
app.delete('/cursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const posicao = cursos.findIndex((c) => c.id === id);

  // [ERRO] Retorna 404 caso o ID informado não exista
  if (posicao === -1) {
    return res.status(404).json({ erro: 'Curso não encontrado' });
  }

  // [TRANSF] Remove o curso do array em memória
  cursos.splice(posicao, 1);

  res.status(200).json({ mensagem: 'Curso removido com sucesso' });
});


// ================================================================
// MATRÍCULAS: id, cursoId, aluno, email, status (ATIVA | CANCELADA | CONCLUIDA)
// ================================================================

// [FLUXO] Recebe requisição GET /matriculas com filtros opcionais na query
app.get('/matriculas', (req, res) => {
  const status = req.query.status;
  const cursoId = req.query.cursoId;
  let resultado = matriculas;

  // [TRANSF] Filtra matrículas por status e/ou cursoId
  if (status) {
    resultado = resultado.filter((m) => m.status === status.toUpperCase());
  }

  if (cursoId) {
    resultado = resultado.filter((m) => m.cursoId === Number(cursoId));
  }

  res.status(200).json(resultado);
});

// [FLUXO] Recebe requisição GET /matriculas/:id para consulta individual
app.get('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);

  // [ERRO] Retorna 404 se a matrícula não for encontrada
  if (!matricula) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  res.status(200).json(matricula);
});

// [FLUXO] Recebe requisição POST /matriculas com dados da nova matrícula
app.post('/matriculas', (req, res) => {
  const body = req.body || {};

  // [ERRO] Valida presença de todos os campos obrigatórios (400)
  if (!body.cursoId || !body.aluno || !body.email || !body.status) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: cursoId, aluno, email, status',
    });
  }

  // [ERRO] Verifica integridade referencial: o cursoId precisa existir (404)
  const curso = cursos.find((c) => c.id === Number(body.cursoId));
  if (!curso) {
    return res.status(404).json({ erro: 'Curso informado não existe' });
  }

  // [TRANSF] Monta o objeto da matrícula convertendo cursoId e normalizando status
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

// [FLUXO] Recebe requisição PUT /matriculas/:id para substituição completa
app.put('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);
  const body = req.body || {};

  // [ERRO] Retorna 404 se matrícula ou curso vinculado não existirem, ou 400 se faltar campo
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

  // [TRANSF] Atualiza todos os campos da matrícula
  matricula.cursoId = Number(body.cursoId);
  matricula.aluno = body.aluno;
  matricula.email = body.email;
  matricula.status = body.status.toUpperCase();

  res.status(200).json(matricula);
});

// [FLUXO] Recebe requisição PATCH /matriculas/:id para atualização parcial
app.patch('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const matricula = matriculas.find((m) => m.id === id);
  const body = req.body || {};

  // [ERRO] Valida existência da matrícula e presença de ao menos um campo
  if (!matricula) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  if (!body.cursoId && !body.aluno && !body.email && !body.status) {
    return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar' });
  }

  if (body.cursoId) {
    const curso = cursos.find((c) => c.id === Number(body.cursoId));
    // [ERRO] Retorna 404 se o novo cursoId informado não existir
    if (!curso) {
      return res.status(404).json({ erro: 'Curso informado não existe' });
    }
    matricula.cursoId = Number(body.cursoId);
  }

  // [TRANSF] Aplica alterações parciais nos campos enviados
  if (body.aluno) matricula.aluno = body.aluno;
  if (body.email) matricula.email = body.email;
  if (body.status) matricula.status = body.status.toUpperCase();

  res.status(200).json(matricula);
});

// [FLUXO] Recebe requisição DELETE /matriculas/:id
app.delete('/matriculas/:id', (req, res) => {
  const id = Number(req.params.id);
  const posicao = matriculas.findIndex((m) => m.id === id);

  // [ERRO] Retorna 404 se a matrícula não existir
  if (posicao === -1) {
    return res.status(404).json({ erro: 'Matrícula não encontrada' });
  }

  // [TRANSF] Remove a matrícula da lista em memória
  matriculas.splice(posicao, 1);

  res.status(200).json({ mensagem: 'Matrícula removida com sucesso' });
});


// ================================================================
// LIGA O SERVIDOR
// ================================================================
const PORT = 4000;

// [FLUXO] Inicia a escuta HTTP da API na porta 4000
app.listen(PORT, () => {
  console.log(`Portal do Aluno rodando em http://localhost:${PORT}`);
});
