const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const db = mysql.createConnection({
    host: '127.0.0.1',
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/register', (req, res) => {
    res.render('cadastro', { title: 'Cadastro' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.post('/register', (req, res) => {
    
    const { username, cpf, convenio, email, senha } = req.body;

    if (!senha) {
        return res.status(400).send('A senha é obrigatória.');
    }

    bcrypt.hash(senha, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao hashear senha:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        const sql = 'INSERT INTO users (username, cpf, convenio, email, senha) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [username, cpf.replace(/\D/g, ''), convenio, email, hash], (err, result) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                res.status(500).send('Erro ao criar usuário');
                return;
            }
            res.redirect('/');
        });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const user = results[0];

        bcrypt.compare(senha, user.senha, (err, result) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }

            if (result) {
                return res.status(200).json({ message: 'Login bem-sucedido' });
            } else {
                return res.status(401).json({ message: 'Senha incorreta' });
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
