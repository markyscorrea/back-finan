const Pessoa = require('../models/Pessoa');

module.exports = {
    async validarPessoa(req, res, next) {
        const pessoaId = req.params.id
        if(pessoaId.length != 24){
            return res.status(400).json({erro: "Informe uma ID válida."});
        }
        try{
            const pessoa = await Pessoa.findById(pessoaId);
            if(pessoa === null){
                return res.status(400).json({erro: "Essa ID não existe no banco de dados."});
            }
            res.pessoa = pessoa;
            next();
        }catch(e){
            res.status(400).json({e});
        }
    }
}