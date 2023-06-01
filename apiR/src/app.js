const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use("/", require('./routes/route.paciente'))

app.listen(app.get('port'), () =>{
    console.log(`puerto localhost abierto:${app.get('port')}`)
})

module.exports = app;