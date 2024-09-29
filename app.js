const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path'); // Adicione esta linha

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Diretório onde as views estão

app.use(express.static(path.join(__dirname, 'public'))); // Para servir arquivos estáticos

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/comecar', (req, res) => {
    res.render('comecar', { title: 'Começar' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});