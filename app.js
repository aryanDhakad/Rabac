const express = require("express");
const ejs = require("ejs");
const app = express();
var admin = require("firebase-admin");
var nodemailer = require("nodemailer")
var alert = require("alert")
require('dotenv').config()


var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'placementseekers1179@gmail.com',
        pass: process.env.GM_PASS
    }
})

var serviceAccount = JSON.parse(process.env.FIRSTR);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const doctor = db.collection("Doctors");
const pat = db.collection("Patients");
const dt = db.collection("db1");
const fs = require('fs');


app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs');

app.get('/', async (req, res) =>{
   
    let fileContent = fs.readFileSync('output.txt', 'utf-8');
    let fileContent1 = fs.readFileSync('output1.txt', 'utf-8');
    let fileContent2 = fs.readFileSync('output2.txt', 'utf-8');
    dt.doc("data1").set({
        0: fileContent,
        1: fileContent1,
        2: fileContent2
    })
   
    res.render("login",{status: "Welcome to Rabac"}) 
})


app.get("/admin",async (req, res) =>{
    var pat_names = [];
        const n = await pat.get();
        n.forEach(doc => {
            pat_names.push(doc.id);
        })
        var doc_names = []
        const n1 = await doctor.get();
        n1.forEach(doc => {
            doc_names.push(doc.id);
        })
        return res.render("admin",{ doc_names:doc_names,pat_names:pat_names})
})

app.post("/register",async (req, res) =>{
        
    // console.log(req.body);
    const temp = await pat.doc(req.body.username).get();
    
    const catagory = req.body['catagory'];
    var newUser = {
        fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        remarks:req.body.remarks,
        password: req.body.password,
        username: req.body.username,
        account:req.body.mail,
        data:[],
        last_visit:"NULL"
    }
     if(catagory === "doctor"){
        if(req.body.op == "add"){
            doctor.doc(req.body.username).set(newUser)
        }
        else if(req.body.op == "del"){
            doctor.doc(req.body.username).delete()
        }
        return res.redirect("/admin")
    }else if(catagory === "patient"){
        if(req.body.op == "add"){
            if(temp.exists){
                return res.render("login",{status: "Username Already Exists.(Patient)"});
            }
            pat.doc(req.body.username).set(newUser)
            return res.render("login",{status: "Account Created.(Patient)"});
        }else if(req.body.op == "del"){
            pat.doc(req.body.username).delete()
            return res.redirect("/admin")
        }
       
}
})


// function conv1(s){
//     return s.split(",").map(x => +x);
// }

app.post('/login',async (req, res) =>{
    // console.log(req.body)
    let usr = req.body['username'] || "null";
    let pass = req.body['password'] || "null";
    let catagory = req.body['catagory'] || "null";

    const tt1 = await dt.doc("data1").get();
    
   
    if(catagory === "doctor"){
        
        const doc = await doctor.doc(usr).get();
        if(doc.exists){
            if(doc.data().password == pass){
                var names = [];     
                const n = await pat.get();      
                n.forEach(doc => {
                    names.push(doc.id);
                })
               
                return res.render("doctor-homepage",{
                    doc_data:doc.data(),
                    pat_names:names,
                    json_pat_names:JSON.stringify(names),
                    pat_data:[],
                    data:""
                })
            }
            else
            return res.render("login",{status: "Wrong Userame or Password.(Doctor)"});
        }else
            return res.render("login",{status: "Account Doesn't Exists.(Doctor)"});        
    }else{
        var p1 = await pat.doc(usr).get();
        if(p1.exists){
            if(p1.data().password == pass){
                
                return res.render("patient-homepage",{data:p1.data(),p_data:JSON.stringify(tt1.data())});
            }else
            return res.render("login",{status: "Wrong Username or Password.(Patient)"});
        }else{
            return res.render("login",{status: "Account Doesn't Exists.(Patient)"});
        
        }
}
})

app.post("/get_pat_data", async (req, res) =>{
    var data = await pat.doc(req.body.pat_name).get();
    var data0 = await data.data().data
    var data1 = data.data()
    var names = JSON.parse(req.body.names);

    var doc_data = await doctor.doc(req.body.doc_name).get()
    res.render("doctor-homepage",{
        doc_data:doc_data.data(),
        pat_names:names,
        json_pat_names:req.body.names,
        pat_data: data0,
        data:data1
    })
})

app.post("/submit_data",async (req, res)=>{
    // console.log(data,req.body['username']);
    // console.log(catagoryof(data.username),data.username);
    // console.log(catagoryof(`${data.date}`),data.date);

    var d1 = await pat.doc(req.body['username']).get();
    d1 = d1.data();
    prev = d1.data;
    var obj = JSON.parse(req.body.data)
    var d_0 = obj.data_0[2]
    var d_1 = obj.data_1[2]
    var d_2 = obj.data_2[2]
    d_0 = d_0[d_0.length - 1] || "Not Recorded"
    d_1 = d_1[d_1.length - 1] || "Not Recorded"
    d_2 = d_2[d_2.length - 1] || "Not Recorded"
    
    var mailoptions = { 
        from:"placementseekers1179@gmail.com",
        to:d1.account,
        subject:"Medical Report from Rabac",
        text:`
        Patient Details :
        Patient : ${d1.fname} ${d1.lname}
        DOB : ${d1.dob}
        Special Remarks : ${d1.remarks}

        Your Medical Report : 

        ECG_AVG : ${d_0}

        PULSE_AVG : ${d_1}

        SMP_AVG : ${d_2}

        Date: ${req.body.date}
        
        Best Wishes from RABAC Team.`
    }
    transporter.sendMail(mailoptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            alert("Email Sent");
        }
    })
    pat.doc(req.body['username']).update({ 
        ECG_AVG : `${d_0}`,
        PULSE_AVG: `${d_1}`,
        SMP_AVG: `${d_2}`,
        last_visit:req.body.date,
        data: {...prev,[req.body.date]:req.body.data}
    })
    res.redirect("/") 
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("The server is running successfully");
})