const Usuario = require('../models/Usuario');

module.exports = {
    async validarUsuario(req, res, next) {
        const usuarioId = req.params.id
        if(usuarioId.length != 24){
            return res.status(400).json({erro: "Informe uma ID válida."});
        }
        try{
            const usuario = await Usuario.findById(usuarioId);
            if(usuario === null){
                return res.status(400).json({erro: "Essa ID não existe no banco de dados."});
            }
            res.usuario = usuario;
            next();
        }catch(e){
            res.status(400).json({e});
        }
    }
}