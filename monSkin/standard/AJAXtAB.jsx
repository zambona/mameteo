
//-------------------------------------------tableau temperatures---------------------------------------
var myUrl = document.location.href.substring(document.location.href.lastIndexOf( "/" )+1 );

Highcharts.setOptions({
        global: {
            timezoneOffset: -1 * 60
        }
    });

$(document).ready(function(){
       
    var d = new Date();
    //var now = d.getDate()+'/var x = d.getTime()/1000;
    var now = Math.trunc(d.getTime()/1000);
    
    console.log (d);

    if(myUrl === 'Temperatures.php')
    {
    $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: "dataSelection2.php",
            data: "dateDebut=" + now + "&dateFin=" + now + "&myURL=" + myUrl,// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {
               if(data === null){

                            $("#container").html("<div class='w3-tag w3-pale-red w3-container w3-padding-jumbo w3-leftbar w3-border-teal' style='height:400px'><div class='w3-content w3-jumbo w3-padding-jumbo'>entrez une période</div></div>");
                        }else{
                            

                var chart;

                var options = 
                {
                    chart: 
                    {
                    	backgroundColor: 'rgba(255,255,255,0.002)',
                        renderTo: 'container',
                        defaultSeriesType: 'spline'
                    },
                    title: 
                    {
                        text: 'températures du ' + $("#dateDebut").val() 	
                    },
                    xAxis: 
                    {
                        type:'datetime',
                        title: 
                        {
                                text: 'Date'
                        },
                    },
                    yAxis: 
                    {  
                        title: 
                        {
                            text: 'Temperature (°C)'
                        },
                    },
                    plotOptions: {
                                area: {
                                    lineColor: '#000000',
                                        fillColor: {
                                            linearGradient: {
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 1
                                            },
                                            stops: [
                                                [0, Highcharts.getOptions().colors[5]],
                                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(5).get('rgba')]
                                                ]
                                            },
                                        marker: {
                                            radius: 2
                                        },
                                        lineWidth: 1,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        threshold: null
                                    }
                                },
                    series: [
                                {   
                                    name: 'EXTERIEUR',
                                    
                                },
                                {
                                    name: 'INTERIEUR',
                                    color: 'red'
                                    
                                }
                                ],           
                };
                         
           
                		options.series[0].data = data.ext;
                        options.series[1].data = data.inte;
                        chart = new Highcharts.Chart(options);
            }
            }
            
        });
    }
    if(myUrl === 'Pression.php')
    {
    $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: "dataSelectionPress.php",
            data: "dateDebut=" + now + "&dateFin=" + now + "&myURL=" + myUrl,// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {
               if(data === null){

                            $("#container").html("il n'y a pas de données pour cette periode");
                        }else{
                            

                var chart;

                var options = 
                {
                    chart: 
                    {
                        renderTo: 'container',
                        defaultSeriesType: 'area'
                    },
                    title: 
                    {
                        text: 'Pressions du ' + $("#dateDebut").val() + ' au ' + $("#dateFin").val()
                    },
                    xAxis: 
                    {
                        type:'datetime',
                        title: 
                        {
                                text: 'Date'
                        },
                    },
                    yAxis: 
                    {  
                        title: 
                        {
                            text: 'Pressions (mb)'
                        },
                    },
                    plotOptions: {
                                area: {
                                    lineColor: '#000000',
                                        fillColor: {
                                            linearGradient: {
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 1
                                            },
                                            stops: [
                                                [0, Highcharts.getOptions().colors[5]],
                                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(5).get('rgba')]
                                                ]
                                            },
                                        marker: {
                                            radius: 2
                                        },
                                        lineWidth: 1,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        threshold: null
                                    }
                                },
                    series: [{name: 'températures'}]           
                };
                         
           
                options.series[0].data = data;
                chart = new Highcharts.Chart(options);
            }
            }
            
        });
    }
    if(myUrl === 'Precipitations.php')
    {
    $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: "dataSelectionPrecip.php",
            data: "dateDebut=" + now + "&dateFin=" + now + "&myURL=" + myUrl,// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {
               if(data === null){

                            $("#container").html("il n'y a pas de données pour cette periode");
                        }else{
                            

                var chart;

                var options = 
                {
                    chart: 
                    {
                        renderTo: 'container',
                        defaultSeriesType: 'area'
                    },
                    title: 
                    {
                        text: 'températures du ' + $("#dateDebut").val() + ' au ' + $("#dateFin").val()
                    },
                    xAxis: 
                    {
                        type:'datetime',
                        title: 
                        {
                                text: 'Date'
                        },
                    },
                    yAxis: 
                    {  
                        title: 
                        {
                            text: 'Temperature (°C)'
                        },
                    },
                    plotOptions: {
                                area: {
                                    lineColor: '#000000',
                                        fillColor: {
                                            linearGradient: {
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 1
                                            },
                                            stops: [
                                                [0, Highcharts.getOptions().colors[5]],
                                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(5).get('rgba')]
                                                ]
                                            },
                                        marker: {
                                            radius: 2
                                        },
                                        lineWidth: 1,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        threshold: null
                                    }
                                },
                    series: [{name: 'températures'}]           
                };
                         
           
                options.series[0].data = data;
                chart = new Highcharts.Chart(options);
            }
            }
            
        });
    }
    if (myUrl === 'Vent.php')
    {
    $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: "dataSelectionVent.php",
            data: "dateDebut=" + now + "&dateFin=" + now + "&myURL=" + myUrl,// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {
               if(data === null){

                            $("#container").html("il n'y a pas de données pour cette periode");
                        }else{
                            

                var chart;

                var options = 
                {
                    chart: 
                    {
                        renderTo: 'container',
                        defaultSeriesType: 'area'
                    },
                    title: 
                    {
                        text: 'températures du ' + $("#dateDebut").val() + ' au ' + $("#dateFin").val()
                    },
                    xAxis: 
                    {
                        type:'datetime',
                        title: 
                        {
                                text: 'Date'
                        },
                    },
                    yAxis: 
                    {  
                        title: 
                        {
                            text: 'Temperature (°C)'
                        },
                    },
                    plotOptions: {
                                area: {
                                    lineColor: '#000000',
                                        fillColor: {
                                            linearGradient: {
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 1
                                            },
                                            stops: [
                                                [0, Highcharts.getOptions().colors[5]],
                                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(5).get('rgba')]
                                                ]
                                            },
                                        marker: {
                                            radius: 2
                                        },
                                        lineWidth: 1,
                                        states: {
                                            hover: {
                                                lineWidth: 1
                                            }
                                        },
                                        threshold: null
                                    }
                                },
                    series: [{name: 'températures'}]           
                };
                         
           
                options.series[0].data = data;
                chart = new Highcharts.Chart(options);
            }
            }
            
        });
    }
});



 
$("#formDureeTemp").submit(function(e) {

    e.preventDefault();

        $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: 'dataSelection2.php',
            data: "dateDebut=" + $("#dateDebut").val() + "&dateFin=" + $("#dateFin").val() + "&cbInt=" + $('#cbInt').is(':checked'),// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
                {
                    if(data === null){

                        $("#container").html("<div class='w3-tag w3-red w3-container w3-padding-jumbo' style='height:400px'><p class='w3-padding-jumbo w3-jumbo'>il n'y a pas de données pour cette periode</p></div>");

                        }else{
  
                        var chart;
                        var options = 
                            {
                                chart: 
                                {
                                    renderTo: 'container',
                                    defaultSeriesType: 'spline'
                                },
                                title: 
                                {
                                    text: 'températures du ' + $("#dateDebut").val() + ' au ' + $("#dateFin").val()
                                },
                                xAxis: 
                                {
                                    gridLineWidth: 1,
                                    type: 'datetime',
                                    title: 
                                    {
                                            text: 'Date'
                                    },
                                },
                                yAxis: 
                                {  
                                    
                                    title: 
                                    {
                                        text: 'Temperature (°C)'
                                    },
                                },
                                plotOptions: {
                                    series:{
                                        marker: {
                                            enabled: false
                                        }
                                    },

                                        spline: {
                                            lineWidth: 1,
                                            cropThreshold: 20,
                                            dataLabels:{
                                                enabled: true,
                                                rotation: 315,
                                                y: -10
                                            },
                                            states: {
                                                hover: {
                                                    lineWidth: 2
                                                }
                                            },
                                          },
                                      },
                                            
                                series: [
                                {   
                                    name: 'EXTERIEUR',
                                    
                                },
                                {
                                    name: 'INTERIEUR',
                                    color: 'red'
                                    
                                }
                                ],

                            };

                        $("#container").on(function () { // on complete

                            chart.renderer.text('This text is', 150, 80)
                                .css({
                                    color: '#4572A7',
                                    fontSize: '16px'
                                })
                                .add();
                        });
                        
                        var dataIntVis = $('#cbInt').is(':checked'),
                             dataExtVis = true;
        
                        $('#cbInt').click(function () {

                            dataIntVis = !dataIntVis;

                            $('#container').highcharts().series[1].update(
                            {
                                visible: dataIntVis
                            });
                        });

                        $('#cbExt').click(function () {

                            dataExtVis = !dataExtVis;

                            $('#container').highcharts().series[0].update(
                            {
                                visible: dataExtVis
                            });      
                        });
  
                        options.series[0].data = data.ext;
                        options.series[1].data = data.inte;
                        chart = new Highcharts.Chart(options);

                    }       
                }
            });           
    });
            
    
$("#formDureePress").submit(function(e) {

        e.preventDefault();


                $.ajax({type: "POST",
                    dataType:"json", // le format de retour
                    url: 'dataSelectionPress.php',
                    data: "dateDebut=" + $("#dateDebut").val() + "&dateFin=" + $("#dateFin").val(),// si tu as besoin de passer des données en post
                    error: function() {alert('Erreur de communication avec le serveur');},
                    success: function(data) 
                    {
                        if(data === null){

                            $("#container").html("il n'y a pas de données pour cette periode");
                        }else{
 
                        var chart;

                        var options = 
                        {
                            chart: 
                            {

                                renderTo: 'container',
                                defaultSeriesType: 'spline'

                            },
                            title: 
                            {
                                text: 'Pression atmosphérique du ' + $("#dateDebut").val() + ' au ' + $("#dateFin").val()
                            },
                            xAxis: 
                            {
                                type:'datetime',
                                title: 
                                {
                                        text: 'Date'
                                },
                            },
                            yAxis: 
                            {  
                                title: 
                                {
                                    text: 'Pression (mb)'
                                },
                            },
                            plotOptions: {
                                    spline: {
                                        lineWidth: 2,
                                        
                                        states: {
                                            hover: {
                                                lineWidth: 5
                                            }
                                        },
                                      },
                                  },
                                        
                            series: [
                            {   
                                name: 'Pression',
                                
                            },
                            ] 
                        };
                         }
                        options.series[0].data = data;
                       
                        chart = new Highcharts.Chart(options);
                    }       

                });
    });

$("#formDureePrecip").submit(function(e) {

    e.preventDefault();

        $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: 'dataSelectionPrecip.php',
            data: "dateDebut=" + $("#dateDebut").val() + "&dateFin=" + $("#dateFin").val(),// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {

                //alert(data);

                if(data === null){

                        $("#container").html("il n'y a pas de données pour cette periode");

                }else{

                        var chart;
                        var options = {
                        chart: {

                            zoomType: 'x',
                            renderTo:'container',
                            type: 'column',
                            },
                            title:{
                                text: 'PRECIPITATIONS',
                                align:'center',
                                x: 60
                                },
                            xAxis:{
                                type: 'datetime',
                            },
                            yAxis:{
                                title:{
                                    text: 'Précipitations (mm)'
                                },
                                min: 0
                            },
                            plotOptions: {
                                series: {
                                    pointWidth: 20
                                }
                            },
                            marginTop: 80,
                            marginRight: 40,
                        

                        

                            series: [{name: 'Précipitations'}]
                        };

                        options.series[0].data = data;
                        chart = new Highcharts.Chart(options);

                }  
            }      
        });
    });



$("#formDureeVent").submit(function(e) {

    e.preventDefault();

        $.ajax({type: "POST",
            dataType:"json", // le format de retour
            url: 'dataSelectionVent.php',
            data: "dateDebut=" + $("#dateDebut").val() + "&dateFin=" + $("#dateFin").val(),// si tu as besoin de passer des données en post
            error: function() {alert('Erreur de communication avec le serveur');},
            success: function(data) 
            {

               alert(data.length + ' ' + data);

                if(data === null){

                        $("#container").html('<div>' + "il n'y a pas de données pour cette periode" + '</div>');

                }else{

                        var chart;
var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
var categories2 = [];
                        var options = {
                                chart: {
                                    
                                    renderTo:'container',
                                    polar: true,
                                    type: 'column'
                                },
                                data: {
                                    table: 'freq',
                                    startRow: 1,
                                    endRow: 17,
                                    endColumn: 7},
                                title: {
                                    text: 'Wind Rose'
                                },
                                pane: {
                                    size: '85%'
                                },
                                legend: {
                                    align: 'right',
                                    verticalAlign: 'top',
                                    y: 100,
                                    layout: 'vertical'
                                },
                                xAxis: {
                                    type: 'categories',
                                    /*min: 0,
                                    max: 360,*/
                                    type: "",
                                    tickInterval: 22.5,
                                    tickmarkPlacement: 'on',
                                    labels: {
                                        formatter: function () {
                                            return categories[this.value / 22.5];
                                        }
                                    }
                                },
                                yAxis: {
                                    min: 0,
                                    
                                    endOnTick: false,
                                    showLastLabel: true,
                                    title: {
                                        text: 'Frequence %',
                                        rotation: 0
                                    },
                                    labels: {
                                        formatter: function () {
                                            return this.value + '%';
                                        }
                                    },
                                    reversedStacks: false
                                },
                                tooltip: {
                                    valueSuffix: '%'
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
                                    }
                                },
                            
                                series: [{}]
                                };
                                 
                            options.series[0].data = data;
                            chart = new Highcharts.Chart(options);

                        }
                    }
            });
        });




//--------------------------------------------Horloge----------------------------------------------------






//<body onload="horloge();">



/*function horloge()
{
  var tt = new Date().toLocaleString(); // hh:mm:ss
 
  document.getElementById("timer").innerHTML = tt;
  setTimeout(horloge, 1000); // mise à jour du contenu "timer" toutes les secondes
}*/


$(function() {

    /**
     * Get the current time
     */
    function getNow() {
        var now = new Date();

        return {
            hours: now.getHours() + now.getMinutes() / 60,
            minutes: now.getMinutes() * 12 / 60 + now.getSeconds() * 12 / 3600,
            seconds: now.getSeconds() * 12 / 60
        };
    }

    /**
     * Pad numbers
     */
    function pad(number, length) {
        // Create an array of the remaining length + 1 and join it with 0's
        return new Array((length || 2) + 1 - String(number).length).join(0) + number;
    }

    var now = getNow();

    // Create the chart
    $('#clock').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            
        },

        title: undefined,
        pane: {
            background: [{
                // default background
            }, {
                // reflex for supported browsers
                backgroundColor: Highcharts.svg ? {
                    radialGradient: {
                        cx: 0.5,
                        cy: -0.4,
                        r: 1.9
                    },
                    stops: [
                        [0.5, 'rgba(255, 255, 255, 0.2)'],
                        [0.5, 'rgba(200, 200, 200, 0.2)']
                    ]
                } : null
            }]
        },

        yAxis: {
            labels: {
                distance: -20
            },
            min: 0,
            max: 12,
            lineWidth: 0,
            showFirstLabel: false,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 5,
            minorTickPosition: 'inside',
            minorGridLineWidth: 0,
            minorTickColor: '#666',

            tickInterval: 1,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            title: {
                text: 'météo<br>station',
                style: {
                    color: '#BBB',
                    fontWeight: 'normal',
                    fontSize: '8px',
                    lineHeight: '10px'
                },
                y: 10
            }
        },

        tooltip: {
            formatter: function () {
                return this.series.chart.tooltipText;
            }
        },

        series: [{
            data: [{
                id: 'hour',
                y: now.hours,
                dial: {
                    radius: '60%',
                    baseWidth: 4,
                    baseLength: '95%',
                    rearLength: 0
                }
            }, {
                id: 'minute',
                y: now.minutes,
                dial: {
                    baseLength: '95%',
                    rearLength: 0
                }
            }, {
                id: 'second',
                y: now.seconds,
                dial: {
                    radius: '100%',
                    baseWidth: 1,
                    rearLength: '20%'
                }
            }],
            animation: false,
            dataLabels: {
                enabled: false
            }
        }]
    },

        // Move
        function (chart) {
            setInterval(function () {

                now = getNow();

                var hour = chart.get('hour'),
                    minute = chart.get('minute'),
                    second = chart.get('second'),
                    // run animation unless we're wrapping around from 59 to 0
                    animation = now.seconds === 0 ?
                            false :
                            {
                                easing: 'easeOutElastic'
                            };

                // Cache the tooltip text
                chart.tooltipText =
                    pad(Math.floor(now.hours), 2) + ':' +
                    pad(Math.floor(now.minutes * 5), 2) + ':' +
                    pad(now.seconds * 5, 2);

                hour.update(now.hours, true, animation);
                minute.update(now.minutes, true, animation);
                second.update(now.seconds, true, animation);

            }, 1000);

        });
});

// Extend jQuery with some easing (copied from jQuery UI)
$.extend($.easing, {
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }
});



