//Fichero node: configuración del server, conexión con la base de datos y rutas a la API

const express = require('express');
const app = express;

const mongoose= require('mongoose');
require('dotenv').config()
const DB_CONNECTION = process.env.DB_CONNECTION || ''
mongoose.connect(DB_CONNECTION) //cadena de conexión

app.configure(function(){
    //localización de ficheros estaticos
    app.use(express.static(__dirname + '/public'));
    //mostrar un log de todos los request en la consola
    app.use(express.logger('dev'));
    //permitir cambiar el html con el metodo POST
    app.use(express.bodyParser());
    //simula el DELETE y PUT
    app.use(express.methodOverride());
});

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
app.delete('/api/todos/:todo', function(req, res){
    ToDo.remove({
        _id: req.params.ToDo
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

//vista html simple de la app, angular maneja el fornt end
app.get('*', function(req, res){
    req.sendfile('./public/index.html');
});

app.listen(8080, function(){
    console.log('App listen on port 8080')
})