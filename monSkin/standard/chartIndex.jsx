
//---------------------------------------METEOGRAMME---------------------------------------

/**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of an XML service. The XML
 *   is translated on the Higcharts website into JSONP for the sake of the demo
 *   being shown on both our website and JSFiddle.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the different
 *   methods and subroutines associated with the demo.
 * - The parseYrData method parses the data from www.yr.no into several parallel arrays. These
 *   arrays are used directly as the data option for temperature, precipitation
 *   and air pressure. As the temperature data gives only full degrees, we apply
 *   some smoothing on the graph, but keep the original data in the tooltip.
 * - After this, the options structure is build, and the chart generated with the
 *   parsed data.
 * - In the callback (on chart load), we weather icons on top of the temperature series.
 *   The icons are sprites from a single PNG image, placed inside a clipped 30x30
 *   SVG <g> element. VML interprets this as HTML images inside a clipped div.
 * - Lastly, the wind arrows are built and added below the plot area, and a grid is
 *   drawn around them. The wind arrows are basically drawn north-south, then rotated
 *   as per the wind direction.
 */

function Meteogram(xml, container) {
    // Parallel arrays for the chart data, these are populated as the XML/JSON file
    // is loaded
    this.symbols = [];
    this.symbolNames = [];
    this.precipitations = [];
    this.windDirections = [];
    this.windDirectionNames = [];
    this.windSpeeds = [];
    this.windSpeedNames = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.xml = xml;
    this.container = container;

    // Run
    this.parseYrData();
}
/**
 * Return weather symbol sprites as laid out at http://om.yr.no/forklaring/symbol/
 */
Meteogram.prototype.getSymbolSprites = function (symbolSize) {
    return {
        '01d': {
            x: 0,
            y: 0
        },
        '01n': {
            x: symbolSize,
            y: 0
        },
        '16': {
            x: 2 * symbolSize,
            y: 0
        },
        '02d': {
            x: 0,
            y: symbolSize
        },
        '02n': {
            x: symbolSize,
            y: symbolSize
        },
        '03d': {
            x: 0,
            y: 2 * symbolSize
        },
        '03n': {
            x: symbolSize,
            y: 2 * symbolSize
        },
        '17': {
            x: 2 * symbolSize,
            y: 2 * symbolSize
        },
        '04': {
            x: 0,
            y: 3 * symbolSize
        },
        '05d': {
            x: 0,
            y: 4 * symbolSize
        },
        '05n': {
            x: symbolSize,
            y: 4 * symbolSize
        },
        '18': {
            x: 2 * symbolSize,
            y: 4 * symbolSize
        },
        '06d': {
            x: 0,
            y: 5 * symbolSize
        },
        '06n': {
            x: symbolSize,
            y: 5 * symbolSize
        },
        '07d': {
            x: 0,
            y: 6 * symbolSize
        },
        '07n': {
            x: symbolSize,
            y: 6 * symbolSize
        },
        '08d': {
            x: 0,
            y: 7 * symbolSize
        },
        '08n': {
            x: symbolSize,
            y: 7 * symbolSize
        },
        '19': {
            x: 2 * symbolSize,
            y: 7 * symbolSize
        },
        '09': {
            x: 0,
            y: 8 * symbolSize
        },
        '10': {
            x: 0,
            y: 9 * symbolSize
        },
        '11': {
            x: 0,
            y: 10 * symbolSize
        },
        '12': {
            x: 0,
            y: 11 * symbolSize
        },
        '13': {
            x: 0,
            y: 12 * symbolSize
        },
        '14': {
            x: 0,
            y: 13 * symbolSize
        },
        '15': {
            x: 0,
            y: 14 * symbolSize
        },
        '20d': {
            x: 0,
            y: 15 * symbolSize
        },
        '20n': {
            x: symbolSize,
            y: 15 * symbolSize
        },
        '20m': {
            x: 2 * symbolSize,
            y: 15 * symbolSize
        },
        '21d': {
            x: 0,
            y: 16 * symbolSize
        },
        '21n': {
            x: symbolSize,
            y: 16 * symbolSize
        },
        '21m': {
            x: 2 * symbolSize,
            y: 16 * symbolSize
        },
        '22': {
            x: 0,
            y: 17 * symbolSize
        },
        '23': {
            x: 0,
            y: 18 * symbolSize
        }
    };
};


/**
 * Function to smooth the temperature line. The original data provides only whole degrees,
 * which makes the line graph look jagged. So we apply a running mean on it, but preserve
 * the unaltered value in the tooltip.
 */
Meteogram.prototype.smoothLine = function (data) {
    var i = data.length,
        sum,
        value;

    while (i--) {
        data[i].value = value = data[i].y; // preserve value for tooltip

        // Set the smoothed value to the average of the closest points, but don't allow
        // it to differ more than 0.5 degrees from the given value
        sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
        data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
    }
};

/**
 * Callback function that is called from Highcharts on hovering each point and returns
 * HTML for the tooltip.
 */
Meteogram.prototype.tooltipFormatter = function (tooltip) {
	
    // Create the header with reference to the time interval
    var index = tooltip.points[0].point.index,
        ret = '<h5>' + Highcharts.dateFormat('%A, %b %e, %H:%M', tooltip.x) + '-' +
            Highcharts.dateFormat('%H:%M', tooltip.points[0].point.to) + '</h5><br>';

    // Symbol text
    ret += '<b>' + this.symbolNames[index] + '</b></b>';

    ret += '<table class="w3-bordered w3-striped">';

    // Add all series
    Highcharts.each(tooltip.points, function (point) {
        var series = point.series;
        ret += '<tr><td><span style="color:' + series.color + '">\u25CF</span> ' + series.name +
            ': </td><td>' + Highcharts.pick(point.point.value, point.y) +
            series.options.tooltip.valueSuffix + '</td></tr>';
    });

    // Add wind
    ret += '<tr><td style="vertical-align: top">\u25CF Vent</td><td>' + this.windDirectionNames[index] +
        '<br>' + this.windSpeedNames[index] + ' (' +
        Highcharts.numberFormat(this.windSpeeds[index], 1) + ' m/s)</td></tr>';

    // Close
    ret += '</table>';


    return ret;
};

/**
 * Draw the weather symbols on top of the temperature series. The symbols are sprites of a single
 * file, defined in the getSymbolSprites function above.
 */
Meteogram.prototype.drawWeatherSymbols = function (chart) {
    var meteogram = this,
        symbolSprites = this.getSymbolSprites(30);

    $.each(chart.series[0].data, function (i, point) {
        var sprite,
            group;

        if (meteogram.resolution > 36e5 || i % 2 === 0) {

            sprite = symbolSprites[meteogram.symbols[i]];
            if (sprite) {

                // Create a group element that is positioned and clipped at 30 pixels width and height
                group = chart.renderer.g()
                    .attr({
                        translateX: point.plotX + chart.plotLeft - 15,
                        translateY: point.plotY + chart.plotTop - 30,
                        zIndex: 5
                    })
                    .clip(chart.renderer.clipRect(0, 0, 30, 30))
                    .add();

                // Position the image inside it at the sprite position
                chart.renderer.image(
                    'https://www.highcharts.com/samples/graphics/meteogram-symbols-30px.png',
                    -sprite.x,
                    -sprite.y,
                    90,
                    570
                )
                    .add(group);
            }
        }
    });
};

/**
 * Create wind speed symbols for the Beaufort wind scale. The symbols are rotated
 * around the zero centerpoint.
 */
Meteogram.prototype.windArrow = function (name) {
    var level,
        path;

    // The stem and the arrow head
    path = [
        'M', 0, 7, // base of arrow
        'L', -1.5, 7,
        0, 10,
        1.5, 7,
        0, 7,
        0, -10 // top
    ];

    level = $.inArray(name, ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate breeze',
        'Fresh breeze', 'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm',
        'Violent storm', 'Hurricane']);
    /*level = $.inArray(name, ['Calme', 'Très légère brise', 'Légère brise', 'Petite brise', 'Jolie brise',
        'Bonne brise', 'Vent frais', 'Grand frais', 'Coup de vent', 'Fort coup de vent', 'Tempête',
        'Violente tempête', 'Ouragan']);*/

    if (level === 0) {
        path = [];
    }

    if (level === 2) {
        path.push('M', 0, -8, 'L', 4, -8); // short line
    } else if (level >= 3) {
        path.push(0, -10, 7, -10); // long line
    }

    if (level === 4) {
        path.push('M', 0, -7, 'L', 4, -7);
    } else if (level >= 5) {
        path.push('M', 0, -7, 'L', 7, -7);
    }

    if (level === 5) {
        path.push('M', 0, -4, 'L', 4, -4);
    } else if (level >= 6) {
        path.push('M', 0, -4, 'L', 7, -4);
    }

    if (level === 7) {
        path.push('M', 0, -1, 'L', 4, -1);
    } else if (level >= 8) {
        path.push('M', 0, -1, 'L', 7, -1);
    }

    return path;
};

/**
 * Draw the wind arrows. Each arrow path is generated by the windArrow function above.
 */
Meteogram.prototype.drawWindArrows = function (chart) {
    var meteogram = this;

    $.each(chart.series[0].data, function (i, point) {
        var arrow, x, y;

        if (meteogram.resolution > 36e5 || i % 2 === 0) {

            // Draw the wind arrows
            x = point.plotX + chart.plotLeft + 7;
            y = 255;
            if (meteogram.windSpeedNames[i] === 'Calm') {
                arrow = chart.renderer.circle(x, y, 10).attr({
                    fill: 'none'
                });
            } else {
                arrow = chart.renderer.path(
                    meteogram.windArrow(meteogram.windSpeedNames[i])
                ).attr({
                    rotation: parseInt(meteogram.windDirections[i], 10),
                    translateX: x, // rotation center
                    translateY: y // rotation center
                });
            }
            arrow.attr({
                stroke: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                'stroke-width': 1.5,
                zIndex: 5
            })
            .add();

        }
    });
};

/**
 * Draw blocks around wind arrows, below the plot area
 */
Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    var xAxis = chart.xAxis[0],
        x,
        pos,
        max,
        isLong,
        isLast,
        i;

    for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {

        // Get the X position
        isLast = pos === max + 36e5;
        x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        if (this.resolution > 36e5) {
            isLong = pos % this.resolution === 0;
        } else {
            isLong = i % 2 === 0;
        }
        chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
            'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
            .attr({
                'stroke': chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }
};

/**
 * Get the title based on the XML data
 */
Meteogram.prototype.getTitle = function () {
    return 'Prévisions météo pour ' + this.xml.location.name + ', ' + this.xml.location.country + '<br>';
};

/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    var meteogram = this;

    return {
        chart: {
            renderTo: this.container,
            backgroundColor: 'rgba(255,255,255,0.002)',
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
           /* width: 100%,*/
            height: 310
        },

        title: {
            text: this.getTitle(),
            align: 'left'

        },

        credits: {
            text: 'Forecast from <a href="http://yr.no">yr.no</a>',
            href: this.xml.credit.link['@attributes'].url,
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
            	$('#tool').html(meteogram.tooltipFormatter(this));
                return false;
            }
        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            }
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            // Custom positioner to provide even temperature ticks from top down
            tickPositioner: function () {
                var max = Math.ceil(this.max) + 1,
                    pos = max - 12, // start
                    ret;

                if (pos < this.min) {
                    ret = [];
                    while (pos <= max) {
                        ret.push(pos += 1);
                    }
                } // else return undefined and go auto

                return ret;

            },
            maxPadding: 0.3,
            tickInterval: 1,
            gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'hPa',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: Highcharts.getOptions().colors[2]
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: Highcharts.getOptions().colors[2]
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                valueSuffix: '°C'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Precipitation',
            data: this.precipitations,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            borderWidth: 0,
            shadow: false,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    if (this.y > 0) {
                        return this.y;
                    }
                },
                style: {
                    fontSize: '8px'
                }
            },
            tooltip: {
                valueSuffix: 'mm'
            }
        }, {
            name: 'Pression atmosphérique',
            color: Highcharts.getOptions().colors[2],
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' hPa'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }]
    };
};

/**
 * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
 */
Meteogram.prototype.onChartLoad = function (chart) {

    this.drawWeatherSymbols(chart);
    this.drawWindArrows(chart);
    this.drawBlocksForWindArrows(chart);

};

/**
 * Create the chart. This function is called async when the data file is loaded and parsed.
 */
Meteogram.prototype.createChart = function () {
    var meteogram = this;
    this.chart = new Highcharts.Chart(this.getChartOptions(), function (chart) {
        meteogram.onChartLoad(chart);
    });
};

/**
 * Handle the data. This part of the code is not Highcharts specific, but deals with yr.no's
 * specific data format
 */
Meteogram.prototype.parseYrData = function () {

    var meteogram = this,
        xml = this.xml,
        pointStart;

    if (!xml || !xml.forecast) {
        $('#loading').html('<i class="fa fa-frown-o"></i> Failed loading data, please try again later');
        return;
    }

    // The returned xml variable is a JavaScript representation of the provided XML,
    // generated on the server by running PHP simple_load_xml and converting it to
    // JavaScript by json_encode.
    $.each(xml.forecast.tabular.time, function (i, time) {
        // Get the times - only Safari can't parse ISO8601 so we need to do some replacements
        var from = time['@attributes'].from + ' UTC',
            to = time['@attributes'].to + ' UTC';

        from = from.replace(/-/g, '/').replace('T', ' ');
        from = Date.parse(from);
        to = to.replace(/-/g, '/').replace('T', ' ');
        to = Date.parse(to);

        if (to > pointStart + 4 * 24 * 36e5) {
            return;
        }

        // If it is more than an hour between points, show all symbols
        if (i === 0) {
            meteogram.resolution = to - from;
        }

        // Populate the parallel arrays
        meteogram.symbols.push(time.symbol['@attributes'].var.match(/[0-9]{2}[dnm]?/)[0]);
        meteogram.symbolNames.push(time.symbol['@attributes'].name);

        meteogram.temperatures.push({
            x: from,
            y: parseInt(time.temperature['@attributes'].value, 10),
            // custom options used in the tooltip formatter
            to: to,
            index: i
        });

        meteogram.precipitations.push({
            x: from,
            y: parseFloat(time.precipitation['@attributes'].value)
        });
        meteogram.windDirections.push(parseFloat(time.windDirection['@attributes'].deg));
        meteogram.windDirectionNames.push(time.windDirection['@attributes'].name);
        meteogram.windSpeeds.push(parseFloat(time.windSpeed['@attributes'].mps));
        meteogram.windSpeedNames.push(time.windSpeed['@attributes'].name);

        meteogram.pressures.push({
            x: from,
            y: parseFloat(time.pressure['@attributes'].value)
        });

        if (i === 0) {
            pointStart = (from + to) / 2;
        }
    });

    // Smooth the line
    this.smoothLine(this.temperatures);

    // Create the chart when the data is loaded
    this.createChart();
};
// End of the Meteogram protype

$(function () { // On DOM ready...
	var place = 'France/Midi-Pyrénées/Rodez~2983154';
	console.log(location);
    // Set the hash to the yr.no URL we want to parse
    
    	//var place = 'France/Midi-Pyrénées/Rodez~2983154';
       	//place = 'United_Kingdom/England/London';
        //place = 'France/Rhône-Alpes/Val_d\'Isère~2971074';
        //place = 'Norway/Sogn_og_Fjordane/Vik/Målset';
        //place = 'United_States/California/San_Francisco';
        //place = 'United_States/Minnesota/Minneapolis';
       // location.hash = 'http://www.yr.no/place/' + place + '/forecast.xml';
        console.log(location.hash + ' 1');
        location.hash = 'http://www.yr.no/place/' + place + '/forecast.xml';
    
console.log(location.hash.substr(1) + ' 2');
    // Then get the XML file through Highcharts' jsonp provider, see
    // https://github.com/highslide-software/highcharts.com/blob/master/samples/data/jsonp.php
    // for source code.
    $.getJSON(
        'https://www.highcharts.com/samples/data/jsonp.php?url=' + location.hash.substr(1) + '&callback=?',
        function (xml) {
            window.meteogram = new Meteogram(xml, 'container');
            console.log(xml);
            console.log(location.hash + ' 3');
        }
    );
   // https://www.highcharts.com/samples/data/jsonp.php?url=' + location.hash.substr(1) + '&callback=?'
   //https://www.highcharts.com/samples/data/jsonp.php?url=' + 'http://www.yr.no/place/France/Midi-Pyrénées/Rodez~2983154/forecast.xml' + '&callback=?'

   

});
//----------------------------FIN METEOGRAMME---------------------------------------


//----------------------------JAUGE TEMPERATURE--------------------------------------
$(function () {

		
	    var gaugeOptions = {
	        chart: {
	        	backgroundColor: 'rgba(255,255,255,0.002)',
	            type: 'solidgauge'   
	        },
	        title: null,
	        pane: {
	           center: ["50%", "70%"],
	            size: '100%',
	            startAngle: -90,
	            endAngle: 90,
	            background: {
	                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#000',
	                innerRadius: '%',
	                outerRadius: '0%',
	                shape: 'arc'
	            }
	        },
	        tooltip: {
	            enabled: false
	        },
	        xAxis:{
	        	labels:{
	        		style: '#FFFFFF'
	        	}
	        },
	        yAxis: {   
	            stops: [
	                [0, '#3366FF'],
	                [0.55, '#3366FF'],
	                [1, '#FF3300'] // red
	            ],
	            lineWidth: 0	,
	            minorTickInterval: null,
	            tickPixelInterval: 55,
	            tickWidth: 1,
	            title: {
	                y: -50
	            },
	            labels: {
	            	style:{color: 'black'},
	                y: 0,
	            }
	        },

	        plotOptions: {
	            solidgauge: {
	                dataLabels: {
	                    
	                    y: 20,
	                    borderWidth: 0,
	                    useHTML: true
	                }
	            }
	        }   
	    };
	    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
	            yAxis: {
	                min: -40,
	                max: 40,
	                radius: 38,
	                    innerRadius: 1110,  
	            },
	            credits: {
	                enabled: false
	            },
	            series: [{
	                name: 'Speed',
	                data: [<!--outsideTemp-->],
	                dataLabels: {
	                    format: '<div style="width:40px; text-align:center"><span style="font-size:17px;color:' +
	                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
	                           '<span style="font-size:12px;color:black">°C</span></div>'
	                },
	                radius: 100,
	                innerRadius: 65,
	                tooltip: {
	                    valueSuffix: ' °C'
	                }

	         }]
	    }));
	    var optionPrec = {
	        chart: {
	            backgroundColor: 'rgba(255,255,255,0.002)',
	            type: 'column',
                options3d:{
                    enabled: true,
                    alpha: 10,
                    beta: 25,
                    depth: 70
                }  
	        },
	        credits: {
	                enabled: false
	        },
	        title: {
	            text: null,

	        },
	        xAxis: {
	            lineColor: 'black',
	            categories: [   
	                'PRECIPITATIONS' 
	            ],
	            tickLength: 0
	        },
	        
	        yAxis: {
                minorGridLineDashStyle: 'longdash',
                minorTickInterval: 'auto',
                minorTickWidth: 1,
	            gridLineColor: 'silver',
	            labels: {
	                style: {
	                    color: 'black'
	                }
	            },
	            min: 0,
	            title: {
	                style:{color:'black'},
	                text: null,
	                margin: 100,
	                rotation: 0     
	            }
	        },
	        plotOptions: {
	            series:{
	                shadow:true,
	                borderColor: '#303030'
	            },
	            column: {
	                pointWidth: 25,
                    depth: 25
	            }
	        },
	        series: [{
	            showInLegend: false,
	            data: [<!--dailyRain-->]
	        }]
	    };
	    
	    
	    $('#container-press').highcharts({
	    		chart:{
	    			backgroundColor: 'rgba(255,255,255,0.002)',
	    			type:'column'
	    		},
	    		credits: {
	                enabled: false
	            },
		        title: {
		            text: null,
		        },
		        xAxis: {
		            lineColor: 'silver',
		            categories: [   
		                'BAROMETRE' 
		            	],
		            tickLength: 0
		        },
		        yAxis: {
		        	minorGridLineDashStyle: 'longdash',
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
		            gridLineColor: 'silver',
			            title: {
			                text: null
			            }
	        	},
	        	plotOptions:{
	        		series:{
	                shadow:true,
	                borderColor: '#303030'
	            },
			        		column: {
		                	pointWidth: 25,
		                	color:'#009688'
		            		}
		        		},
		        tooltip: {
		            valueSuffix: 'hPa'
		        },
		        series: [{
		        	showInLegend: false,
		            name: 'pression',
		            data: [<!--barometer-->]
		        }]
		    });

    	    $('#container-vent').highcharts({
    	    	chart: {
    	    	backgroundColor: 'rgba(255,255,255,0.002)',
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            credits: {
    	                enabled: false
    	    },
            title: {
                verticalAlign: 'bottom',
                y: -80,
                text: null
            },
            
            pane: {
                startAngle: 0,
                endAngle: 360,
                
            },
            xAxis: {
                 gridLineColor: 'black'
            },
            // the value axis
            yAxis: {
                min: 0,
                max: 360,
                tickWidth: 1,
                tickPosition: 'outside',
                tickLength: 10,
                tickColor: '#999',
                tickInterval:22.5,
                minorTickInterval:null,
                labels: {
                	style:{
                		color:'black',
                		fontSize: 8
                	},
                    rotation: 'auto',
                    formatter:function(){
                        if(this.value == 360) { return 'N'; }
                        else if(this.value == 22.5) { return 'NNE'; }
                        else if(this.value == 45) { return 'NE'; }
                        else if(this.value == 67.5) { return 'ENE'; }
                        else if(this.value == 90) { return 'E'; }
                        else if(this.value == 112.5) { return 'ESE'; }
                        else if(this.value == 135) { return 'SE'; }
                       	else if(this.value == 157.5) { return 'SSE'; }
                        else if(this.value == 180) { return 'S'; }
                        else if(this.value == 202.5) { return 'SSO'; }
                        else if(this.value == 225) { return 'SO'; }
                       	else if(this.value == 247.5) { return 'OSO'; } 
                        else if(this.value == 270) { return 'O'; }
                        else if(this.value == 292.5) { return 'ONO'; }
                        else if(this.value == 315) { return 'NO'; }
                        else if(this.value == 337.5) { return 'NNO'; }
                    }
                },
                title: {
                	style:{
                		fontSize: 8
                	},
                    text: 'Wind direction'
                }
            },
            series: [{
                name: 'Vitesse',
                data: [<!--windSpeed-->],
                visible: false,
                zIndex: 1
            },
            {
                name: 'Compass',
                data: [<!--windDirectionDegrees-->]
            }
            ]
        
        });

	    	

	    $('#container-prec').highcharts(optionPrec);
	});




    setInterval(function () {
       
        $.ajax({
                dataType: "json",
                url: "WVtags.php",
                error: function(){alert('c\'est la merde');},
                success: function(data){

                    var chart = $('#container-speed').highcharts();
                    var chartPression = $('#container-press').highcharts();
                    console.log(chartPression);
                    var chartPrec = $('#container-prec').highcharts();
                    var chartVent = $('#container-vent').highcharts();
                    var newvalPress;    
                    var newVal;
                    var newvalPrec;
                    var newvalVent
            console.log('avant if');

                if (chart || chartPrec) {

                    newvalPress = data.barometer;
                    newval = data.outsideTemp;
                    newvalPrec = data.dailyRain;
                    newvalVent = data.windDirection;
                    console.log(newvalPrec + ' ' + newval + ' ' + newvalPress);
                    
                    chartVent.series[0].data[0].update(newvalVent);
                    chartPression.series[0].data[0].update(newvalPress);
                    chartPrec.series[0].data[0].update(newvalPrec);
                    chart.series[0].data[0].update(newval);
                    
                    
                }
            }
        });   
    }, 2000); 




//----------------------------FIN JAUGE TEMPERATURE--------------------------------------

//----------------------------DEBUT JAUGE PRECIP--------------------------------------
/*$(function () {

    var optionPrec = {
    chart: {
            backgroundColor: 'rgba(255,255,255,0.002)',
            type: 'column',  
        },
        credits: null,
        
        title: {
            text: null,

        },
        xAxis: {
            lineColor: 'black',
            categories: [
                'pluie'
                
            ],
            crosshair: true
        },
        
        yAxis: {
            minorGridLineColor: 'silver',
            minorTickInterval: 'auto',
            gridLineColor: 'black',
            labels: {
                style: {
                    color: 'black'
                }
            },
            min: 0,
            title: {
                style:{color:'black'},
                text: null,
                margin: 100,
                rotation: 0,
               
            }
        },
        
        plotOptions: {
            series:{
                
                shadow:true,
                borderColor: '#303030'
            },
            column: {
             
                pointWidth: 25
            }
            
        },
        series: [{
            showInLegend: false,
            data: [<!--dailyRain-->]
        }]
    };

    $('#container-prec').highcharts(optionPrec);
    

console.log('hey');

setInterval(function () {
       
        $.ajax({
                dataType: "json",
                url: "WVtags.php",
                error: function(){alert('c\'est la merde');},
                success: function(data){


                    var chartPrec = $('#container-prec').highcharts(),
                        newvalPrec;
            
            
                
            
                    newvalPrec = data.dailyRain;
                    console.log(data.dailyRain + ' ' + newvalPrec);
                    chartPrec.series[0].data[0].update(newvalPrec);
            
                
            }

         }); 
        
    }, 2000);
 
});*/
//--------------------------------FIN JAUGE PRECIP--------------------------------------

//---------------------------------DEBUT JAUGE PRESSION----------------------------------------









