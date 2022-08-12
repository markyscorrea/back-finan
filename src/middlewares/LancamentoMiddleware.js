const Lancamento = require('../models/Lancamento');

module.exports = {
    async validarLancamento(req, res, next) {
        const lancamentoId = req.params.id;
        if (lancamentoId.length != 24) {
            return res.status(400).json({erro: "Informe uma ID válida."});
        }
        try{
            const lancamento = await Lancamento.findById(lancamentoId).populate('pessoa');
            if(lancamento === null){
                return res.status(400).json({erro: "Essa ID não existe no banco de dados."});
            }
            res.lancamento = lancamento;
            next();
        }catch(e){
            res.status(400).json({e});
        }
    }
}