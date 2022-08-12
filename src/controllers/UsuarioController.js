const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function gerarToken(dados) {
    return jwt.sign(dados, process.env.JWTSecret, { expiresIn: 86400 })
}

module.exports = {
    async buscarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.find()
            res.status(200).json(usuarios)
        } catch (e) {
            res.status(200).json({ e })
        }
    },

     buscarUsuarioPorId(req, res) {
        res.json(res.usuario)
    },

    async salvarUsuario(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ info: "Necessário preenchimento de todos os dados para cadastro de usuário." })
        }

        if (await Usuario.findOne({ email })) {
            return res.status(400).json({ info: "Já existe usuário cadastrado com esse e-mail." })
        }

        const hash = await bcrypt.hash(senha, 10)

        const usuario = new Usuario({ nome, email, senha: hash });

        try {
            await usuario.save();
            usuario.senha = undefined;
            res.status(200).json({
                usuario,
                token: gerarToken({ id: usuario.id })
            })
        } catch (e) {
            res.status(400).json({ e });
        }
    },

    async deletarUsuario(req, res) {
        try {
            await Usuario.findByIdAndDelete(res.usuario._id)
            res.status(200).json({ info: "Usuário deletado com sucesso." })
        } catch (e) {
            res.status(400).json({ e })
        }
    },

    async loginUsuario(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ info: "Necessário preenchimento de todos os dados para login de usuário." })
        }

        try {
            const usuario = await Usuario.findOne({ email }).select('+senha')

            if (!usuario) {
                return res.status(400).json({ info: "Não existe usuário para o email informado." })
            }

            if (!await bcrypt.compare(senha, usuario.senha)) {
                return res.status(400).json({ info: "Senha incorreta." })
            }

            usuario.senha = undefined;

            res.status(200).json({
                usuario,
                token: gerarToken({ id: usuario.id })
            })
        } catch (e) {
            res.status(400).json({e})
        }
    }
}