const moongose = require('mongoose')
const Schema = moongose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
})

moongose.model('usuarios', Usuario)