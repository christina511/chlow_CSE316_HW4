var sql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "pass4root",
    database: "mydb"
});

const express = require("express");
const app = express();
const url = require('url');

app.get("/", (req, res) =>{
    writeSearch(req,res);
});

app.get("/schedule",(req, res) =>{
    writeSchedule(req,res);
});

port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log("Server started!");
});

function writeSearch(req, res) {
    res.writeHead(200, {"Content-Type":"text/html"});
    let query = url.parse(req.url, true).query;

    let search = query.search ? query.search : "";
    let filter = query.filter ? query.filter : "";

    let html = `
<!DOCTYPE html>
<html lang = "en">

<head>
    <title> Spring 2021 CSE Class Find </title>
</head>

<body>
    <h1> Spring 2021 CSE Class Find </h1><br>
    <form method = "get" action ="/">
        <input type = "text" name = "search" value = "">
        <b>in</b>
        <select name="filter">
            <option value= "allFields">All Fields</option>
            <option value= "courseName">Course Title</option>
            <option value= "courseNum">Course Num</option>
            <option value= "instructor">Instructor</option>
            <option value= "day">Day</option>
            <option value= "time">Time</option>
        </select>
        <input type="submit" value="Submit">
        <br>
        Example searches: 316, fodor, 2:30 PM, MW
    </form>
    <br><br>
`;

let sql = "SELECT * FROM courses;"

//sql to search all columns
if (filter == "allFields")
    sql = `SELECT * FROM courses
            WHERE Subject       LIKE '%` + search + `%' OR
                Course          LIKE '%` + search + `%' OR
                CourseName      LIKE '%` + search + `%' OR
                Component       LIKE '%` + search + `%' OR
                Section         LIKE '%` + search + `%' OR
                Days            LIKE '%` + search + `%' OR
                StartTime       LIKE '%` + search + `%' OR
                EndTime         LIKE '%` + search + `%' OR
                StartDate       LIKE '%` + search + `%' OR
                EndDate         LIKE '%` + search + `%' OR
                Duration        LIKE '%` + search + `%' OR
                InstructionMode LIKE '%` + search + `%' OR
                Building        LIKE '%` + search + `%' OR
                Room            LIKE '%` + search + `%' OR
                Instructor      LIKE '%` + search + `%' OR
                EnrollCap       LIKE '%` + search + `%' OR
                WaitCap         LIKE '%` + search + `%' OR
                CombDesc        LIKE '%` + search + `%' OR
                CombEnrollCap   LIKE '%` + search + `%';`;
    //sql to search course numbers
    else if (filter == "courseNum")
        sql = `SELECT * FROM courses
            WHERE Course        LIKE '%` + search + `%';`;
        //sql to search course names
        else if (filter == "courseName")
            sql = `SELECT * FROM courses
            WHERE CourseName    LIKE '%` + search + `%';`;
    //sql to search instructors
    else if (filter == "instructor")
        sql = `SELECT * FROM courses
            WHERE Instructor        LIKE '%` + search + `%';`;
    //sql to search days
    else if (filter == "day")
        sql = `SELECT * FROM courses
            WHERE Days        LIKE '%` + search + `%'
            ORDER BY StartTimeInternal;`;
    //sql to search course times
    else if (filter == "time")
        sql = `SELECT * FROM courses
            WHERE StartTime        LIKE '%` + search + `%' OR
              EndTime       LIKE '%` + search + `%';`;
    
    con.query(sql, function(err, result) {
        if(err) throw err;
        for(let item of result){
            html += `
            <button type="button" class="toggle> CSE ` + item.Course + ` - ` +
            item.CourseName + ` - ` + item.Component + ` - Section ` + item.Section + `</button>
            <pre>
                Days: ` + item.Days + `
                Start Time: ` + item.StartTime + `
                End Time: ` + item.EndTime + `
                Start Date: ` + item.StartDate + `
                End Date: ` + item.EndDate + `
                Duration: ` + item.Duration + `
                Instruction Mode: ` + item.InstructionMode + `
                Building: ` + item.Building + `
                Room: ` + item.Room + `
                Instructor: ` + item.Instructor + `
                Enrollment Cap: ` + item.EnrollCap + `
                Wait Cap: ` + item.WaitCap + `
                Combined Description: ` + item.CombDesc + `
                Combined Enrollment Cap: ` + item.CombEnrollCap + `<form action ="/schedule" method="get">
                <button name="add" value="` + item.id + `"> Add Class </button></form> </pre>`;
        }
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });

};

