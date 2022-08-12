const express = require('express');
const lancamentoRoutes = express.Router();

const LancamentosController = require('../controllers/LancamentosController');
const LancamentoMiddleware = require('../middlewares/LancamentoMiddleware');

lancamentoRoutes.post('/lancamentos', LancamentosController.salvarLancamento);
lancamentoRoutes.get('/lancamentos', LancamentosController.buscarLancamentos);
lancamentoRoutes.get('/lancamentos/:id', LancamentoMiddleware.validarLancamento, LancamentosController.buscarLancamentoPorId);
lancamentoRoutes.delete('/lancamentos/:id', LancamentoMiddleware.validarLancamento,LancamentosController.deletarLancamento);
lancamentoRoutes.put('/lancamentos/receita/:id', LancamentoMiddleware.validarLancamento,LancamentosController.alterarLancamentoReceita);
lancamentoRoutes.put('/lancamentos/despesa/:id', LancamentoMiddleware.validarLancamento,LancamentosController.alterarLancamentoDespesa);
lancamentoRoutes.patch('/lancamentos/despesa/:id', LancamentoMiddleware.validarLancamento, LancamentosController.informarPagamento);

module.exports = lancamentoRoutes;