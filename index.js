const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alysson159',
    database: 'movimento_saudavel'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar o banco:', err);
        return;
    }
    console.log('Conectado ao banco.');
});

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Cadastro' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/register', (req, res) => {
    const { name, cpf, convenio, email, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao hashear senha:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        const sql = 'INSERT INTO users (name, cpf, convenio, email, password_hash) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [name, cpf, convenio, email, hash], (err, result) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                res.status(500).send('Erro ao criar usuário');
                return;
            }
            res.send('Usuário registrado com sucesso!');
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Usuário não encontrado');
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                res.status(500).send('Erro no servidor');
                return;
            }

            if (result) {
                res.send('Login bem-sucedido!');
            } else {
                res.status(401).send('Senha incorreta');
            }
        });
    });
});

app.get('/comecar', (req, res) => {
    res.render('comecar', { title: 'começar' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
