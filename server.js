//Fichero node: configuración del server, conexión con la base de datos y rutas a la API

const express = require('express');
const app = express();
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config()

const DB_CONNECTION = process.env.DB_CONNECTION || '';
mongoose.connect(DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}); //cadena de conexión

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
app.get('/api/todos', function(req, res){
    ToDo.find(function(err, todos){
        if(err){
            res.send(err);
        }
        res.json(todos);
    });
});

//POST:
app.post('/api/todos', function(req, res){
    ToDo.create({
        text: req.body.text,
        done: false
    }, function(err, ToDo){
        if(err){
            res.send(err);
        }

        ToDo.find(function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//DELETE:
app.delete('/api/todos/:id', function(req, res){
    ToDo.deleteOne({
        _id: req.params.id
    }, function(err){
        if(err){
            res.send(err);
        }

        ToDo.find(function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//vista html simple de la app, angular maneja el frontend
app.get('*', function(req, res){
    req.sendfile(__dirname + './public/index.html');
});

app.listen(8080, function(){
    console.log('App listen on port 8080')
})