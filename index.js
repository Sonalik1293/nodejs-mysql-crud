const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeedb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all employees
app.get('/employee', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an employees
app.get('/employee/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employee/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

app.post('/employee', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?; \
    CALL EmployeeAddorEdit(@id,@name);";
    mysqlConnection.query(sql, [emp.id, emp.name], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('Inserted employee id : ' + element[0].id);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/employee', (req, res) => {
    let emp = req.body;
    var sql = "SET @id = ?;SET @name = ?; \
    CALL EmployeeAddorEdit(@id,@name);";
    mysqlConnection.query(sql, [emp.id, emp.name], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});
