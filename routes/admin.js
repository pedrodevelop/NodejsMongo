const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {admin} = require('../helpers/admin')

router.get('/', admin, (req, res) => {
    res.render("admin/index")
})

router.get('/posts', admin, (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias/create', admin, (req, res) => {
    res.render('admin/create_categorias')
})

router.post('/categorias/create', admin, (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Campo nome inválido, tente novamente"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Campo slug inválido, tente novamente"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Campo nome muito curto, tente novamente"})
    }
    if(erros.length > 0){
        res.render('admin/create_categorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso.')
            res.redirect('/admin/categorias/read')
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao criar categoria')
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/read', admin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/list_categorias', {categorias: categorias})
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/update/:id', admin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/update_categorias', {categoria: categoria})
    }).catch((error) => {
        req.flash('error_msg', 'Está categoria não existe.')
        res.redirect('/admin/categorias/read')
    })
})

router.post('/categorias/update', admin, (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias/read')
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao salvar edição da categoria')
            res.redirect('/admin/categorias/read')
        })
    }).catch((error) => {
        req.flash('error_msg', 'Erro ao editar categoria')
    })
})

router.post('/categorias/delete', admin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias/read')
    }).catch((erro) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias/read')
    })
})

router.get('/postagens/create', admin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/create_postagens', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        req.redirect('admin/postagens/read')
    })
})

router.post('/postagens/create', admin, (req,res) => {
     
    var erros = []

    if(req.body.categoria == '0'){
        erros.push({texto: 'Categoria inválida, selecione uma categoria.'})
    }

    if(erros.length > 0){
        res.render('admin/postagens/create', {erros:erros})
    }else{
        const novaPostagem ={
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens/read')
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro durante a criação da postagem')
            res.redirect('/admin/postagens/read')
        })
    }
})

router.get('/postagens/read', admin, (req, res) => {
    Postagem.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('admin/list_postagens', {postagens: postagens})
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao listar as postagens')
        res.redirect('/admin')
    })
})


module.exports = router