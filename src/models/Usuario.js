const mongoose = require('mongoose');

const UsuarioModel = mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: false
    }
})

module.exports = mongoose.model('Usuario', UsuarioModel);