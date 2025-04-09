require('dotenv').config()

const express = require('express')
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

app.get('/projetos', (req, res) => {
    var titulo = 'Projetos'
    var descricao = 'Abaixo estão os projetos que desenvolvi até o momento:'
    res.render('projetos', {
        titulo: titulo,
        descricao: descricao
    })
})

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

app.listen(3000, () => { console.log('app rodando') })