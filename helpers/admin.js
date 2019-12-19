module.exports = {
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.admin == 1) {
            return next();
        }
        req.flash('error_msg', 'Você precisa ser o administrador para acessar essa página.')
        res.redirect('/')
    },
    autenticado: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Você precisa estar logado para acessar essa página.')
        res.redirect('/')
    } 
}