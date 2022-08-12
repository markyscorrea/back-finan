const Categoria = require('../models/Categoria')

function regExpCategoria(tipo){
    const regexp = new RegExp(/[cd]/ig)
    return regexp.test(tipo)
}

module.exports = {
    async salvarCategoria(req, res){
        if(!req.body.descricao){
            return res.status(400).json({info: "Necessário preenchimento da descrição para cadastro de categoria."})
        }

        if(!regExpCategoria(req.body.tipo) || req.body.tipo.length != 1){
            return res.status(400).json({info: "Necessário preenchimento correto do tipo para cadastro de categoria."})
        }

        const categoria = new Categoria({
            descricao: req.body.descricao.toLowerCase(),
            tipo: req.body.tipo
        });
        try{
            await categoria.save();
            res.status(200).json(categoria);
        }catch(e){
            res.status(400).json({e});
        }
    },

    async buscarCategorias(req, res){
        try{
            const categorias = await Categoria.find(); 
            res.status(200).json(categorias);           
        }catch(e){
            res.status(400).json({e});
        }
    },

    buscarCategoriasPorId(req, res){
        res.json(res.categoria);
    },

    async deletarCategorias(req, res){
        if(res.categoria.lancamentoId.length > 0){
            return res.status(400).json({info: "Essa categoria possui lançamentos vinculados ao seu cadastro."})
        }
        try{
            await Categoria.findByIdAndDelete(res.categoria._id)
            res.status(200).json({info: 'Categoria deletada com sucesso.'})
        }catch(e){
            res.status(400).json({e});
        }
    },

    async alterarCategoria(req, res){
        const { descricao, tipo } = req.body;
        if(!descricao || !tipo){
            return res.status(400).json({info: "Necessário preenchimento da descrição/tipo para atualizar categoria."})
        }
        if(!regExpCategoria(req.body.tipo) || req.body.tipo.length != 1){
            return res.status(400).json({info: "Necessário preenchimento correto do tipo para cadastro de categoria."})
        }
        try{
            await Categoria.findByIdAndUpdate(res.categoria._id, { descricao: descricao.toLowerCase(), tipo });
            res.status(200).json({info: 'Categoria alterada com sucesso.'});
        }catch(e){
            res.status(400).json({e});
        }
    },

    async removerLancamentoId(lancamento){
        let categoria = await Categoria.findById(lancamento.categoria)
        categoria.lancamentoId.splice(categoria.lancamentoId.indexOf(lancamento._id), 1)
        await Categoria.findByIdAndUpdate(categoria._id, { 
            lancamentoId: categoria.lancamentoId
         });
    }
}