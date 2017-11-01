var request = require('request');
var cheerio = require('cheerio');

var cont =1;

//BD

var express = require('express');
var app = express();

var titulos = [];
var contenidos = [];


var aeropuertoMX = ["ACA",    "Toluca",    "AGU",    "CUN",    "CZM",    "Ciudad de México",    "CJS",    "Ciudad Juárez",    "CEN",    "CLQ",    "CZM",    "CUL",    "DGO",    "GDL",
    "HMO",    "HUX",    "ZIH",    "LAP",    "BJX",    "SJD",    "LMM",    "MZT",    "MXL",    "MTY",    "MLM",    "MID",    "OAX",    "PXM",    "PBC",
    "PVR",    "QRO",    "SLP",    "TAP",    "TPQ",    "TIJ",    "TRC",    "TGZ",    "UPN",    "VER",    "VSA",    "ZCL"];

var aeropuertosUSA = ["CGX",    "PWK",    "LAX",    "SFO",    "SAN",    "AUS",    "GRB",    "SAT",    "MDW",    "ORD",    "DFW",    "DEN",    "FAT",    "IAH",    "VGT",    "LAS",
    "MKE",    "JFK",    "OAK",    "ONT",    "ORL",    "PHX",    "PWM",    "RNO",    "SMF",    "SAT",    "SFO",    "SJD",    "SEA", "MIA"];
var aeropuertosCAM = ["GUA","MGA","SJO","SJU","ZSA"];

var aeroList = ["aeropuertoMX","aeropuertosUSA","aeropuertosCAM"];


/*


app.get('/', function (req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'kenn',
        password: '123456',
        server: 'DESKTOP-1TIP1T5\\KENALVSQL',
        database: 'Prueba'
    };

    // connect to your database
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }


        request({url: 'https://thehackernews.com/', encoding: 'binary'}, function (err, response, body) {

            var $ = cheerio.load(body);

            $('.main-article-info').each(function () {// tomo los datos usando inspeccion, para ver que quiero tomar
                titulos.push($(this).find('.post-title a').text()); // los meto en un array
                contenidos.push($(this).find('.entry-content div').text());
            });


            $(titulos).each(function (i, element) {// en este paso imprimo la informacion obtenida de la pagina
            var name = 'SiempreListos';
            var desc = 'los scouts en media reunion aclamando por salvacion a Baden Powel';
            console.log(element+"\n");
            console.log(contenidos[i]+"\n");
            var request = new sql.Request();
                // query to the database and get the records
                request.query("INSERT INTO kenn.webScraping (titulo,descripcion) values ('"+element+"','"+element+"');",function(err, recordset) {
                    if (err) {
                        console.log(err);
                        return res.send('Error occured');
                    }
                    return res.send('Successfully inserted');
                });
             });
            // create Request object
            var request2 = new sql.Request();

            // query to the database and get the records
            request2.query('select * from kenn.webScraping', function (err, recordset) {

                if (err) {
                    console.log(err)
                }
            //    console.log(recordset);                // send records as a response
               // res.send(recordset);

            });
        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

*/


app.get('/', function (req, res) {



    var sql = require("mssql");

// config for your database
    var config = {
        user: 'kenn',
        password: '123456',
        server: 'DESKTOP-1TIP1T5\\KENALVSQL',
        database: 'Prueba'
    };



        sql.connect(config, function (err) {
            console.log("Conectando BD");
            if (err) {
                console.log(err);
            }

            // query to the database and get the records


            for(var y = 0;y < aeropuertoMX.length; y++){
                for(var z = 0; z < aeropuertosCAM.length;z++) {
                    request({
                        url: 'https://www.volaris.com/Flight/Select/?o1=' + aeropuertoMX[y] + '&d1=' + aeropuertosCAM[z] + '&dd1=10/31/2017&o2=' + aeropuertosCAM[z] + '&d2=' + aeropuertoMX[y] + '&dd2=12/29/2017&s=true&cc=USD',
                        encoding: 'binary'
                    }, function (err, response,body) {
                        var $ = cheerio.load(body);

                        $('.flight-fare-row').each(function () {// tomo los datos usando inspeccion, para ver que quiero tomar
                            var og1 = $(this).find('.flight-origin .origin').text(); // los meto en un array
                            var ogHour = $(this).find('.flight-origin .departure-time').text();
                            var escalas = $(this).find('.flight-stop .flight-journey').text();
                            //var escala = escalas.split(" ");
                            var time = $(this).find('.flight-stop .flight-duration').text();
                            var d1 = $(this).find('.flight-destination .destination').text();
                            var arrival = $(this).find('.flight-fare-row .arrival-time').text();
                            var flightCode = $(this).find('.flight-fare-row .carrier-code').text();
                            var price = $(this).find('span .flight-fare').text();
                            var price2 = price.split(" USD");

                           // var escalaT = escala[0] + escala[1] + escala[2];
                          //  console.log("#" + cont + " " + og1 + " : " + ogHour + " - " + escalaT + " : " + time + " - " + d1 + " : " + arrival + " - " + flightCode + " - " + price2[0]+ '\n');

                            var requestSQL = new sql.Request();
                            requestSQL.query("insert into webScraping(origen,horaOrigen,escala,horaEscala,destino,horaDestino,codVuelo,precio) values ('" + og1 + "','" + ogHour + "','TTT','" + time + "','" + d1 + "','" + arrival + "','" + flightCode + "','" + price2[0] + "');", function (err, recordset) {
                                console.log("ENTRO QUERY!");
                                if (err) {
                                    console.log(err);
                                    return res.send('Error occured');
                                }
                                console.log("Insertado");
                                //return res.send('Successfully inserted');
                            });


                            cont = cont + 1;

                        });

                     });
                }
            }



    });







    // connect to your database
 /*   sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }




        /*        $(titulos).each(function (i, element) {// en este paso imprimo la informacion obtenida de la pagina

                    console.log("INSERT INTO Flags (name, flag) VALUES ('"+element + "','" + contenidos[i]+"');");
                  /* var request = new sql.Request();
                    // query to the database and get the records
                    request.query("INSERT INTO kenn.webScraping (titulo,descripcion) values ('"+element+"','"+element+"');",function(err, recordset) {
                        if (err) {
                            console.log(err);
                            return res.send('Error occured');
                        }
                        return res.send('Successfully inserted');
                    });


                });




            });

        });*/

    });




var server = app.listen(5000, function () {
    console.log('Server is running..');
});
