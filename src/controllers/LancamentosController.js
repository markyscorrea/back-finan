const Lancamento = require ('../models/Lancamento');
const Categoria = require('../models/Categoria');
const Pessoa = require('../models/Pessoa')

const PessoaController = require('./PessoaController');
const CategoriaController = require('./CategoriaController');

class regExpLancamento {
    static tipo_conta(tipo_conta){
        const regExpNumber = new RegExp(/[12]/g)
        return regExpNumber.test(tipo_conta)
    }

    static data(date){
        const regExpDate = new RegExp(/(0[1-9]|1[0-9]|2[0-9]|3[0-1])[\/](0[1-9])[\/]([0-9]{4})/gm)
        return regExpDate.test(date)
    }

    static tipo(tipo){
        const regExpString = new RegExp(/[cd]/ig)
        return regExpString.test(tipo)
    }
}

class validadorDadosLancamento {
    static validar(tipoConta, data, tipo){
        if(!regExpLancamento.tipo_conta(tipoConta)){
            return false
        }

        if(!regExpLancamento.data(data)){
            return false
        }

        if(!regExpLancamento.tipo(tipo) || tipo.length != 1){
            return false
        }

        return true
    }
}

module.exports = {

    async salvarLancamento(req, res){

        async function vincularLancamentoACategoria(categoriaId, lancamentoId){

            const categoriaArray = await Categoria.findById(categoriaId)
            categoriaArray.lancamentoId.push(lancamentoId)
    
            await Categoria.findByIdAndUpdate(categoriaId, {
                lancamentoId: categoriaArray.lancamentoId
            })
        }

        async function vincularLancamentoAPessoa(pessoaId, lancamentoId){
            const lancamentoPessoaArray = await Pessoa.findById(pessoaId)
            lancamentoPessoaArray.lancamentoId.push(lancamentoId)

            await Pessoa.findByIdAndUpdate(pessoaId, {
                lancamentoId: lancamentoPessoaArray.lancamentoId
            })
        }

        try{
            const { categoria,...lancamentoDados  } = req.body;

            if(!lancamentoDados.descricao ||
                !lancamentoDados.valor ||
                !lancamentoDados.tipo_conta ||
                !lancamentoDados.tipo ||
                !lancamentoDados.pessoa||
                !categoria.descricao){
                return res.status(400).json({info: "Necessário preenchimento de todos os campos para cadastro de lançamento."})
            }

            if(lancamentoDados.pessoa.length != 24){
                return res.status(400).json({erro: "Informe uma ID de pessoa válida."});
            }

            if(!await Pessoa.findById(lancamentoDados.pessoa)){
                return res.status(400).json({erro: "A ID de pessoa não existe no banco de dados."});
            }

            const data = !!lancamentoDados.data_entrada ? lancamentoDados.data_entrada : lancamentoDados.data_vencimento

            const dados = validadorDadosLancamento.validar(lancamentoDados.tipo_conta, data, lancamentoDados.tipo)
            
            if(!dados){
                 return res.status(400).json({info: "Necessário preenchimento correto de todos os campos para cadastro de lançamento."})
            }

            const lancamento = new Lancamento(lancamentoDados);

            const descricao = categoria.descricao.toLowerCase()

            const categoriaSalva = await Categoria.findOne({descricao})

            if(categoriaSalva){

                lancamento.categoria = categoriaSalva._id

                await lancamento.save();

                vincularLancamentoACategoria(categoriaSalva._id, lancamento._id)
                vincularLancamentoAPessoa(lancamento.pessoa, lancamento._id)

                res.status(200).json(lancamento);

            }else{

                const categoriaLancamento = new Categoria({
                    descricao,
                    tipo: categoria.tipo
                })
                await categoriaLancamento.save();
                lancamento.categoria = categoriaLancamento._id

                await lancamento.save();

                vincularLancamentoACategoria(categoriaLancamento._id, lancamento._id)
                vincularLancamentoAPessoa(lancamento.pessoa, lancamento._id)

                res.status(200).json(lancamento);
            }
        }catch(e){
            res.status(400).json({e});
        }
    },

    async buscarLancamentos(req, res){
        try{
            const lancamento = await Lancamento.find().populate('pessoa');
            res.status(200).json(lancamento);
        }catch(e){
            res.status(400).json({e});
        }
    },

    buscarLancamentoPorId(req, res){
        res.json(res.lancamento);
    },

    async deletarLancamento(req, res){
        try{
            await Lancamento.findByIdAndDelete(res.lancamento._id);
            PessoaController.removerLancamentoId(res.lancamento);
            CategoriaController.removerLancamentoId(res.lancamento);
            res.status(200).json({info: 'Lançamento deletado com sucesso.'})
        }catch(e){
            res.status(400).json({e});
        }
    },

    async alterarLancamentoDespesa(req, res){
        if(!req.body.descricao ||
            ! req.body.valor ||
            ! req.body.tipo_conta ||
            ! req.body.tipo){
            return res.status(400).json({info: "Necessário informar campos e valores para atualização de lançamento."})
        }

        const data = !!req.body.data_entrada ? req.body.data_entrada : req.body.data_vencimento

        const dados = validadorDadosLancamento.validar(req.body.tipo_conta, data, req.body.tipo)
        
        if(!dados){
            res.status(400).json({info: "Necessário preenchimento correto de todos os campos para atualização de lançamento."})
        }
        
        try{
            await Lancamento.findByIdAndUpdate(res.lancamento._id, {...req.body})
            res.status(200).json({info: 'Lançamento alterado com sucesso.'});
        }catch(e){
            res.status(400).json({e});
        }
    },

    async alterarLancamentoReceita(req, res){
        if(!req.body.descricao ||
            ! req.body.valor ||
            ! req.body.tipo_conta ||
            ! req.body.tipo){
            return res.status(400).json({info: "Necessário informar campos e valores para atualização de lançamento."})
        }

        const data = !!req.body.data_entrada ? req.body.data_entrada : req.body.data_vencimento

        const dados = validadorDadosLancamento.validar(req.body.tipo_conta, data, req.body.tipo)
        
        if(!dados){
           return res.status(400).json({info: "Necessário preenchimento correto de todos os campos para atualização de lançamento."})
        }
        try{
            await Lancamento.findByIdAndUpdate(res.lancamento._id, {...req.body})
            res.status(200).json({info: 'Lançamento alterado com sucesso.'});
        }catch(e){
            res.status(400).json({e});
        }
    },

    async informarPagamento(req, res){
        if(res.lancamento.tipo_conta != 2){
            return res.status(400).json({info: "O ID informado pertence a uma receita, favor informar o ID referente a uma despesa."})
        }
        const { data_pagamento, status } = req.body;
        if(!data_pagamento || !status){
            return res.status(400).json({info: "Necessário preenchimento dos campos para informar o pagamento."})
        }
        try{
            await Lancamento.findByIdAndUpdate(res.lancamento._id, {data_pagamento, status});
            res.status(200).json({info: "Pagamento informado com sucesso."})
        }catch(e){
            res.status(400).json({e})
        }
    }
}