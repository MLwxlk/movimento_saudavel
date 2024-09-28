const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views'); // Diretório onde as views estão

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/comecar', (req, res) => {
    res.render('comecar');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
