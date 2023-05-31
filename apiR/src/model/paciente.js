const {Schema, model} = require("mongoose")

const EsquemaPaciente = Schema({
    nombre: String,
    edad: Number,
    direccion: String,
    email: String,
    arrayDeTextos: {
        type: [],
        default: ''
    },
    arrayDeErrores: {
        type: [],
        default: 0
    }
})

module.exports = model('pacientes', EsquemaPaciente)