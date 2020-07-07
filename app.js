//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const {
    url
} = require("inspector");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


let alldata = "";
let chunks = [];
let temp ="";
let storage = [];
let store = [];


app.post("/", function (req, res) {
    
    console.log(req.body)
    if (req.body.india === "india") {
        const url = "https://api.covidindiatracker.com/total.json";
        https.get(url, function (response) {
            response.on("data", function (data) {
                const indiadata = JSON.parse(data);
                const active = indiadata.active
                const confirmed = indiadata.confirmed;
                const recover = indiadata.recovered;
                const death = indiadata.deaths;



                res.render("india", {
                    active: active,
                    confirmed: confirmed,
                    death: death,
                    recover: recover,


                })


            })
        })
    } else if (req.body.world === "world") {
        const url = "https://covid-19india-api.herokuapp.com/global";
        https.get(url, function (response) {
            response.on("data", function (data) {
                const dataget = JSON.parse(data);
                const confirm = dataget.data.confirmed_cases;
                const active = dataget.data.active_cases;
                const recover = dataget.data.recovered_cases;
                const death = dataget.data.death_cases;
                const activerate = dataget.data.active_rate;
                const deathrate = dataget.data.death_rate;
                const newcase = dataget.data.new_cases;
                const newdeath = dataget.data.new_deaths;
                const seriouscase = dataget.data.serious_cases;
                const updates = dataget.updates;


                res.render("result", {
                    confirm: confirm,
                    active: active,
                    recover: recover,
                    death: death,
                    activerate: activerate,
                    deathrate: deathrate,
                    newcase: newcase,
                    newdeath: newdeath,
                    seriouscase: seriouscase,
                    updates: updates
                });
            })
        })
    } else if (req.body.indiadetail === "indiadetail") {
        const url = "https://api.covidindiatracker.com/state_data.json"
        https.get(url, function (response) {
            console.log(response.statusCode);
           
//this is written here because if we simple then server is crash
            response.on('data', function(data) {
              chunks.push(data);
            }).on('end', function() {
              let data   = Buffer.concat(chunks);
               temp = JSON.parse(data);
            //    console.log(temp);
            //    console.log(chunks)
            res.render("state",{indiastate:temp})
            });
           
                    

               
            
        })
    }
     else  {
        const url = "https://api.covid19uk.live/";
        https.get(url, function (response) {
            response.on("data", function (data) {
                const ukdata = JSON.parse(data);
                const confirmed = ukdata.data[0].confirmed;
                const death = ukdata.data[0].death;
                const tested = ukdata.data[0].tested;
                const testdone = ukdata.data[0].test_done;
                const england = ukdata.data[0].england;
                const scotland = ukdata.data[0].scotland;
                const wales = ukdata.data[0].wales;
                const nireland = ukdata.data[0].nireland;
                const area = ukdata.data[0].area;
                res.render("uk", {
                    confirmed: confirmed,
                    death: death,
                    tested: tested,
                    testdone: testdone,
                    england: england,
                    scotland: scotland,
                    wales: wales,
                    nireland: nireland,
                    area: area
                })
            })
        })
    }
    

})

app.get("/", function (req, res) {
    res.render("index");
})

app.get("/india", function (req, res) {
    res.render("india")
})

app.get("/indiastate",function(req,res){
    res.render("indiastate");
})

app.post("/indiastate",function(req,res){
    // const country = req.body.country;
    const url = "https://api.covid19api.com/summary";
    https.get(url,function(response){
        response.on("data",function(data){
            store.push(data);
        }).on("end",function(){
            let temp = Buffer.concat(store);
            const content = JSON.parse(temp);
            const newconfirmed = content.Global.NewConfirmed;
            const totalconfirm =  content.Global.TotalConfirmed;
            const newdeath =  content.Global.NewDeaths;
            const totaldeath =  content.Global.TotalDeaths;
            const newrecovered =  content.Global.NewRecovered;
            const totlarecovered = content.Global.TotalRecovered;
            const countrydetail = content.Countries
            res.render("world",{
                newconfirmed:newconfirmed,
                totalconfirm:totalconfirm,
                newdeath:newdeath,
                totaldeath:totaldeath,
                newrecovered:newrecovered,
                totlarecovered:totlarecovered,
                countrydetail:countrydetail
            })
        })
    })
   
})

































app.listen(3000, function () {
    console.log("the server is up at port 3000");
})