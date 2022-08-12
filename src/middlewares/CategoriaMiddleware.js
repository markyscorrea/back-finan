const Categoria = require('../models/Categoria');

module.exports = {
    async validarCategoria(req, res, next) {
        const categoriaId = req.params.id
        if(categoriaId.length !=  24){
            return res.status(400).json({erro: "Informe uma ID válida."});
        }
        try{
            const categoria = await Categoria.findById(categoriaId);
            if(categoria === null){
                return res.status(400).json({erro: "Essa ID não existe no banco de dados."});
            }
            res.categoria = categoria;
            next();
        }catch(err){
            res.status(400).json({err});
        }
    }
}