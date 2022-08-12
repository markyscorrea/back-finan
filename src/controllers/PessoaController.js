const Pessoa = require('../models/Pessoa');

function regExpPessoa(tipo){
    const regexp = new RegExp(/[fj]/ig);
    return regexp.test(tipo)
}

module.exports = {

    async salvarPessoa(req, res){
        if(!req.body.nome || !req.body.cpf_cnpj){
            return res.status(400).json({info: "Necessário preenchimento de todos os campos para cadastro de pessoa."})
        }

        if(await Pessoa.findOne({cpf_cnpj: req.body.cpf_cnpj})){
            return res.status(400).json({info: "Já existe uma pessoa cadastrada para esse cpf_cnpj."})
        }

        if(!regExpPessoa(req.body.tipo) || req.body.tipo.length != 1){
            return res.status(400).json({info: "Necessário preenchimento correto do tipo para cadastro de pessoa."})
        }

        const pessoa = new Pessoa(req.body)

        try{
            await pessoa.save();
            res.status(200).json(pessoa);
        }catch(e){
            res.status(400).json({e});
        }
    },

    async buscarPessoas(req, res){
        try{
            const pessoas = await Pessoa.find();
            res.status(200).json(pessoas);
        }catch(e){
            res.status(400).json({e});
        }
    },

    buscarPessoasPorId(req, res){
        res.json(res.pessoa);
    },

    async deletarPessoa(req, res){
        if(res.pessoa.lancamentoId.length > 0){
            return res.status(400).json({info: "Esta pessoa possui lançamentos vinculados ao seu cadastro."})
        }
        try{
            await Pessoa.findByIdAndDelete(res.pessoa._id);
            res.status(200).json({info: 'Pessoa deletada com sucesso.'});
        }catch(e){
            res.status(400).json({e});
        }
    },

    async alterarPessoa(req, res){
        const { nome, cpf_cnpj, tipo } = req.body;
        if(!nome || !cpf_cnpj || !tipo){
            return res.status(400).json({info: "Necessário informar campos e valores para atualização de pessoa."})
        }
        
        if(!regExpPessoa(req.body.tipo) || req.body.tipo.length != 1){
            return res.status(400).json({info: "Necessário preenchimento correto do tipo para atualização de pessoa."})
        }
        try{
            await Pessoa.findByIdAndUpdate(res.pessoa._id, {
                nome,
                cpf_cnpj,
                tipo
            });
            res.status(200).json({info: 'Pessoa alterada com sucesso.'})
        }catch(e){
            res.status(400).json({e});
        }
    },

    async removerLancamentoId(lancamento){
        let pessoa = await Pessoa.findById(lancamento.pessoa)
        pessoa.lancamentoId.splice(pessoa.lancamentoId.indexOf(lancamento._id), 1)
        await Pessoa.findByIdAndUpdate(pessoa._id, {
            lancamentoId: pessoa.lancamentoId
        })
    }
}