const mongoose = require('mongoose');

const CategoriaModel = mongoose.Schema({
    descricao: {
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

module.exports = mongoose.model('Categoria', CategoriaModel);