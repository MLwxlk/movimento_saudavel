const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars'); // Importando o express-handlebars
const app = express();

// Configurando o Handlebars
app.engine('handlebars', exphbs.engine()); // Use exphbs.engine() para configuração
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views'); // Diretório onde as views estão

// Rota principal
app.get('/', (req, res) => {
    res.render('index'); // Renderiza a view 'index.handlebars'
});

// Outra rota
app.get('/comecar', (req, res) => {
    res.render('comecar'); // Renderiza a view 'comecar.handlebars'
});

// Iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
