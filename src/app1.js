var express = require('express');
var mysql = require('mysql');
var conn_detail = require("./conn.json")
var app = express();

var connection = mysql.createConnection({
    // properties
    'host': conn_detail.host,
    'user': conn_detail.user,
    'password': conn_detail.password,
    'database': conn_detail.database,
    'connectionLimit': 100,
    'port': 3306,
    'debug': false,
    'multipleStatements': true
});

connection.connect(function(error){
    // callback
    if(!!error){
        console.log('Error when connecting');
        
        console.log(error);
    }else{
        console.log('Db connected!');
    }
});
app.post('/adddb', function(req, res){
    // about mysql
    console.log(req.query.parameter)
    console.log(req.query.second)
    connection.query("SELECT * FROM employees", function(error, rows, fields){
        // callback function
        if(!!error){
            resp.status(501).send("database query error");
            console.log('Error in query');
        }else{
            console.log('Successful query');
            console.log(rows)
            res.status(200).send('some text');
        }
    });
});
app.get('/adddb', function(req, res){
    // about mysql
    
    connection.query("SELECT * FROM employees", function(error, rows, fields){
        // callback function
        if(!!error){
            console.log('Error in query');
            resp.status(501).send("database query error");
        }else{
            console.log('Successful query');
            console.log(rows)
            res.status(200).send('some text');
        }
    });
});
app.listen(1337);