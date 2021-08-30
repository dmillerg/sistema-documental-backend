'use strict'

/**** */
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const multipart = require('connect-multiparty');

const multiPartMiddleware = multipart({
    uploadDir: './public/images-avatar'
});


const app = express();
const port = 3000;

app.use(cors());

// Configuring body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuracion para subir imagenes
app.use(fileUpload());

// Importamos las rutas
var routes = require('./urls_api/url');
const inicio = require('./controllers/apis');


// Cargamos las rutas
app.use('/apis', routes);
app.get('/apis', inicio.getApis);


app.post('/uploads', (req, res) => {

    let EDFile = req.files.avatar;


    EDFile.mv(`./public/images-doc/${EDFile.name}`, err => {

        if (err) return res.status(500).send({ message: err })


        return res.status(200).send({ message: 'File upload' })

    })
})


module.exports = app;


const conexion = require('./database/database');
const api = require('./urls_api/url');
conexion.connect(function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('connect to database');
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));