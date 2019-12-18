//Módulos
    const express = require('express')
    const app = express()
    const bodyParser = require('body-parser')
    const handlebars = require('express-handlebars')
    const mongoose = require('mongoose')
    const path = require('path')
    const admin = require('./routes/admin')
    const usuarios = require('./routes/usuario')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    
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
app.use('/usuarios', usuarios)

app.get('/', (req,res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {
        res.render('index', {postagens: postagens})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', 'Esta postagem não existe.')
            res.redirect('/')
        }
    }).catch((erro) => {
        req.flash('error_msg', 'Houve um erro interno.')
        res.redirect('/')
    })
})

app.get('/categorias', (resq, res) => {
    Categoria.find().then((categorias) => {
        res.render('categorias/index', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
            }).catch((error) => {
                req.flash('error_msg', 'Houve um erro ao listar as postagens')
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', 'Está categoria não existe')
            res.redirect('/')
        }
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
        res.redirect('/')
    })
})

app.get('/404', (req, res) => {
    res.send('Erro 404!')
})

//Conexão
const porta = 8081
app.listen(porta, () => {
    console.log("Servidor rodando.")
})
