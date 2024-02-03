const Sequelize = require('sequelize');
const db = require('./db');
const Contato = require('./Contato');

const Telefone = db.define('telefone', {
    idcontato: {
        type: Sequelize.INTEGER(14),
        allowNull: false,
        references: {
            model: Contato, // Referencia o modelo Contato
            key: 'id', // A chave estrangeira é id em Contato
        }
    },
    id: {
        type: Sequelize.INTEGER(14),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    numero: {
        type: Sequelize.STRING(16),
        allowNull: false
    }
});

Telefone.sync();

// Define a relação inversa no Contato
Contato.hasMany(Telefone, { foreignKey: 'idcontato' });
Telefone.belongsTo(Contato, { foreignKey: 'idcontato' });

module.exports = Telefone;
