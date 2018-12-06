var express = require('express');
var mysql = require('mysql');
var conn_detail = require("./conn.json")
var app = express();

// details coming from json file
var connection = mysql.createConnection({
    // properties
    'host': conn_detail.host,
    'user': conn_detail.user,
    'password': conn_detail.password,
    'database': conn_detail.database,
    'connectionLimit': 100,
    'port': 3306,
    'debug': false,
    'multipleStatements': true
});
// Connecting to the database
// Normally it should be connect every time there is a query but for test purposes, it's done only once
connection.connect(function(error){
    // callback
    if(!!error){
        console.log('Error when connecting');
        
        console.log(error);
    }else{
        console.log('Db connected!');
    }
});

/*
    This is the POST function
    It expects 3 parameters to be passed:
        - warehouse ID
        - Plate number
        - the date
    
    Using the warehouse ID it gets the longitude and latitude of the warehouse
    Using the number plate it retrieves the id of the number plate
    Using the id of the number plate it retrieves the id of the location associated with the vehicle
    Using the location id, it updates the latitude, longitude and date
*/

app.post('/adddb', function(req, res){
    // POST starts here

    // parameters being passed in
    var warehouse_id = req.query.wid;
    var plate_num = req.query.plate;
    var date = req.query.dt;

    // Variables to be retrieved from DB
    var plateID, latitude, longitude, locationID; 
    
    // Logging onto the server details about each query so the author can keep track of what is happening
    console.log("Read: "+ warehouse_id + " " + plate_num + " " + date);
    console.log("SELECT latitude, longitude FROM Warehouse WHERE warehouseID ="+warehouse_id+";");
    connection.query("SELECT latitude, longitude FROM Warehouse WHERE warehouseID ="+warehouse_id+";", function(error, rows, fields){
        // callback function
        if(!!error){
            res.status(501).send("database query error");
            console.log('Error Warehouse query');
        }else{
            console.log('Successful Warehouse query');
            // The two values returned from the query
            latitude = rows[0].latitude;
            longitude = rows[0].longitude;
            console.log("SELECT plateID FROM License_Plate WHERE number_plate =\'"+plate_num+"\';");
            connection.query("SELECT plateID FROM License_Plate WHERE number_plate =\'"+plate_num+"\';", function(error, rows, fields){
                // callback function
                if(!!error){
                    res.status(501).send("database query error");
                    console.log('Error plate query');
                }else{
                    console.log('Successful plate query');
                    // PlateID returned from the DB
                    plateID = rows[0].plateID;
                    
                    // 3rd query that returns the id of the location record that we will update
                    console.log("SELECT locationID FROM Vehicle WHERE plateID =\'"+plateID+"\';");
                    connection.query("SELECT locationID FROM Vehicle WHERE plateID =\'"+plateID+"\';", function(error, rows, fields){
                        // callback function
                        if(!!error){
                            res.status(501).send("database query error");
                            console.log('Error vehicle query');
                        }else{
                            console.log('Successful vehicle query');
                            locationID = rows[0].locationID;
                            
                            // Updating the record with all the data that we gathered
                            console.log("UPDATE Location SET latitude=\'"+latitude+"\', longitude=\'"+longitude+"\', last_date = \'"+date+"\' where locationID =\'"+locationID+"\';");
                            connection.query("UPDATE Location SET latitude=\'"+latitude+"\', longitude=\'"+longitude+"\', last_date = \'"+date+"\' where locationID =\'"+locationID+"\';", function(error, rows, fields){
                                // callback function
                                if(!!error){
                                    res.status(501).send("database query error");
                                    console.log('Error location query');
                                }else{
                                    console.log('Successful location query');

                                    // Final 200 response to signal that everything went ok
                                    res.status(200).send('Location retured well'); 
                                }
                            });

                        }
                    });
                }
            });
        }
    });

    



});
var text;

/*
    The GET function sends a query to the database and returns a nice table that contains the data
*/
function getDetails() {
    connection.query('SELECT v.vehicleID,lp.number_plate,  l.latitude, l.longitude, l.last_date FROM Vehicle AS v INNER JOIN License_Plate AS lp ON v.plateID = lp.plateID INNER JOIN Location AS l ON v.locationID = l.locationID GROUP BY v.vehicleID;', function (error, results, fields) {
        if (error) throw error;
        // res.send(results)
        // console.log(results[0]);
        // console.log(results[0].vehicleID);
    
        
        text="<style>body { background-color: #3e94ec; font-size: 16px; font-weight: 400; text-rendering: optimizeLegibility; } div.table-title { display: block; margin: auto; max-width: 600px; padding:5px; width: 100%; } .table-title h3 { color: #fafafa; font-size: 30px; font-weight: 400; font-style:normal; text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1); text-transform:uppercase; } .table-fill { background: white; border-radius:3px; border-collapse: collapse; height: 320px; margin: auto; max-width: 800px; padding:5px; width: 100%; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); animation: float 5s infinite; } th { color:#D5DDE5;; background:#1b1e24; border-bottom:4px solid #9ea7af; border-right: 1px solid #343a45; font-size:23px; font-weight: 100; padding:14px; text-align:left; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); vertical-align:middle; } th:first-child { border-top-left-radius:3px; } th:last-child { border-top-right-radius:3px; border-right:none; } tr { border-top: 1px solid #C1C3D1; border-bottom-: 1px solid #C1C3D1; color:#666B85; font-size:16px; font-weight:normal; text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1); } tr:first-child { border-top:none; } tr:last-child { border-bottom:none; } tr:nth-child(odd) td { background:#EBEBEB; } tr:last-child td:first-child { border-bottom-left-radius:3px; } td { background:#FFFFFF; padding:20px; text-align:left; vertical-align:middle; font-weight:300; font-size:18px; text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1); border-right: 1px solid #C1C3D1; } td.text-left { text-align: left; } </style> </head> <body> <div class=\"table-title\"> <h3>Location of vehicles</h3> </div> <table class=\"table-fill\"> <thead> <tr> <th class=\"text-left\">Vehicle ID</th> <th class=\"text-left\">Number Plate</th> <th class=\"text-left\">Latitude</th> <th class=\"text-left\">Longitude</th> <th class=\"text-left\">Date</th> </tr> </thead> <tbody class=\"table-hover\"><tr> <td class=\"text-left\">"+results[0].vehicleID+"</td> <td class=\"text-left\">"+results[0].number_plate+"</td> <td class=\"text-left\">"+results[0].latitude+"</td> <td class=\"text-left\">"+results[0].longitude+"</td> <td class=\"text-left\">"+results[0].last_date+"</td> </tr> </tbody> </table>";
    });
}
getDetails();
setInterval(getDetails, 5*1000);

app.get('/website', function(req, res){
    var results;
    
    // here we display the table created earlier
    res.status(200).send(text);
});
// Running on port 1337
app.listen(1337);
