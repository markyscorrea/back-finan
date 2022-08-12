const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const mongoDB = require('../../src/database/database');

const UsuarioMock = require('../mocks/UsuarioMock');
const { PessoaCadastroMock, PessoaAlterarCadastroMock } = require('../mocks/PessoaMock');
const { CategoriaCadastroMock, CategoriaAlterarCadastroMock } = require('../mocks/CategoriaMock');
const { ReceitaCadastroMock,
        ReceitaCadastroMock2,
        ReceitaAlteraCadastroMock,
        DespesaCadastroMock,
        DespesaAlteraCadastroMock } = require('../mocks/LancamentoMock');

let usuario;
let pessoa;
let categoria;
let receita;
let despesa;
let id = '62e29703ee0fd1843c356e6b'
let id_2 = '12345678910asdfjklç12345'

describe('Requisições Válidas', () => {

    describe('Usuários', () => {

        test('Deve cadastrar um usuário', async () => {
            const res = await request.post('/usuarios/cadastro').send(UsuarioMock)
            usuario = res._body
            expect(res.statusCode).toEqual(200)
            expect(res.text).toContain("token")
        })

        test('Deve permitir o login de um usuário', async () => {
            const res = await request.post('/usuarios/login').send({
                "email": UsuarioMock.email,
                "senha": UsuarioMock.senha
            })
            expect(res.statusCode).toEqual(200)
        })

        test('Deve pesquisar os usuários', async () => {
            const res = await request.get(`/usuarios`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

        test('Deve pesquisar um usuário por ID', async () => {
            const res = await request.get(`/usuarios/${usuario.usuario._id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })
    })

    describe('Pessoas', () => {
        test('Deve cadastrar uma pessoa', async () => {
            const res = await request.post(`/pessoas`).send(PessoaCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            pessoa = res._body
            expect(res.status).toEqual(200)
        })

        test('Deve pesquisar as pessoas', async () => {
            const res = await request.get(`/pessoas`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

        test('Deve pesquisar pessoa por ID', async () => {
            const res = await request.get(`/pessoas/${pessoa._id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

        test('Deve alterar o cadastro de pessoa', async () => {
            const res = await request.put(`/pessoas/${pessoa._id}`).send(PessoaAlterarCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })
    })

    describe('Categorias', () => {

        test('Deve cadastrar uma categoria', async () => {
            const res = await request.post(`/categorias`).send(CategoriaCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            categoria = res._body
            expect(res.status).toEqual(200)
        })

        test('Deve pesquisar as categorias', async () => {
            const res = await request.get(`/categorias`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

        test('Deve pesquisar categoria por ID', async () => {
            const res = await request.get(`/categorias/${categoria._id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

        test('Deve alterar o cadastro de categoria', async () => {
            const res = await request.put(`/categorias/${categoria._id}`).send(CategoriaAlterarCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200)
        })

    })

    describe('Lançamentos', () => {

        test('Deve cadastrar uma receita', async () => {
            const res = await request.post(`/lancamentos`).send({ ...ReceitaCadastroMock, pessoa: pessoa._id }).set('Authorization', `Bearer ${usuario.token}`)
            receita = res._body;
            expect(res.status).toEqual(200);
        })

        test('Deve cadastrar uma despesa', async () => {
            const res = await request.post(`/lancamentos`).send({ ...DespesaCadastroMock, pessoa: pessoa._id }).set('Authorization', `Bearer ${usuario.token}`)
            despesa = res._body;
            expect(res.status).toEqual(200);
        })

        test('Deve alterar o cadastro de receita', async () => {
            const res = await request.put(`/lancamentos/receita/${receita._id}`).send(ReceitaAlteraCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200);
        })

        test('Deve alterar o cadastro de despesa', async () => {
            const res = await request.put(`/lancamentos/despesa/${despesa._id}`).send(DespesaAlteraCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200);
        })

        test('Deve pesquisar lançamento por ID', async () => {
            const res = await request.get(`/lancamentos/${despesa._id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200);
        })

        test('Deve pesquisar lançamentos', async () => {
            const res = await request.get(`/lancamentos`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200);
        })

        test('Deve permitir pagamento de despesa', async () => {
            const res = await request.patch(`/lancamentos/despesa/${despesa._id}`)
            .send({
                "data_pagamento": "10/08/2022",
                "status": true
            })
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(200);
        })
    })

})

describe('Requisições Inválidas', () => {


    describe('Usuários', () => {

        test('Deve recusar o cadastro de um usuário por falta da descrição', async () => {
            const res = await request.post(`/usuarios/cadastro`).send({ "descricao": "", "email": "", "senha": "" })
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o cadastro de um usuário devido o e-mail já existir no banco de dados', async () => {
            const res = await request.post(`/usuarios/cadastro`).send(UsuarioMock)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o login de um usuário por falta de dados', async () => {
            const res = await request.post(`/usuarios/login`).send({
                "email": "",
                "senha": "",
            })
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o login de um usuário devido usuário inexistente', async () => {
            const res = await request.post(`/usuarios/login`).send({
                "email": "usuario@inexistente.com",
                "senha": "123456",
            })
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o login de um usuário devido senha incorreta', async () => {
            const res = await request.post(`/usuarios/login`).send({
                "email": UsuarioMock.email,
                "senha": "987654",
            })
            expect(res.status).toEqual(400)
        })

    })

    describe('Pessoas', () => {

        test('Deve recusar o cadastro de pessoa por falta da descrição', async () => {
            const res = await request.post(`/pessoas`).send({ 
                "nome": "",
                "cpf_cnpj": "",
                "tipo": ""
             }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o cadastro de pessoa devido o cpf_cnpj já existir no banco de dados', async () => {
            const res = await request.post(`/pessoas`).send(PessoaAlterarCadastroMock).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o cadastro de pessoa devido o tipo informado ser incorreto', async () => {
            const res = await request.post(`/pessoas`).send({"nome": "nomeInvalido", "cpf_cnpj": "123", "tipo": "fa"}).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar a exclusão de uma pessoa devido a mesma possuir lançamentos vinculados', async () => {
            const res = await request.del(`/pessoas/${pessoa._id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar a alteração de pessoa por falta de dados', async () => {
            const res = await request.put(`/pessoas/${pessoa._id}`).send({ 
                "nome": "",
                "cpf_cnpj": "",
                "tipo": ""
             }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar a alteração de pessoa devido o tipo informado ser incorreto', async () => {
            const res = await request.put(`/pessoas/${pessoa._id}`).send({"nome": "nomeInvalido", "cpf_cnpj": "123", "tipo": "fa"}).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Categorias', () => {
        test('Deve recusar o cadastro de uma categoria por falta da descrição', async () => {
            const res = await request.post(`/categorias`).send({ "descricao": "", "tipo": "c" }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o cadastro de uma categoria por falta do tipo', async () => {
            const res = await request.post(`/categorias`).send({ "descricao": CategoriaCadastroMock.descricao, "tipo": "cc" }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar a atualização do cadastro de uma categoria por falta da descrição', async () => {
            const res = await request.put(`/categorias/${categoria._id}`).send({ "descricao": "", "tipo": "c" }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar a atualização do cadastro de uma categoria por falta do tipo', async () => {
            const res = await request.put(`/categorias/${categoria._id}`).send({ "descricao": "CategoriaCadastroMock.descricao", "tipo": "cc" }).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Lançamentos', () => {
        
        test('Deve recusar o cadastro de lançamento devido tipo_conta ser incorreto', async () => {
            const res = await request.post(`/lancamentos`)
            .send({  pessoa: pessoa._id, tipo_conta: 8, data_entrada: "10/08/2022", tipo: "c",...ReceitaCadastroMock2})
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar o cadastro de lançamento devido a data ser incorreto', async () => {
            const res = await request.post(`/lancamentos`)
            .send({  pessoa: pessoa._id, tipo_conta: 1, data_entrada: "10/08", tipo: "c",...ReceitaCadastroMock2})
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar o cadastro de lançamento devido tipo ser incorreto', async () => {
            const res = await request.post(`/lancamentos`)
            .send({  pessoa: pessoa._id, tipo_conta: 1, data_entrada: "10/08/2022", tipo: "z",...ReceitaCadastroMock2})
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar o cadastro de lançamento por falta de dados', async () => {
            const res = await request.post(`/lancamentos`)
            .send(ReceitaCadastroMock2)
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar o cadastro de lançamento devido ID de pessoa estar incorreto', async () => {
            const res = await request.post(`/lancamentos`)
            .send({pessoa: "idPessoaTeste", ...ReceitaCadastroMock})
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar o cadastro de lançamento devido ID de pessoa não existir no banco de dados', async () => {
            const res = await request.post(`/lancamentos`)
            .send({pessoa: id, ...ReceitaCadastroMock})
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve recusar atualização do cadastro de lançamento por falta de dados', async () => {
            const res = await request.put(`/lancamentos/receita/${receita._id}`)
            .send({
                "descricao": "",
                "valor": 0,
                "tipo_conta": 0,
                "tipo": ""
            })
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar atualização do cadastro de lançamento devido dados incorretos', async () => {
            const res = await request.put(`/lancamentos/receita/${receita._id}`)
            .send({
                "descricao": "descricãoInválida",
                "valor": 1,
                "tipo_conta": 5,
                "data_entrada": "30/0",
                "tipo": "z"
            })
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar pagamento de despesa devido id incorreta', async () => {
            const res = await request.patch(`/lancamentos/despesa/${receita._id}`)
            .send({
                "data_pagamento": "01/08/2022",
                "status": true
            })
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })

        test('Deve recusar pagamento de despesa por falta de dados', async () => {
            const res = await request.patch(`/lancamentos/despesa/${despesa._id}`)
            .send({
                "data_pagamento": "",
                "status": true
            })
            .set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400);
        })
        
    })
})

describe('Middlewares', () => {

    describe('Autenticação de usuário', () => {
        test('Deve retornar status 400 por falta de token', async () => {
            const res = await request.get(`/pessoas`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 por erro na validação do token', async () => {
            const res = await request.get(`/pessoas`).set('Authorization', usuario.token)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 por formato inválido do token', async () => {
            const res = await request.get(`/pessoas`).set('Authorization', `Beare ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 por token inválido', async () => {
            const res = await request.get(`/pessoas`).set('Authorization', `Bearer Test&toK3n1234567896542`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Usuário', () => {
        test('Deve retornar status 400 pesquisar usuario por ID', async () => {
            const res = await request.get(`/usuarios/IdInvalidaParaTeste`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar usuario por ID', async () => {
            const res = await request.get(`/usuarios/${id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar usuario por ID', async () => {
            const res = await request.get(`/usuarios/${id_2}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Pessoa', () => {
        test('Deve retornar status 400 pesquisar pessoa por ID', async () => {
            const res = await request.get(`/pessoas/IdInvalidaParaTeste0123`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar pessoa por ID', async () => {
            const res = await request.get(`/pessoas/${id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar pessoa por ID', async () => {
            const res = await request.get(`/pessoas/${id_2}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Categoria', () => {
        test('Deve retornar status 400 pesquisar categoria por ID', async () => {
            const res = await request.get(`/categorias/IdInvalidaParaTeste`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar categoria por ID', async () => {
            const res = await request.get(`/categorias/${id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar categoria por ID', async () => {
            const res = await request.get(`/categorias/${id_2}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

    describe('Lançamento', () => {
        test('Deve retornar status 400 pesquisar lançamento por ID', async () => {
            const res = await request.get(`/lancamentos/IdInvalidaParaTeste`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar lançamento por ID', async () => {
            const res = await request.get(`/lancamentos/${id}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })

        test('Deve retornar status 400 pesquisar lançamento por ID', async () => {
            const res = await request.get(`/lancamentos/${id_2}`).set('Authorization', `Bearer ${usuario.token}`)
            expect(res.status).toEqual(400)
        })
    })

})

describe('Remoção de cadastros', () => {

    test('Deve deletar uma receita', async () => {
        const res = await request.del(`/lancamentos/${receita._id}`).set('Authorization', `Bearer ${usuario.token}`)
        expect(res.status).toEqual(200)
    })

    test('Deve deletar uma despesa', async () => {
        const res = await request.del(`/lancamentos/${despesa._id}`).set('Authorization', `Bearer ${usuario.token}`)
        expect(res.status).toEqual(200)
    })

    test('Deve deletar usuário', async () => {
        const res = await request.del(`/usuarios/${usuario.usuario._id}`).set('Authorization', `Bearer ${usuario.token}`)
        expect(res.status).toEqual(200)
    })

    test('Deve deletar pessoa', async () => {
        const res = await request.del(`/pessoas/${pessoa._id}`).set('Authorization', `Bearer ${usuario.token}`)
        expect(res.status).toEqual(200)
    })

    test('Deve deletar categoria', async () => {
        const res = await request.del(`/categorias/${categoria._id}`).set('Authorization', `Bearer ${usuario.token}`)
        expect(res.status).toEqual(200)
    })

})

afterAll(async () => {
    mongoDB.desconectarDB()
})