const inq = require('inquirer');
const inqQuestions = require('./questions');
const q = require('../crm');

/////////////////////////////////
// 1 // Simple query and print
/////////////////////////////////

async function simpleQuery(query) {
    let rows = await q.queryCommand(query);
    console.table(rows);
    q.start();
}

/////////////////////////////////////////////
// 2 // View All Employees by Department
////////////////////////////////////////////
async function empByDept(dept) {     
    let byDeptQuery = allEmpQuery + ' WHERE dept_name = ?;';
    let res = await q.queryCommand(byDeptQuery, [dept]);
    console.table(res);
    q.start();

}

/////////////////////////////////////////////
// 3 // View All Employees by Manager
////////////////////////////////////////////

async function empByManager(manager) {   
    let managerName = manager.split(" ");
    var byManagerQuery = allEmpQuery + ' WHERE manager.first_name = ? AND manager.last_name = ?;';
    let res = await q.queryCommand(byManagerQuery, [managerName[0], managerName[1]]);
    console.table(res);
    q.start();
}

/////////////////////////////////////////////////
// 4 // View Total Utilized Budget by Department
/////////////////////////////////////////////////

async function budgetByDept(dept) {
    let res = await q.queryCommand(budgetQuery, [dept]);
    console.table(res);
    q.start();
}

/////////////////////////////////////////////////
// 5 // Add Employee
/////////////////////////////////////////////////

async function addEmployee(fName, lName, role, manager) {
    let idQuery = await q.queryCommand("SELECT role_id FROM roles WHERE title = ?", [role]);
    let role_id = idQuery[0].role_id;
    let manager_id;
    if (manager === undefined) {
        manager_id = null;
    } else {
        let managerName = manager.split(" ");
        let managerIdQuery = await q.queryCommand("SELECT employee_id FROM employee where first_name = ? AND last_name = ?", [managerName[0], managerName[1]]);
        manager_id = managerIdQuery[0].employee_id;
    }
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)"
    let addEmp = await q.queryCommand(query, [fName, lName, role_id, manager_id]); 
    console.log(`${fName} ${lName} Added Successfully \n \n`);
    q.start();
}

/////////////////////////////////////////////////
// 6 // Delete Employee
/////////////////////////////////////////////////

async function deleteEmployee(name) {
    let empName = name.split(" ");
    let deleteEmp = await q.queryCommand("DELETE FROM employee WHERE first_name = ? AND last_name = ?", [empName[0], empName[1]]);
    console.log(`${name} Deleted Successfully \n \n`);
    q.start();
}

/////////////////////////////////////////////////
// 7 // Add Role
/////////////////////////////////////////////////

async function addRole(title, salary, department) {
    let deptIdQuery = await q.queryCommand("SELECT department_id FROM department WHERE dept_name = ?", [department]);
    let dept_id = deptIdQuery[0].department_id;
    let addRole = await q.queryCommand("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [title, salary, dept_id]);
    console.log(`${title} Added Successfully \n \n`);
    q.start();
}

/////////////////////////////////////////////////
// 8 // Delete Role
/////////////////////////////////////////////////

async function deleteRole(title) {
    let deleteRole = await q.queryCommand("DELETE from roles WHERE title = ?", [title]);
    console.log(`${title} Deleted Successfully \n \n`);
    q.start();
}

//DELETE FROM table_name WHERE condition;



//////////////////////
// Utility functions
/////////////////////

//Initial Questions
function initialCLI(){
    return inq.prompt(inqQuestions.initial);
}


//Return list of choices
function choiceList(rowPacket, colName) {
    return new Promise(function (resolve, reject) {
        var choices = [];
        rowPacket.forEach(row => {
            choices.push(row[colName]);
        })
        if (choices.length === 0 || choices === undefined) return reject("No Choices");
        return resolve(choices);
    })
}

//Return list of Name choices
function nameChoiceList(rowPacket, colName1, colName2) {
    return new Promise(function (resolve, reject) {
        var choices = [];
        rowPacket.forEach(row => {
            choices.push(row[colName1] + " " + row[colName2]);
        })
        if (choices.length === 0 || choices === undefined) return reject("No Managers");
        return resolve(choices);
    })
}


//////////////////////////////////
// LONG SQL Querys
//////////////////////////////////

var allEmpQuery = `SELECT emp.employee_id
, emp.first_name
, emp.last_name
, manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
, dept.dept_name AS department
FROM employee AS emp 
LEFT JOIN roles ON roles.role_id = emp.role_id 
LEFT JOIN employee AS manager ON emp.manager_id = manager.employee_id
LEFT JOIN department AS dept ON dept.department_id = roles.department_id`;

var allManagerQuery = `SELECT manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
FROM employee AS emp 
INNER JOIN employee AS manager ON emp.manager_id = manager.employee_id;`;

var budgetQuery  = `SELECT dept.dept_name AS Department, SUM(roles.salary) AS 'Total Utilized Budget'
FROM employee AS emp 
LEFT JOIN roles ON roles.role_id = emp.role_id 
LEFT JOIN department AS dept ON dept.department_id = roles.department_id
WHERE dept.dept_name = ?`;

/////////////////////////
//Inquirer CLI Functions
/////////////////////////
module.exports.initialCLI = initialCLI;
//query for cli choices
module.exports.choiceList = choiceList;
module.exports.nameChoiceList = nameChoiceList;


//////////////////
//Query Functions
//////////////////
module.exports.empByDept = empByDept;
module.exports.empByManager = empByManager;
module.exports.budgetByDept = budgetByDept;
module.exports.addEmployee = addEmployee;
module.exports.deleteEmployee = deleteEmployee;
module.exports.addRole = addRole;
module.exports.deleteRole = deleteRole;
module.exports.simpleQuery = simpleQuery;

////////////////
//SQL querys
////////////////
module.exports.allEmpQuery = allEmpQuery;
module.exports.allManagerQuery = allManagerQuery;
module.exports.budgetQuery = budgetQuery;
