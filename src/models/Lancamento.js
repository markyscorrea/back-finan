const mongoose = require('mongoose');

const LancamentoModel = mongoose.Schema({
    descricao: {
        type: String,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
    status:{
        type: Boolean,
        default: false,
    },
    tipo_conta: {
        type: Number,
        required: true
    },
    tipo: {
        type: String, 
        required: true,
    },
    data_entrada: { 
        type: String,
        default: null
    },
    data_vencimento: {
        type: String,
        default: null
    },
    data_pagamento: {
        type: String,
        default: null
    },
    pessoa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pessoa',
        required: true,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true,
    }
})

module.exports = mongoose.model('Lancamentos', LancamentoModel);