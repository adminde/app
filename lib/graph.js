var graph = { 

	init: function() {
			
		// -------------------------------------------------------------------------------
		// EVENTS
		// -------------------------------------------------------------------------------
		// The buttons for these powergraph events are hidden when in historic mode 
		// The events are loaded at the start here and dont need to be unbinded and binded again.
		$("#zoomout").click(function () {view.zoomout(); loadPowerGraph(); });
		$("#zoomin").click(function () {view.zoomin(); loadPowerGraph(); });
		$('#right').click(function () {view.panright(); loadPowerGraph(); });
		$('#left').click(function () {view.panleft(); loadPowerGraph(); });

		$('.time').click(function () {
		    view.timewindow($(this).attr("time")/24.0);
		    graph.loadPowerGraph();
		});

		$(".viewhistory").click(function () {
		    $(".powergraph-navigation").hide();
		    var timeWindow = (3600000*24.0*30);
		    view.end = (new Date()).getTime();
		    view.start = view.end - timeWindow;
		    viewMode = "bargraph";
		    graph.loadEnergyGraph();
		    $(".bargraph-navigation").show();
		});

		$("#advanced-toggle").click(function () { 
		    var mode = $(this).html();
		    if (mode=="SHOW DETAIL") {
		        $("#advanced-block").show();
		        $(this).html("HIDE DETAIL");
		        
		    } else {
		        $("#advanced-block").hide();
		        $(this).html("SHOW DETAIL");
		    }
		});

		$('#placeholder').bind("plothover", function (event, pos, item) {
		    if (item) {
		        if (previousPoint != item.datapoint) {
		            previousPoint = item.datapoint;

		            $("#tooltip").remove();
		            var itemTime = item.datapoint[0];
		            var consEnergy = data.get("use_kwh").getDailyEnergy(itemTime);
		            if (consEnergy) {
		                var d = new Date(itemTime);
		                var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		                var date = days[d.getDay()]+", "+months[d.getMonth()]+" "+d.getDate();
		                
		                var text = "";
		                if (viewUnit == "energy") {
		                    text = date+"<br>"+(consEnergy).toFixed(1)+" kWh";
		                } else {
		                    text = date+"<br>"+(consEnergy).toFixed(1)+" kWh ("+config.app.currency.value+(consEnergy*config.app.unitcost.value).toFixed(2)+")";
		                }
		                
		                tooltip(item.pageX, item.pageY, text, "#fff");
		            }
		        }
		    }
		    else {
		        $("#tooltip").remove();
		    }
		});

		// Auto click through to power graph
		$('#placeholder').bind("plotclick", function (event, pos, item) {
		    if (item && !panning && viewMode == "bargraph") {
		        view.start = item.datapoint[0];
		        view.end = view.start + 86400000;
		        $(".bargraph-navigation").hide();
		        
		        viewMode = "powergraph";
		        graph.loadPowerGraph();
		        $(".powergraph-navigation").show();
		    }
		});

		$('#placeholder').bind("plotselected", function (event, ranges) {
		    view.start = ranges.xaxis.from;
		    view.end = ranges.xaxis.to;
		    panning = true; 

		    if (viewMode == "bargraph") {
		    	graph.loadEnergyGraph();
		    }
		    else {
		    	graph.loadPowerGraph();
		    }
		    setTimeout(function() { panning = false; }, 100);
		});

		$('.bargraph-week').click(function () {
		    var timeWindow = (3600000*24.0*7);
		    view.end = (new Date()).getTime();
		    view.start = view.end - timeWindow;
		    periodText = "week";

		    graph.loadEnergyGraph();
		    graph.loadTimeOfUse();
		});

		$('.bargraph-month').click(function () {
		    var timeWindow = (3600000*24.0*30);
		    view.end = (new Date()).getTime();
		    view.start = view.end - timeWindow;
		    periodText = "month";
		    
		    graph.loadEnergyGraph();
		    graph.loadTimeOfUse();
		});

		$('.bargraph-alltime').click(function () {
		    view.start = data.get("use_kwh").getEarliestTime();
		    view.end = (new Date()).getTime();
		    periodText = "period";
		    
		    graph.loadEnergyGraph();
		    graph.loadTimeOfUse();
		});

		$("#heating").click(function() {
		    comparisonHeating = 0;
		    if ($(this)[0].checked) comparisonHeating = 1;
		    graph.drawEnergyStacks();
		});

		$("#transport").click(function() {
		    comparisonTransport = 0;
		    if ($(this)[0].checked) comparisonTransport = 1;
		    graph.drawEnergyStacks();
		});

		$(".view-unit").click(function() {
		    var view = $(this).html();
		    if (view == "VIEW COST") {
		        $(this).html("VIEW ENERGY");
		        viewUnit = "cost";
		    } else {
		        $(this).html("VIEW COST");
		        viewUnit = "energy";
		    }
		    
		    $(".powergraph-navigation").hide();
		    viewMode = "bargraph";
		    $(".bargraph-navigation").show();
		    show();
		});
		
		$(window).resize(function() {
		    var widthWindow = $(this).width();
		    
		    flotFontSize = 12;
		    if (widthWindow < 450) flotFontSize = 10;
		    
		    resize(); 
		    
		    if (viewMode == "bargraph") {
		    	graph.drawEnergyGraph();
		    }
		    else {
		    	graph.drawPowerGraph();
		    }
		});
	},

	// -------------------------------------------------------------------------------
	// FUNCTIONS
	// -------------------------------------------------------------------------------
	// - loadPowerGraph
	// - drawPowerValues
	// - drawPowerGraph
	// - loadEnergyGraph
	// - drawEnergyValues
	// - drawEnergyGraph

	loadPowerGraph: function () {
	    $("#power-graph-footer").show();
	    var start = view.start;
	    var end = view.end;
	    var interval = view.round_interval(((end - start)*0.001)/data.datapointsLimit);
	    var intervalMillis = interval*1000;
	    start = Math.ceil(start/intervalMillis)*intervalMillis;
	    end = Math.ceil(end/intervalMillis)*intervalMillis;

	    data.loadPower(start, end, interval, function(result) {
	    	graph.drawPowerGraph();
	    });
	},

	drawPowerValues: function () {
	    var consPower = data.get("use");
	    var value = consPower.getLatestValue();
	    
	    // set the power now value
	    if (viewUnit == "energy") {
	        if (value < 10000) {
	            $("#power-now").html(Math.round(value)+"<span class='units'>W</span>");
	        }
	        else {
	            $("#power-now").html((value*0.001).toFixed(1)+"<span class='units'>kW</span>");
	        }
	    } else {
	        // 1000W for an hour (x3600) = 3600000 Joules / 3600,000 = 1.0 kWh x 0.15p = 0.15p/kWh (scaling factor is x3600 / 3600,000 = 0.001)
	        var costNow = value*1*config.app.unitcost.value*0.001;
	        
	        if (costNow < 1.0) {
	            $("#power-now").html(config.app.currency.value+costNow.toFixed(3)+"<span class='units'>/hr</span>");
	        }
	        else {
	            $("#power-now").html(config.app.currency.value+costNow.toFixed(2)+"<span class='units'>/hr</span>");
	        }
	    }
	},

	drawPowerGraph: function () {
	    var interval = view.round_interval(((view.end - view.start)*0.001)/data.datapointsLimit)*1000;
	    var start = Math.ceil(view.start/interval)*interval;
	    var end = Math.ceil(view.end/interval)*interval;
	    
	    var windowPower = [];
	    var windowEnergy = 0.0;
	    for (var timevalue of data.iteratePower(start, end, interval)) {
	        var time = timevalue.time;
	        
	        var power = timevalue['use'];
	        if (power != null) {
	            if (windowPower.length > 0) {
	                var timeDelta = (time - windowPower[windowPower.length-1][0])*0.001;
	                if (timeDelta < 3600) {
	                    windowEnergy += (power*timeDelta)/3600000;
	                }
	            }
	            windowPower.push([time, power]);
	        }
	    }
	    
	    var options = {
	        lines: {
	            fill: false
	        },
	        xaxis: { 
	            mode: "time",
	            timezone: "browser", 
	            min: view.start,
	            max: view.end, 
	            font: {
	                size: flotFontSize,
	                color: "#666"
	            },
	            reserveSpace: false
	        },
	        yaxes: [
	            {min: 0, font: {size: flotFontSize, color: "#666"}, reserveSpace: false},
	            {font: {size: flotFontSize, color: "#666"}, reserveSpace: false}
	        ],
	        grid: {
	            show: true, 
	            color: "#aaa",
	            borderWidth: 0,
	            hoverable: true, 
	            clickable: true,
	            // labelMargin:0,
	            // axisMargin:0
	            margin: {top: 30}
	        },
	        selection: {mode: "x"},
	        legend: {position: "NW", noColumns: 4}
	    }

	    series = [];
	    series.push({data:windowPower, yaxis:1, color:"#44b3e2", lines:{show:true, fill:0.8, lineWidth:0}});
	    
	    var plot = $.plot($('#placeholder'), series, options);
	    
	    var windowStats = {};
	    windowStats["use"] = stats(windowPower);
	    
	    var windowStatsOut = "";
	    for (var z in windowStats) {
	        windowStatsOut += "<tr>";
	        windowStatsOut += "<td style='text-align:left'>"+z+"</td>";
	        windowStatsOut += "<td style='text-align:center'>"+windowStats[z].minval.toFixed(2)+"</td>";
	        windowStatsOut += "<td style='text-align:center'>"+windowStats[z].maxval.toFixed(2)+"</td>";
	        windowStatsOut += "<td style='text-align:center'>"+windowStats[z].diff.toFixed(2)+"</td>";
	        windowStatsOut += "<td style='text-align:center'>"+windowStats[z].mean.toFixed(2)+"</td>";
	        windowStatsOut += "<td style='text-align:center'>"+windowStats[z].stdev.toFixed(2)+"</td>";
	        windowStatsOut += "</tr>";
	    }
	    $("#stats").html(windowStatsOut);
	    
	    if (viewUnit == "energy") {
	        $("#window-kwh").html(windowEnergy.toFixed(1)+ "kWh");
	        $("#window-cost").html("");
	    } else {
	        $("#window-kwh").html(windowEnergy.toFixed(1)+ "kWh");
	        $("#window-cost").html("("+config.app.currency.value+(windowEnergy*config.app.unitcost.value).toFixed(2)+")");
	    }
	},

	loadEnergyGraph: function () {   
	    $("#power-graph-footer").hide();
	    $("#advanced-toggle").html("SHOW DETAIL");
	    $("#advanced-block").hide();
	    
	    var interval = 3600*24;
	    var intervalMillis = interval * 1000;
	    var end = Math.ceil(view.end/intervalMillis)*intervalMillis;
	    var start = Math.floor(view.start/intervalMillis)*intervalMillis;
	    
	    data.loadDailyEnergy(start, end, function(result) {
	        graph.drawEnergyGraph();
	        graph.drawEnergyStacks();
	    });
	},

	drawEnergyValues: function () {
	    var consEnergy = data.get("use_kwh");
	    var latestValue = consEnergy.getLatestValue();
	    
	    var now = new Date();
	    now.setHours(0,0,0,0);
	    var todayTime = now.getTime();

	    var todayEnergy = consEnergy.getDailyEnergy(todayTime);
	    if (todayEnergy == null) {
	        var latestValue = consEnergy.getLatestValue();
	        var todayValue = consEnergy.getTimevalue(todayTime);
	        
	        if (todayValue == null || todayValue[1] == null) {
	            todayValue = [
	                consEnergy.getEarliestTime(),
	                consEnergy.getEarliestValue()
	            ];
	        }
	        todayEnergy = latestValue - todayValue[1];
	    }
	    
	    if (viewUnit == "energy") {
	        $("#energy-today").html(todayEnergy.toFixed(1)+"<span class='units'>kWh</span>");
	    }
	    else {
	        $("#energy-today").html(config.app.currency.value+(todayEnergy*config.app.unitcost.value).toFixed(2));
	    }
	},

	drawEnergyGraph: function () {
	    var end = new Date(view.end);
	    end.setHours(0,0,0,0);
	    end = end.getTime();
	    var start = new Date(view.start);
	    start.setHours(0,0,0,0);
	    start = start.getTime();

	    var periodEnergy = 0;
	    var dailyEnergy = [];
	    for (var day of data.iterateDailyEnergy(start, end)) {
	        var time = day.time;
	        
	        var value = day['use_kwh'];
	        // Trim days with zero energy consumption
	        if (value > 0 || dailyEnergy.length > 0) {
	        	periodEnergy += value;
	            dailyEnergy.push([time, value]);
	        }
	    }
	    periodAverage = periodEnergy/dailyEnergy.length;
	    
	    var options = {
	        xaxis: { 
	            mode: "time", 
	            timezone: "browser", 
	            font: {size: flotFontSize, color: "#666"}, 
	            // labelHeight: -5
	            reserveSpace: false
	        },
	        yaxis: { 
	            font: {size: flotFontSize, color: "#666"}, 
	            // labelWidth: -5
	            reserveSpace: false,
	            min: 0
	        },
	        selection: { mode: "x" },
	        grid: {
	            show: true, 
	            color: "#aaa",
	            borderWidth: 0,
	            hoverable: true, 
	            clickable: true
	        }
	    }
	    
	    series = [];
	    series.push({
	        data: dailyEnergy, color: "#44b3e2",
	        bars: { show: true, align: "center", barWidth: 0.75*3600*24*1000, fill: 1.0, lineWidth: 0}
	    });
	    
	    var plot = $.plot($('#placeholder'), series, options);
	    $('#placeholder').append("<div id='bargraph-label' style='position:absolute; left:50px; top:30px; color:#666; font-size:12px'></div>");
	},

	drawEnergyStacks: function () {
	    var c = document.getElementById("energystack");  
	    var ctx = c.getContext("2d");
	    ctx.clearRect(0, 0 ,270, 360);
	    
	    var maxval = 9.0;
	    if (periodAverage > maxval) maxval = periodAverage;
	    
	    var options = {
	        fill: "rgba(6,153,250,1.0)",
	        stroke: "rgba(6,153,250,0.5)",
	        maxval: maxval,
	        height: 350
	    };
	    
	    var x = 0;
	    if (!comparisonHeating && !comparisonTransport) {
	    	graph.stack(ctx,[["UK Average", (9.0).toFixed(1)]], x, options); x+=90;
	    	graph.stack(ctx,[["ZCB Target", 4.5]], x, options); x+=90;
	    	graph.stack(ctx,[["Consumption", periodAverage.toFixed(1)]], x, options); 
	    }
	    else {
	        var d1 = [];
	        d1.push(["Electric", (9.0).toFixed(1)]);
	        if (comparisonHeating) d1.push(["Heating", (41.0).toFixed(1)]);
	        if (comparisonTransport) d1.push(["Transport", (41.0).toFixed(1)]);
	        var v=0; for (var z in d1) v += 1*d1[z][1];
	        options.maxval = v;
	        graph.stack(ctx, d1, x, options); x+=90;

	        var d2 = [];
	        d2.push(["Electric", 4.5]);
	        if (comparisonHeating) d2.push(["Heatpump", (7.1).toFixed(1)]);
	        if (comparisonTransport) d2.push(["EV", (6.1).toFixed(1)]);
	        graph.stack(ctx, d2, x, options); x+=90;
	        
	        var d3 = [];
	        d3.push(["My Electric", periodAverage.toFixed(1)]);
	        graph.stack(ctx, d3, x, options); x+=90;
	    }
	    
	    if (periodAverage < 9.0) $("#comparison_summary").html("You used <b>"+Math.round((1.0-(periodAverage/9.0))*100)+"%</b> less than the UK average this "+periodText);
	    if (periodAverage > 9.0) $("#comparison_summary").html("You used <b>"+Math.round(((periodAverage/9.0)-1.0)*100)+"%</b> more than the UK average this "+periodText);
	},

	loadTimeOfUse: function () {
	  /*
	  $.ajax({                                      
	      url: path+"household/data?id="+feeds["use"].id,
	      dataType: 'json',                  
	      success: function(result) {
	          console.log("here...");
	          var prc = Math.round(100*((result.overnightkwh + result.middaykwh) / result.totalkwh));
	          $("#prclocal").html(prc);
	          
	          if (prc>20) $("#star1").attr("src",path+"files/star.png");
	          if (prc>40) setTimeout(function() { $("#star2").attr("src",path+"files/star.png"); }, 100);
	          if (prc>60) setTimeout(function() { $("#star3").attr("src",path+"files/star.png"); }, 200);
	          if (prc>80) setTimeout(function() { $("#star4").attr("src",path+"files/star.png"); }, 300);
	          if (prc>90) setTimeout(function() { $("#star5").attr("src",path+"files/star.png"); }, 400);
	          
	          var data = [
	            {name:"AM PEAK", value: result.morningkwh, color:"rgba(68,179,226,0.8)"},
	            {name:"DAYTIME", value: result.middaykwh, color:"rgba(68,179,226,0.6)"},
	            {name:"PM PEAK", value: result.eveningkwh, color:"rgba(68,179,226,0.9)"},
	            {name:"NIGHT", value: result.overnightkwh, color:"rgba(68,179,226,0.4)"},
	            // {name:"HYDRO", value: 2.0, color:"rgba(255,255,255,0.2)"}   
	          ];
	          
	          var options = {
	            "color": "#333",
	            "centertext": "THIS "+periodText.toUpperCase()
	          }; 
	          
	          piegraph("piegraph",data,options);
	      } 
	  });*/
	},

	stack: function (ctx,data,xoffset,options) {
	    options.scale = options.height / options.maxval;

	    var y = options.height-1;
	    ctx.textAlign = "center";
	    ctx.font = "normal 12px arial"; 
	    for (z in data) {
	        var seg = data[z][1]*options.scale;
	        y -= (seg);
	        ctx.strokeStyle = options.fill;
	        ctx.fillStyle = options.stroke;
	        ctx.fillRect(1+xoffset, y+4, 80, seg-4);
	        ctx.strokeRect(1+xoffset, y+4, 80, seg-4);
	        ctx.fillStyle = "#fff";
	        ctx.font = "bold 12px arial"; 
	        ctx.fillText(data[z][0], xoffset+40, y+(seg/2)+0);
	        ctx.font = "normal 12px arial"; 
	        ctx.fillText(data[z][1]+" kWh", xoffset+40, y+(seg/2)+12);
	    }
	},
}