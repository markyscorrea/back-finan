const express = require('express');
const usuarioRoutes = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const UsuarioMiddleware = require('../middlewares/UsuarioMiddleware');

usuarioRoutes.post('/usuarios/cadastro', UsuarioController.salvarUsuario);
usuarioRoutes.post('/usuarios/login', UsuarioController.loginUsuario);
usuarioRoutes.get('/usuarios', UsuarioController.buscarUsuarios);
usuarioRoutes.get('/usuarios/:id', UsuarioMiddleware.validarUsuario, UsuarioController.buscarUsuarioPorId);
usuarioRoutes.delete('/usuarios/:id', UsuarioMiddleware.validarUsuario, UsuarioController.deletarUsuario);

module.exports = usuarioRoutes;