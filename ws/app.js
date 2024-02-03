const express = require('express');
const app = express();
const cors = require('cors');
const Contato = require('./models/Contato');
const Telefone = require('./models/Telefone');
const db = require('./models/db');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(cors());

app.get('/buscaContatos', async (req, res) => {
    try {
        const contatos = await Contato.findAll({
            include: [{
                model: Telefone,
                as: 'telefones',
                required: false
            }]
        });
        res.status(200).json(contatos);
    } catch (error) {
        console.error('Erro ao buscar cadastros:', error);
        res.status(500).json({ erro: true, mensagem: 'Erro ao buscar cadastros' });
    }
});

app.post("/cadastrarContato", async (req, res) => {
    let t; // Declare a variável fora do try para poder acessá-la no catch
    try {
        t = await db.transaction(); // Inicia uma transação usando a instância correta do Sequelize
        const { nome, idade, telefones } = req.body; // Desestruturação para obter dados

        // Insere os dados na tabela 'contatos' sem os telefones
        const contato = await Contato.create({ nome, idade }, { transaction: t });

        // Verifica se há telefones para adicionar
        if (telefones && telefones.length > 0) {
            const telefonesParaInserir = telefones.map(numero => ({
                numero,
                idcontato: contato.id
            }));
            await Telefone.bulkCreate(telefonesParaInserir, { transaction: t });
        }

        await t.commit(); // Commit da transação se tudo ocorreu bem

        return res.status(201).json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso.",
            contato
        });

    } catch (error) {
        if (t) await t.rollback(); // Rollback da transação em caso de erro
        console.error("Erro geral na rota /cadastrarContato:", error);
        return res.status(500).json({
            erro: true,
            mensagem: "Erro interno do servidor."
        });
    }
});

app.put("/atualizarContato/:id", async (req, res) => {
    let t;
    try {
        const id = req.params.id;
        const { nome, idade, telefones } = req.body;
        t = await db.transaction();



        // Atualiza os dados do contato
        await Contato.update({ nome, idade }, {
            where: { id: id },
            transaction: t
        });

        // Remove os telefones atuais para inserir os novos
        await Telefone.destroy({
            where: { idcontato: id },
            transaction: t
        });

        // Verifica se há telefones para adicionar
        if (telefones && telefones.length > 0) {
            const telefonesParaInserir = telefones.map(numero => ({
                numero,
                idcontato: id
            }));
            await Telefone.bulkCreate(telefonesParaInserir, { transaction: t });
        }

        await t.commit();

        return res.json({
            erro: false,
            mensagem: "Dados do contato atualizados com sucesso."
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Erro na rota /atualizarContato:", error);
        return res.status(500).json({
            erro: true,
            mensagem: "Erro interno do servidor."
        });
    }
});

function adicionarLog(mensagem) {
    const logPath = path.join(__dirname, '/log/logDeExclusoes.txt');
    const logMensagem = `${new Date().toISOString()} - ${mensagem}\n`;
    fs.appendFile(logPath, logMensagem, (err) => {
        if (err) throw err;
        console.log("Log de exclusão adicionado.");
    });
}

app.post("/deletarContato", async (req, res) => {
    try {
        const { id, nome, idade } = req.body;

        console.log(id, nome, idade);

        // Deleta primeiro os registros dependentes em 'telefones'
        await Telefone.destroy({
            where: { idContato: id }
        });

        // Depois deleta o registro em 'contatos'
        const deletado = await Contato.destroy({
            where: { id: id }
        });

        if (deletado) {
            // Adiciona a entrada de log com o nome do contato
            adicionarLog(`Contato excluído: ID: ${id}, Nome: ${nome}, idade ${idade}.`);
            return res.status(200).json({ mensagem: "Contato deletado com sucesso." });
        } else {
            return res.status(404).json({ mensagem: "Contato não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao deletar contato:", error);
        return res.status(500).json({
            erro: true,
            mensagem: "Erro interno do servidor."
        });
    }
});


app.listen(8080);