const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/', (req,res) => {
        res.send('Hello, World!');
    });

    //show customers list in /view/customers/index.hbs
    app.get('/customers', async (req, res) => {
        let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
        res.render('customers/index', {
            'customers': customers
        })
    })
    
    

    // Add New Customer Step 5.3
    app.get('/customers/create', async(req,res)=>{
        let [companies] = await connection.execute('SELECT * from Companies');
        let [employees] = await connection.execute('SELECT * from Employees');
        res.render('customers/create', {
            'companies': companies,
            'employees': employees
        })
    })
    
    app.post('/customers/create', async(req,res)=>{
        let {first_name, last_name, rating, company_id, employee_id} = req.body;
        let query = 'INSERT INTO Customers (first_name, last_name, rating, company_id) VALUES (?, ?, ?, ?)';
        let bindings = [first_name, last_name, rating, company_id];
        let [result] = await connection.execute(query, bindings);
    
        let newCustomerId = result.insertId;
        // for (let id of employee_id) {
        //     let query = 'INSERT INTO EmployeeCustomer (employee_id, customer_id) VALUES (?, ?)';
        //     let bindings = [id, newCustomerId];
        //     await connection.execute(query, bindings);
        // }
    
        res.redirect('/customers');
    })
    
    
    // Edit A Specific Customer Step 5.4
    app.get('/customers/:customer_id/edit', async (req, res) => {
        let [customers] = await connection.execute('SELECT * from Customers WHERE customer_id = ?', [req.params.customer_id]);
        let [companies] = await connection.execute('SELECT * from Companies');
        let customer = customers[0];
        res.render('customers/edit', {
            'customer': customer,
            'companies': companies
        })
    })
    
    app.post('/customers/:customer_id/edit', async (req, res) => {
        let {first_name, last_name, rating, company_id, employee_id} = req.body;
    
        let query = 'UPDATE Customers SET first_name=?, last_name=?, rating=?, company_id=? WHERE customer_id=?';
        let bindings = [first_name, last_name, rating, company_id, req.params.customer_id];
        await connection.execute(query, bindings);
    
        // await connection.execute('DELETE FROM EmployeeCustomer WHERE customer_id = ?', [req.params.customer_id]);
    
        // for (let id of employee_id) {
        //     let query = 'INSERT INTO EmployeeCustomer (employee_id, customer_id) VALUES (?, ?)';
        //     let bindings = [id, req.params.customer_id];
        //     await connection.execute(query, bindings);
        // }
    
        res.redirect('/customers');
    });
    
    app.get('/customers/:customer_id/delete', async function(req,res){
        // display a confirmation form 
        const [customers] = await connection.execute(
            "SELECT * FROM Customers WHERE customer_id =?", [req.params.customer_id]
        );
        const customer = customers[0];

        res.render('customers/delete', {
            customer
        })

        app.post('/customers/:customer_id/delete', async function(req, res){
            await connection.execute(`DELETE FROM Customers WHERE customer_id = ?`, [req.params.customer_id]);
            res.redirect('/customers');
        })


    })

    

    app.listen(3000, ()=>{
        console.log('Server is running')
    });
}



main();
