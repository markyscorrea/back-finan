const express = require('express');
const categoriaRoutes = express.Router();

const CategoriaController =  require('../controllers/CategoriaController');
const CategoriaMiddleware = require('../middlewares/CategoriaMiddleware');

categoriaRoutes.post('/categorias', CategoriaController.salvarCategoria);
categoriaRoutes.get('/categorias', CategoriaController.buscarCategorias);
categoriaRoutes.get('/categorias/:id', CategoriaMiddleware.validarCategoria, CategoriaController.buscarCategoriasPorId);
categoriaRoutes.delete('/categorias/:id', CategoriaMiddleware.validarCategoria, CategoriaController.deletarCategorias);
categoriaRoutes.put('/categorias/:id', CategoriaMiddleware.validarCategoria, CategoriaController.alterarCategoria);

module.exports = categoriaRoutes;