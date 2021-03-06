const mysql = require('mysql');
const cTable = require('console.table');
const f = require('./assets/functions');
require('dotenv').config();

///////////////////////////////
// QUERY COMMANDS
///////////////////////////////

const con = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + con.threadId);
    start();
});

function queryCommand(command, arr) {
    return new Promise(function(resolve, reject){
        
        con.query(command, arr, function(err, rows){
            if (err) return reject(err);
            return resolve(rows);
        })
        
    })
}

////////////////////////////////
// Switch Case
////////////////////////////////

async function start() {
    let ans = await f.initialCLI();

    switch(ans.choice){
        case "View All Employees":
            f.simpleQuery(f.allEmpQuery);
            //DONE
            break;

        case "View All Employees by Department":
            f.empByDept(ans.department);
            //DONE
            break;

        case "View All Employees by Manager":
            f.empByManager(ans.manager);
            //DONE
            break;

        case "View Total Utilized Budget by Department":
            f.budgetByDept(ans.department);
            //DONE
            break;

        case "Add Employee":
            f.addEmployee(ans.first_name, ans.last_name, ans.role, ans.newManager);
            //DONE
            break;
       
        case "Delete Employee":
            f.deleteEmployee(ans.employee);
            //DONE
            break;
        
        case "Update Employee Role":
            f.updateEmpRole(ans.employee, ans.role);
            //DONE
            break;
        
        case "Update Employee Manager":
            f.updateEmpManager(ans.employee, ans.newManager);
            //DONE
            break;
        
        case "View All Roles":
            f.simpleQuery("SELECT role_id, title, salary FROM roles");
            //DONE
            break;
        
        case "Add Role":
            f.addRole(ans.role_title, ans.role_salary, ans.department);
            //DONE
            break;
        
        case "Delete Role":
            f.deleteRole(ans.role);
            //DONE
            break;
        
        case "View All Departments":
            f.simpleQuery("SELECT * FROM department");
            //DONE
            break;
        
        case "Delete Department":
            f.deleteDepartment(ans.department);
            break;
        
        case "View All Managers":
            //DONE
            f.simpleQuery(f.allManagerQuery);
            break;
        
        case "Exit":
            con.end();
        break;                                                                                                        
    }
}

module.exports.queryCommand = queryCommand;
module.exports.start = start;