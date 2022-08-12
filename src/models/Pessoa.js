const mongoose = require('mongoose');

const PessoaModel = mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    cpf_cnpj: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    },
    lancamentoId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lancamento',
    }]
})

module.exports = mongoose.model('Pessoa', PessoaModel);