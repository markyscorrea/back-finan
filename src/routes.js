const express = require('express');
const routes = express.Router();

const categoriaRoutes = require('./routes/categoria.routes');
const pessoaRoutes = require('./routes/pessoa.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const lancamentoRoutes = require('./routes/lancamento.routes');

const AuthMiddleware = require('./middlewares/AuthMiddleware')

routes.use(AuthMiddleware);
routes.use(categoriaRoutes, pessoaRoutes, usuarioRoutes, lancamentoRoutes);

module.exports = routes;