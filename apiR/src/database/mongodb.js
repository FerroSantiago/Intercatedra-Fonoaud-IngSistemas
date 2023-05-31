require('dotenv').config();
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://santiagoferroraffin:${process.env.DB_PASSWORD}@cluster0.ocfrlkh.mongodb.net/Consultorio?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('conectado a la db'))