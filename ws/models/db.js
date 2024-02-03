const Sequelize = require('sequelize');

const db = new Sequelize("bd_projeto_davinte", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
});

db.authenticate()
  .then(function(){
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch(function(err){
    console.error("Erro: Conexão com banco de dados não realizada!");
    console.error(err); // Imprime o erro no console
  });

module.exports = db;
