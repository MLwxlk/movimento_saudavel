const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const session = require('express-session'); // Importando o express-session
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // Nome do arquivo do banco de dados

app.use(session({
    secret: 'loginParaUsuarios', // Uma chave secreta para assinar a sessão
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // Defina como 'true' se estiver usando https
        maxAge: 24 * 60 * 60 * 1000 // Defina um tempo para o cookie expirar
    }
}));
// Criação das tabelas (agendamentos/consultas e exames)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            data_nasc TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);    

    db.run(`
        CREATE TABLE IF NOT EXISTS consultas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_consulta TEXT NOT NULL,
            hora TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS metas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            hora TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS exercicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            duracao TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS questionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            data_nascimento TEXT NOT NULL,
            peso REAL NOT NULL,
            exercicios TEXT,
            nivel_atividade TEXT,
            condicao_medica TEXT,
            lesao_cirurgia TEXT,
            limitacao_movimento TEXT,
            frequencia_exercicios TEXT,
            duracao_exercicios TEXT
        );
    `);
});


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/exercicio', (req, res) => {
    res.render('exercicio', { title: 'Exercicios'});
});

app.get('/exercicio-start', (req, res) => {
    res.render('exercicio-start', { title: 'Exercicios'});
});

app.get('/register', (req, res) => {
    res.render('cadastro', { title: 'Cadastro' });
});

app.get('/comecar', (req, res) => {
    res.render('comecar', { title: 'Começar' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/comecar_form', (req, res) => {
    res.render('comecar_form', { title: 'Começar'});
});

app.get('/contato', (req, res) => {
    res.render('contatos', { title: 'Contatos' });
});

function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 === 10 || digito1 === 11) digito1 = 0;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 === 10 || digito2 === 11) digito2 = 0;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, cpf, data_nasc, email, senha } = req.body;

    if (!senha) {
        return res.status(400).send('A senha é obrigatória.');
    }

    // Valida o CPF
    if (!validarCPF(cpf)) {
        return res.status(400).send('CPF inválido.');
    }

    try {
        // Verifica se o e-mail ou CPF já estão registrados
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ? OR cpf = ?', [email, cpf], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(400).send('Usuário já registrado.');
        }

        // Hasheia a senha
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Insere o usuário no banco de dados
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (username, cpf, email, senha, data_nasc) 
                 VALUES (?, ?, ?, ?, ?)`,
                [username, cpf.replace(/\D/g, ''), email, hashedPassword, data_nasc],
                function (err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        res.redirect('/'); // Redireciona para a página inicial após o cadastro
    } catch (err) {
        console.error('Erro no processo de cadastro:', err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verifica se o usuário existe no banco de dados
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Erro ao verificar login:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (!row) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Compara a senha fornecida com a senha armazenada
        bcrypt.compare(senha, row.senha, (err, result) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }

            if (result) {
                // Autenticação bem-sucedida, armazene a informação na sessão
                req.session.user = { id: row.id, email: row.email };
                console.log('Sessão criada:', req.session.user); // Log de depuração
                return res.status(200).json({ message: 'Login bem-sucedido' });
            } else {
                return res.status(401).json({ message: 'Senha incorreta' });
            }
        });
    });
});

// Fecha o banco de dados quando o servidor for encerrado
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o banco de dados:', err);
        } else {
            console.log('Banco de dados fechado.');
        }
        process.exit(0);
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deslogar' });
        }
        res.status(200).json({ message: 'Logout bem-sucedido' });
    });
});

// Definir a função isAuthenticated
function isAuthenticated(req, res, next) {
    console.log('Sessão no isAuthenticated:', req.session.user); // Verificar o conteúdo da sessão
    if (req.session.user) {
        return next(); // Usuário autenticado
    } else {
        return res.status(401).json({ message: 'Você precisa estar logado para acessar esta página' });
    }
}

// Rota para verificar se o usuário está logado
app.get('/check-login', (req, res) => {
    console.log('Sessão na /check-login:', req.session.user); // Log de depuração
    if (req.session && req.session.user) {
        return res.json({ loggedIn: true });
    } else {
        return res.json({ loggedIn: false });
    }
});

app.post('/agendar', isAuthenticated, (req, res) => {
    console.log('Sessão no agendamento:', req.session.user); // Verificar a sessão no agendamento
    const { data_consulta, hora } = req.body;
    const usuario_id = req.session.user.id; // Garantir que está usando a chave correta da sessão

    if (!data_consulta || !hora) {
        return res.status(400).json({ message: 'Data e hora são obrigatórios.' });
    }

    // Inserir agendamento no banco de dados
    db.run(
        `INSERT INTO consultas (data_consulta, hora, usuario_id) VALUES (?, ?, ?)`,
        [data_consulta, hora, usuario_id],
        function (err) {
            if (err) {
                console.error('Erro ao agendar:', err);
                return res.status(500).json({ message: 'Erro no servidor ao agendar' });
            }
            res.status(200).json({ success: true, message: 'Agendamento realizado com sucesso!' });
        }
    );
});

app.get('/agendamentos', isAuthenticated, (req, res) => {
    const usuario_id = req.session.user.id; // Garantir que está usando a chave correta da sessão
    
    // Consultar os agendamentos do usuário no banco de dados
    db.all(
        `SELECT * FROM consultas WHERE usuario_id = ?`,
        [usuario_id],
        (err, rows) => {
            if (err) {
                console.error('Erro ao buscar agendamentos:', err);
                return res.status(500).json({ message: 'Erro no servidor ao buscar agendamentos' });
            }

            if (rows.length > 0) {
                res.json(rows);  // Retorna os agendamentos encontrados
            } else {
                res.json([]);  // Retorna um array vazio caso não haja agendamentos
            }
        }
    );
});

app.get('/settings', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    // Consulta os dados do usuário no banco de dados
    db.get('SELECT username, data_nasc, email FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (!row) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Passa os dados para a página de configurações
        res.render('settings', {
            title: 'Configurações de Perfil',
            username: row.username,
            dataNascimento: row.data_nasc,
            email: row.email
        });
    });
});

app.post('/submit-questionnaire', isAuthenticated, (req, res) => {
    const {
        nome,
        data_nascimento,
        peso,
        exercicios,
        nivel_atividade,
        medical_condition,
        surgery,
        limitation,
        exercise_frequency,
        exercise_duration
    } = req.body;

    // Verificar se os campos obrigatórios foram preenchidos
    if (!nome || !data_nascimento || !peso) {
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    // Salvar no banco de dados
    db.run(
        `INSERT INTO questionarios (
            nome, data_nascimento, peso, exercicios, nivel_atividade, condicao_medica, lesao_cirurgia, limitacao_movimento, frequencia_exercicios, duracao_exercicios
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nome,
            data_nascimento,
            peso,
            exercicios || null,
            nivel_atividade || null,
            medical_condition || null,
            surgery || null,
            limitation || null,
            exercise_frequency || null,
            exercise_duration || null
        ],
        function (err) {
            if (err) {
                console.error('Erro ao salvar o questionário:', err);
                return res.status(500).json({ message: 'Erro no servidor ao salvar questionário.' });
            }
            res.status(200).json({ message: 'Questionário enviado com sucesso!' });
            window.location.href = "/"
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
