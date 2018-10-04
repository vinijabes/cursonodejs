var express = require('express');
var app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

//mongodb://admin:node123@ds047762.mlab.com:47762/cursonode-jabinho

let mongoose = require('mongoose');
mongoose.connect(
    'mongodb://admin:node123@ds047762.mlab.com:47762/cursonode-jabinho',
    {useNewUrlParser: true}
);

let ToDo = require('./models/todo')

app.get('/', function(req, res){
    res.send('Hello World!');
});

app.get('/todo', function(req, res){
    ToDo
        .find()
        .exec((err, todos) => {
            if(!err){
                res.json({
                    success:true, 
                    message: "Todos buscados com sucesso.",
                    todos
                });
            }else{
                res.json({
                    success:false,
                    message:err.message,
                    todos: []
                })
            }
        });
});

app.post('/todo', async (req, res) => {
    try{
        let newTodo = new ToDo({
            title: req.body.title        
        })

        let savedTodo = await newTodo.save();
        res.json({
            success:true, 
            message: "Sucesoo!",
            todo: savedTodo
        });            

    }catch(err){
        res.json({
            success:false,
            message:err.message,
            todo: []
        })
    }
})

app.put('/todo', async(req, res) => {
    try{
        let todo = await ToDo.findOneAndUpdate({_id: req.body.id}, {is_complete: false, completed_at: Date.now()});
        res.json({
            success:true, 
            message: "Sucesoo!",
            todo:todo
        });            
    }catch(err){
        res.json({
            success:false,
            message:err.message,
        })
    }
})


let port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Example app listening on port ' + port);
})

module.exports = app;