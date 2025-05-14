require('dotenv').config()

const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    var nome = 'Ana Gaspar'
    var cargo = 'Desenvolvedora de Software.'
    res.render('inicio', {
        nome: nome,
        cargo: cargo
    })
})

app.get('/sobre', (req, res) => {
    var titulo = 'Sobre mim'
    res.render('sobre', {
        titulo: titulo
    })
})

app.get('/habilidades', (req, res) => {
    var titulo = 'Habilidades & Certificações'
    var descricao = 'Abaixo estão algumas tecnologias com as quais estou familiarizada:'
    res.render('habilidades', {
        titulo: titulo,
        descricao: descricao
    })
})

// CRUD de Projetos

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
})

app.post('/projetos', (req, res) => {
    const { nome, descricao, link, tecs } = req.body;
    const novoProjeto = 'INSERT INTO Projetos (proj_nome, proj_desc, proj_link) VALUES (?, ?, ?)';

    db.query(novoProjeto, [nome, descricao, link], (err, result) => {
        if (err) return res.status(500).send(err);
        const projetoID = result.insertId;
        if (!tecs || tecs.length === 0) {
            return res.send({ id: projetoID, nome, descricao, link, tecs: [] });
        }
        const novoRelacionamento = 'INSERT INTO ProjetoTecnologias (proj_id, tec_id) VALUES ?';
        const valores = tecs.map(tecID => [projetoID, tecID]);

        db.query(novoRelacionamento, [valores], (err2) => {
            if (err2) return res.status(500).send(err2);
            res.send({ id: projetoID, nome, descricao, link, tecs });
        })
    });
});

app.get('/projetos', (req, res) => {
    db.query('SELECT p.proj_nome, p.proj_desc, p.proj_link, GROUP_CONCAT(t.tec_nome) AS proj_tecs FROM Projetos p LEFT JOIN ProjetoTecnologias pt ON p.proj_id = pt.proj_id LEFT JOIN Tecnologias t ON pt.tec_id = t.tec_id GROUP BY p.proj_id', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    })
})

app.get('/projetos/:id', (req, res) => {
    const sql = 'SELECT p.proj_nome, p.proj_desc, p.proj_link, GROUP_CONCAT(t.tec_nome) AS proj_tecs FROM Projetos p LEFT JOIN ProjetoTecnologias pt ON p.proj_id = pt.proj_id LEFT JOIN Tecnologias t ON pt.tec_id = t.tec_id WHERE p.proj_id = ? GROUP BY p.proj_id'

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado!' });
        res.send(result[0]);
    })
});

app.put('/projetos/:id', (req, res) => {
    const { nome, descricao, link, tecs } = req.body;
    const projetoID = req.params.id;
    const sql = 'UPDATE Projetos SET proj_nome = ?, proj_desc = ?, proj_link = ? WHERE proj_id = ?';

    db.query(sql, [nome, descricao, link, projetoID], (err) => {
        if (err) return res.status(500).send(err);
        const removerRelacionamento = 'DELETE FROM ProjetoTecnologias WHERE proj_id = ?'

        db.query(removerRelacionamento, [projetoID], (err2) => {
            if (err2) return res.status(500).send(err2);
            const novoRelacionamento = 'INSERT INTO ProjetoTecnologias (proj_id, tec_id) VALUES ?';
            const valores = tecs.map(tecID => [projetoID, tecID]);

            db.query(novoRelacionamento, [valores], (err3) => {
                if (err3) return res.status(500).send(err3);
                res.send({ mensagem: 'Projeto atualizado com sucesso!' });
            })
        })
    });
})

app.delete('/projetos/:id', (req, res) => {
    const projetoID = req.params.id;
    const removerRelacionamento = 'DELETE FROM ProjetoTecnologias WHERE proj_id = ?'

    db.query(removerRelacionamento, [projetoID], (err) => {
        if (err) return res.status(500).send(err);
        const removerProjeto = 'DELETE FROM Projetos WHERE proj_id = ?'

        db.query(removerProjeto, [projetoID], (err2) => {
            if (err2) return res.status(500).send(err2);
            res.send({ mensagem: 'Projeto excluído com sucesso!' });
        })
    })
})

// CRUD de E-mail

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/contato', (req, res) => {
    var titulo = 'Contato'
    var descricao = 'Abaixo estão os meus links de contato. Sinta-se a vontade para me enviar uma mensagem!'
    res.render('contato', {
        enviado: false,
        titulo: titulo,
        descricao: descricao
    })
})

app.post('/enviar-email', (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const mensagem = req.body.msg

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email_user,
            pass: process.env.email_pass
        }
    })

    const mailOptions = {
        from: email,
        to: 'anajulia3907@gmail.com',
        subject: 'Mensagem do portfólio',
        text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.render('contato', {
                enviado: false,
                titulo: 'Contato',
                descricao: 'Abaixo estão os meus links de contato. Sinta-se à vontade para me enviar uma mensagem!',
                erro: true
            });
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.render('contato', {
                enviado: true,
                titulo: 'Contato',
                descricao: 'Abaixo estão os meus links de contato. Sinta-se à vontade para me enviar uma mensagem!',
                erro: false
            })
        }
    })
})

app.listen(3000, () => { console.log('App rodando!') })