const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.path == '/usuarios/login' || req.path == '/usuarios/cadastro' || req.path == '/'){
        return next();
    }
    const autorizacao = req.headers.authorization
    if(!autorizacao){
        return res.status(400).json({info: "O token não foi informado."})
    }

    const partesAutorizacao = autorizacao.split(' ')

    if(partesAutorizacao.length != 2){
        return res.status(400).json({info: "Erro na validação do token."})
    }
    const [ titulo, token ] = partesAutorizacao;

    if(!/^Bearer$/i.test(titulo)){
        return res.status(400).json({info: "Token em formato inválido."})
    }

    jwt.verify(token, process.env.JWTSecret, (error, decoded) => {
        if (error) return res.status(400).json({info: "Token inválido."})
        res.usuarioId = decoded.id
        return next();
    })
}