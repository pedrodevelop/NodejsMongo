const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categorias = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
    res.render('admin/list_categorias')
})

router.get('/categorias/create', (req, res) => {
    res.render('admin/create_categorias')
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.lenght < 2){
        erros.push({texto: "Campo(s) inválido(s), tente novamente"})
    }

    if(erros.lenght > 0){
        res.render('admin/create_categorias', {erros: erros})
    }

    const novaCategora = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categorias(novaCategora).save().then(() => {
        console.log('Categoria cadastrada')
    }).catch((erro) => {
        console.log('Erro ao cadastrar categoria: ' + erro)
    })
})


module.exports = router