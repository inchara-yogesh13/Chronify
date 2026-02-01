
const express=require('express');
const mysql=require('mysql2');
const cors=require('cors');
const app=express();
app.get("/", (req, res) => {
  res.send("Chronify backend is running 🚀");
});

app.use(cors()); app.use(express.json());
app.use(require("cors")());


const db=mysql.createConnection({
 host:'localhost',
 user:'root',
 password:'iam20yearsbaby',
 database:'chronify'
});

db.connect();

const productive=['github.com','leetcode.com','stackoverflow.com'];

app.post('/api/activity',(req,res)=>{
 const {site,timeSpent}=req.body;
 const category=productive.includes(site)?'productive':'unproductive';
 db.query(
  "INSERT INTO activity(site,time_spent,category,day) VALUES(?,?,?,CURDATE())",
  [site,timeSpent,category],
  ()=>res.send({ok:true})
 );
});
app.get("/api/weekly", (req, res) => {
  const sql = `
    SELECT 
      category, 
      SUM(seconds) as total 
    FROM time_logs 
    GROUP BY category
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    let data = {
      productive: 0,
      unproductive: 0
    };

    results.forEach(row => {
      data[row.category] = row.total;
    });

    res.json(data); // 🔥 THIS LINE IS CRITICAL
  });
});


app.listen(5000,()=>console.log('Chronify running'));
