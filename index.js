const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

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

    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    //show customers list in /view/customers/index.hbs
    app.get('/customers', async (req, res) => {
        let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
        res.render('customers/index', {
            'customers': customers
        })
    })

    //show employees list in /view/employees/index.hbs
    app.get('/employees', async (req, res) => {
        let [employees] = await connection.execute(`
            SELECT * 
            FROM Employees 
            INNER JOIN Departments 
            ON Employees.department_id = Departments.department_id
        `);

        // Format date_joined for each employee
        employees = employees.map(employee => {
            let dateJoined = new Date(employee.date_joined); // assuming date_joined is the field name
            let formattedDate = dateJoined.toISOString().split('T')[0]; // yyyy-mm-dd format
            return { ...employee, date_joined: formattedDate };
        });

        res.render('employees/index', {
            'employees': employees
        })
    })


    // Add New Customer Step 5.3
    app.get('/customers/create', async (req, res) => {
        let [companies] = await connection.execute('SELECT * from Companies');
        //    let [employees] = await connection.execute('SELECT * from Employees');
        res.render('customers/create', {
            'companies': companies
            //        'employees': employees
        })
    })

    // Add New Employee Step 5.3
    app.get('/employees/create', async (req, res) => {
        let [departments] = await connection.execute('SELECT * from Departments');
        let [employees] = await connection.execute('SELECT * from Employees');
        res.render('employees/create', {
            'departments': departments,
            'employees': employees
        })
    })

    app.post('/customers/create', async (req, res) => {
        let { first_name, last_name, rating, company_id } = req.body;
        let query = 'INSERT INTO Customers (first_name, last_name, rating, company_id ) VALUES (?, ?, ?, ?)';
        let bindings = [first_name, last_name, rating, company_id];
        let [result] = await connection.execute(query, bindings);

        let newCustomerId = result.insertId;
        res.redirect('/customers');
    })

    app.post('/employees/create', async (req, res) => {
        let { first_name, last_name, designation, department_id, contact, date_joined } = req.body;
        let query = 'INSERT INTO Employees (first_name, last_name, designation, department_id, contact, date_joined) VALUES (?, ?, ?, ?, ?, ?)';
        let bindings = [first_name, last_name, designation, department_id, contact, date_joined];
        let [result] = await connection.execute(query, bindings);

        let newEmployeeId = result.insertId;
        res.redirect('/employees');
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

    // Edit A Specific Employee Step 5.4
    app.get('/employees/:employee_id/edit', async (req, res) => {
        let [employees] = await connection.execute('SELECT * from Employees WHERE employee_id = ?', [req.params.employee_id]);
        let [departments] = await connection.execute('SELECT * from Departments');
        let employee = employees[0];
        // console.log(employee.date_joined);
        employee.date_joined = employee.date_joined.toISOString().split('T')[0];
        res.render('employees/edit', {
            'employee': employee,
            'departments': departments
        })


    })

    app.post('/customers/:customer_id/edit', async (req, res) => {
        let { first_name, last_name, rating, company_id } = req.body;

        let query = 'UPDATE Customers SET first_name=?, last_name=?, rating=?, company_id=? WHERE customer_id=?';
        let bindings = [first_name, last_name, rating, company_id, req.params.customer_id];
        await connection.execute(query, bindings);

        res.redirect('/customers');
    });

    app.post('/employees/:employee_id/edit', async (req, res) => {
        let { first_name, last_name, designation, department_id, contact, date_joined } = req.body;

        let query = 'UPDATE Employees SET first_name=?, last_name=?, designation=?, department_id=?, contact=?, date_joined=? WHERE employee_id=?';
        let bindings = [first_name, last_name, designation, department_id, contact, date_joined, req.params.employee_id];
        await connection.execute(query, bindings);

        res.redirect('/employees');
    });

    // delete a customer record
    app.get('/customers/:customer_id/delete', async function (req, res) {
        // display a confirmation form 
        const [customers] = await connection.execute(
            "SELECT * FROM Customers WHERE customer_id = ?", [req.params.customer_id]
        );
        const customer = customers[0];

        res.render('customers/delete', {
            customer
        });
    });
        app.post('/customers/:customer_id/delete', async function (req, res) {
            await connection.execute(`DELETE FROM Customers WHERE customer_id = ?`, [req.params.customer_id]);
            res.redirect('/customers');
        });

        // delete a employee record    
        app.get('/employees/:employee_id/delete', async function (req, res) {
            // display a confirmation form 
            const [employees] = await connection.execute(
                "SELECT * FROM Employees WHERE employee_id =?", [req.params.employee_id]
    );
        const employee = employees[0];
   

        res.render('employees/delete', {
            employee
        });
    });   
        app.post('/employees/:employee_id/delete', async function (req, res) {
            await connection.execute(`DELETE FROM Employees WHERE employee_id = ?`, [req.params.employee_id]);
            res.redirect('/employees');
        });



}

    app.listen(3000, () => {
        console.log('Server is running')
    })


main();
