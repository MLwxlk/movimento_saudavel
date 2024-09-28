const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
