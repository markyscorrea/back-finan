const express = require('express');
const pessoaRoutes = express.Router();

const PessoaController = require('../controllers/PessoaController');
const PessoaMiddleware = require('../middlewares/PessoaMiddleware');

pessoaRoutes.post('/pessoas', PessoaController.salvarPessoa);
pessoaRoutes.get('/pessoas', PessoaController.buscarPessoas);
pessoaRoutes.get('/pessoas/:id', PessoaMiddleware.validarPessoa, PessoaController.buscarPessoasPorId);
pessoaRoutes.delete('/pessoas/:id', PessoaMiddleware.validarPessoa, PessoaController.deletarPessoa);
pessoaRoutes.put('/pessoas/:id', PessoaMiddleware.validarPessoa, PessoaController.alterarPessoa);

module.exports = pessoaRoutes;