const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Cache em memória para armazenar usuários
let userCache = {};

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

// Rota para registrar um novo usuário
app.post('/register', (req, res) => {
    const { username, cpf, convenio, email, senha } = req.body;

    if (!senha) {
        return res.status(400).send('A senha é obrigatória.');
    }

    // Verifica se o e-mail já está cadastrado no cache
    if (userCache[email]) {
        return res.status(400).send('Usuário já registrado.');
    }

    bcrypt.hash(senha, saltRounds, (err, hash) => {
        if (err) {
            console.error('Erro ao hashear senha:', err);
            return res.status(500).send('Erro no servidor');
        }

        // Salva o usuário no cache
        userCache[email] = {
            username,
            cpf: cpf.replace(/\D/g, ''),
            convenio,
            email,
            senha: hash
        };

        res.redirect('/');
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const user = userCache[email];

    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
    }

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

app.get('/comecar', (req, res) => {
    res.render('comecar', { title: 'Começar' });
});

app.get('/exercicio', (req, res) => {
    res.render('exercicio', { title: 'Exercicios' });
});

app.get('/exercicio-start', (req, res) => {
    res.render('exercicio-start', { title: 'Exercicios' });
}); 

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
