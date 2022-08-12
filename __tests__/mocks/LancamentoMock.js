const ReceitaCadastroMock = {
    "descricao": "Salário Jest",
	"valor": 5000,
	"tipo_conta": 1,
	"tipo": "c",
	"data_entrada": "10/08/2022",
	"categoria": {
		"descricao": "Categoria Supertest",
		"tipo": "c"
	}
}

const ReceitaCadastroMock2 = {
    "descricao": "Salário Jest",
	"valor": 5000,
	"categoria": {
		"descricao": "Categoria Supertest",
		"tipo": "c"
	}
}

const ReceitaAlteraCadastroMock = {
    "descricao": "Salário Supertest",
	"valor": 2500,
	"tipo_conta": 1,
	"tipo": "c",
	"data_entrada": "20/08/2022",
}

const DespesaCadastroMock = {
    "descricao": "Hospedagem Jest",
	"valor": 500,
	"tipo_conta": 2,
	"tipo": "c",
	"data_vencimento": "15/08/2022",
	"categoria": {
		"descricao": "Categoria Supertest",
		"tipo": "c"
	}
}

const DespesaAlteraCadastroMock = {
    "descricao": "Hospedagem Supertest",
	"valor": 250,
	"tipo_conta": 2,
	"tipo": "c",
	"data_vencimento": "25/08/2022",
}


module.exports = { ReceitaCadastroMock,ReceitaCadastroMock2, ReceitaAlteraCadastroMock, DespesaCadastroMock, DespesaAlteraCadastroMock };