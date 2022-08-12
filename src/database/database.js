const mongoose = require('mongoose');

function conectarDB(){
    mongoose.connect(process.env.DATABASE_URL)

    const db = mongoose.connection;
    db.on('error', err => console.log(err));
    db.once('open', () => console.log('🟢 Conexão ao BD realizada com sucesso!'));
}

function desconectarDB(){
    mongoose.disconnect()
}
module.exports = {conectarDB, desconectarDB};