//Fichero node: configuración del server, conexión con la base de datos y rutas a la API

const express = require('express');
const app = express();
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config()

const DB_CONNECTION = process.env.DB_CONNECTION || '';
mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}) //cadena de conexión
    .then(() => console.log('Conectado a mongoDB'))
    .catch(err => console.log('Error en la conexión a la base de datos: ', err))

//middleware:
//localización de ficheros estaticos
app.use(express.static(__dirname + '/public'));
//mostrar un log de todos los request en la consola
app.use(morgan('dev'));
//capturar datos de formularios html
app.use(bodyParser.urlencoded({ extended: true }));
//capturar datos en formato json
app.use(bodyParser.json());
//simula el DELETE y PUT
app.use(express.methodOverride());
    
let ToDo = mongoose.model('todo', {
    text: String
});

//RUTAS
//GET:
app.get('/api/todos', async(req, res) => {
    try{
        const todos = await ToDo.find();
        res.json(todos)
    } catch (err) {
        console.error('Error al obtener ToDos: ',err);
        return res.status(500).send({error: 'Error en el servidor: ' + err.message});
    }
});

//POST:
app.post('/api/todos', async (req, res) => {
    try{
        await ToDo.create({
        text: req.body.text,
        done: false
        });
        const todos = await ToDo.find(); //busca los ToDos luego de crear uno nuevo
    } catch (err) {
        console.error('Error al crear ToDo:', err.message);
        res.status(500).send({ error: 'Error en el servidor: ' + err.message });
    }
});

//DELETE:
app.delete('/api/todos/:id', async (req, res) => {
    try{
        await ToDo.deleteOne({
            _id: req.params.id
        });
        const todos = await ToDo.find(); //recuperar ToDos luego de eliminar
        res.json(todos);
    } catch (err) {
        console.error('Error al eliminar ToDo:', err.message);
        res.status(500).send({ error: 'Error en el servidor: ' + err.message });
    }
});

//vista html simple de la app, angular maneja el frontend
app.get('*', function(req, res){
    req.sendfile(__dirname + './public/index.html');
});

app.listen(8080, function(){
    console.log('App listen on port 8080')
})