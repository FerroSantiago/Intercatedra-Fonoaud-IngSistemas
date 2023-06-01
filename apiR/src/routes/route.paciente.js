
const { Router } = require("express")
const router = Router()

const Paciente = require('../model/paciente')

router.get('/paciente', async (req, res) => {

    res.json({"hola": "mundo"})
})

router.post('/paciente', async (req, res) => {
    const { nombre, edad, direccion, email, arrayDeTextos, arrayDeErrores } = req.body
    const paciente = new Paciente({ nombre, edad, direccion, email, arrayDeTextos, arrayDeErrores })
    const result = await paciente.save()
    res.json({ msg: "paciente agregado", result });
});
router.delete('/paciente/:id', async (req, res) => {
    const { id } = req.params
    const result = await Paciente.deleteOne({ _id: id })
    res.json({ msg: 'paciente eliminado', result })
})

router.get('/paciente/:id', async (req, res) => {
    const { id } = req.params
    const paciente = await Paciente.findOne({ _id: id })
    res.json(paciente)
})

router.put('/paciente', async (req, res) => {
    const { _id, arrayDeTextos, arrayDeErrores } = req.body
    const result = await Paciente.updateOne({ _id }, { $set: {arrayDeTextos, arrayDeErrores}})
    res.json({ msg: "texto pusheado", result })
})

router.put('/paciente/errores', async (req, res) => {
    const { _id, arrayDeErrores } = req.body
    const result = await Paciente.updateOne({ _id }, { $set: {arrayDeErrores}})
    res.json({ msg: "error actualizado", result })
})

module.exports = router