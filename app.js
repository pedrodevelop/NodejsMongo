//Módulos
    const express = require('express')
    const app = express()
    const bodyParser = require('body-parser')
    const handlebars = require('express-handlebars')
    const mongoose = require('mongoose')
    const path = require('path')
    const admin = require('./routes/admin')
    const session = require('express-session')
    const flash = require('connect-flash')
    
//Configs
    //Sessão
    app.use(session({
        secret: 'cursonode',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //Body-parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.connect('mongodb://localhost/nodeapp', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Bd conectado.')
    }).catch((err) => {
        console.log('Erro ao se conectar: ' + erro)
    })
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

//Rotas
app.use('/admin', admin)

//Conexão
const porta = 8081
app.listen(porta, () => {
    console.log("Servidor rodando.")
})
