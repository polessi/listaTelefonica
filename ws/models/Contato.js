const Sequelize = require('sequelize');
const db = require('./db');

const Contato = db.define('contato', {
    id: {
        type: Sequelize.INTEGER(14),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER(3),
        allowNull: false
    }
});

Contato.sync();

module.exports = Contato;