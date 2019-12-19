const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'Email informado está incorreto, tente novamente'})
            }

            bcrypt.compare(senha, usuario.senha, (erro, condizem) => {
                if(condizem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'Senha informada incorreta, tente novamente.'})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (error, usuario) => {
            done(error, usuario)
        })
    })
}

