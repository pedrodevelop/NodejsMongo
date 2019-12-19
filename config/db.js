if(process.env.node_env == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://admin:admin@nodeapp-nhlaz.gcp.mongodb.net/test?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/nodeapp'}
}