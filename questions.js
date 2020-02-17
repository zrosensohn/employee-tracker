var initialQuestions = [

    {
        type: "list",
        message: "What Would You Like To Do?",
        choices: [
          "View All Employees" //query all employees
        , "View All Employees by Department" // query all departments list as choices // query employees where depatment = choice
        , "View All Employees by Manager" // query all managers list as choices // query employees where manager = choice
        , "View Total Utilized Budget by Department" // query all departments list as choices //query salaries where department = choice
        , "Add Employee" // prompt fName // prompt lName // query all roles list as choices // query all employees list as choices // insert into employee table
        , "Delete Employee" // query all employees list as choices // delete from employee table
        , "Update Employee Role" // query all employees list as choices // query all roles list as choices // update selected employee role id with id of selected role
        , "Update Employee Manager" // query all employees list as choices // query all employees NEQ to selected employee // update selected employee with employee id of second question
        , "View All Roles" // query all roles
        , "Add Role" // prompt title // prompt salary // query all departments list as choices // insert into role table 
        , "Delete Role" // query all roles list as choices // delete choice from role table
        , "View All Departments" // query all departments
        , "Delete Department" // query all departments list as choices // delete choice from department table
        , "View All Managers" // query employee table return every distinct manager_id // query employee where employee_id === manager_id
        , "Exit"
        ],
        name: "choice"    
    },
    {
        type: "input",
        message: "Start Year",
        name: "start",
        when: ({ choice }) => {
            if (choice === "Search Between Years") {
                return true;
            } else {
                return false;
            }
        }
    }
]

module.exports = initialQuestions;