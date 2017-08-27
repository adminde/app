<?php
    global $path, $session;
    $v = 6;
?>

<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/dark.css?v=<?php echo $v; ?>" rel="stylesheet">

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/feed.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/data.js?v=<?php echo $v; ?>"></script>

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/graph_energy.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/graph_power.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/vis.helper.js?v=<?php echo $v; ?>"></script> 

<div id="app-block" style="display:none">
    <div class="col1"><div class="col1-inner">
        <div style="height:20px; border-bottom:1px solid #333; padding-bottom:8px;">
            
            <div style="float:left; color:#aaa">
                <span id="unit-select-cost" style="cursor:pointer">Cost</span> | 
                <span id="unit-select-kwh" style="cursor:pointer"><b>kWh</b></span>
            </div>
            
            <div style="float:right;">
                <i class="openconfig icon-wrench icon-white" style="cursor:pointer; padding-right:5px"></i>
            </div>
        </div>
        
        <table style="width:100%">
            <tr>
                <td style="border:0; width:50%">
                    <div class="electric-title">POWER NOW</div>
                    <div class="power-value"><span id="powernow">0</span></div>
                </td>
                <td style="text-align:right; border:0;">
                    <div class="electric-title">TODAY</div>
                    <div class="power-value"><span id="constoday_units_a"></span><span id="constoday">0</span><span id="constoday_units_b" style="font-size:16px"> kWh</span></div>
                </td>
            </tr>
        </table>
        <br>
        
        <div class="visnavblock" style="height:28px; padding-bottom:5px;">
            <span class='visnav time-select' time='3'>3h</span>
            <span class='visnav time-select' time='6'>6h</span>
            <span class='visnav time-select' time='24'>D</span>
            <span class='visnav time-select' time='168'>W</span>
            <span class='visnav time-select' time='720'>M</span>
            <span id='zoomin' class='visnav' >+</span>
            <span id='zoomout' class='visnav' >-</span>
            <span id='left' class='visnav' ><</span>
            <span id='right' class='visnav' >></span>
        </div>
        <br>
        
        <div id="placeholder_bound_power" style="width:100%; height:220px;">
            <canvas id="placeholder_power"></canvas>
        </div>
        <br>
        
        <div id="placeholder_bound_kwhd" style="width:100%; height:250px;">
            <canvas id="placeholder_kwhd"></canvas>
        </div>
        <br>
        
        <table style="width:100%">
            <tr>
                <td class="appbox">
                    <div class="appbox-title">WEEK</div>
                    <div><span class="appbox-value u1a" style="color:#0699fa">£</span><span class="appbox-value" id="week_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1">kWh</span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="week_kwhd">---</span><span class="units u2b"> kWh/d</span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title">MONTH</div>
                    <div><span class="appbox-value u1a" style="color:#0699fa">£</span><span class="appbox-value" id="month_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1">kWh</span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="month_kwhd">---</span><span class="units u2b"> kWh/d</span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title">YEAR</div>
                    <div><span class="appbox-value u1a" style="color:#0699fa">£</span><span class="appbox-value" id="year_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1">kWh</span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="year_kwhd">---</span><span class="units u2b"> kWh/d</span></div>
                </td>
                
                <td class="appbox">
                    <div class="appbox-title">ALL</div>
                    <div><span class="appbox-value u1a" style="color:#0699fa">£</span><span class="appbox-value" id="alltime_kwh" style="color:#0699fa">---</span> <span class="units appbox-units u1b" style="color:#0779c1">kWh</span></div>
                    
                    <div style="padding-top:5px; color:#0779c1" class="appbox-units" ><span class="units u2a"></span><span id="alltime_kwhd">---</span><span class="units u2b"> kWh/d</span></div>
                </td>
            </tr>
        </table>
    </div></div>
</div>

<div id="app-setup" style="display:none; padding-top:50px" class="block">
    <h2 class="appconfig-title">Energy Consumption</h2>
    
    <div class="appconfig-description">
      <div class="appconfig-description-inner">
        Household energy consumption in real time power and daily resolution, shown in kWh or money spent.
        <br><br>
        <b>Auto configure:</b> This app can auto-configure connecting to emoncms feeds with the names shown on the right, alternatively feeds can be selected by clicking on the edit button.
        <br><br>
        <b>Cumulative kWh</b> feeds can be generated from power feeds with the power_to_kwh input processor.
        <br><br>
        <img src="../Modules/app/images/myelectric_app.png" style="width:600px" class="img-rounded">
        
      </div>
    </div>
    <div class="app-config"></div>
</div>

<div class="ajax-loader"><img src="<?php echo $path; ?>Modules/app/images/ajax-loader.gif"/></div>


<script>

// ----------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------
var path = "<?php print $path; ?>";
var apiKey = "<?php print $apikey; ?>";
var sessionWrite = <?php echo $session['write']; ?>;

var feed = new Feed(apiKey);

// ----------------------------------------------------------------------
// Display
// ----------------------------------------------------------------------
$("body").css('background-color', '#222');
$(window).ready(function() {
    $("#footer").css('background-color', '#181818');
    $("#footer").css('color', '#999');
});
if (!sessionWrite) $(".openconfig").hide();

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------
config.app = {
    "cons_power": {
        "type": "feed",
        "class": "power",
        "autoname": "cons_power",
        "engine": "2,5,6",
        "description": "House or building consumption in watts"
    },
    "cons_energy": {
        "type": "feed",
        "class": "energy",
        "autoname": "cons_energy",
        "engine": "2,5,6",
        "description": "Cumulative consumption in kWh"
    },
    "unitcost": {
        "type": "value",
        "default": 0.1508,
        "name":  "Unit cost",
        "description": "Unit cost of electricity £/kWh"
    },
    "currency": {
        "type": "value",
        "default": "£",
        "name":  "Currency",
        "description": "Currency symbol (£,$..)"
    }
};

config.name = "<?php echo $name; ?>";
config.db = <?php echo json_encode($config); ?>;
config.feeds = feed.getList();

config.initapp = function() {
    init();
};
config.showapp = function() {
    show();
};
config.hideapp = function() {
    hide();
};

// ----------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------
var viewMode = "energy";

var lastPowerTime = 0;
var lastEnergyTime = 0;

var lastUpdate = 0; 
var autoUpdate = true;
var reload = true;
var redraw = true;

var updateTimer = false;

config.init();

function init() {
    var timewindow = (3600000*3.0*1);
    view.end = new Date();
    view.start = view.end - timewindow;

    // -------------------------------------------------------------------------
    // Initialize power and energy data
    // -------------------------------------------------------------------------
    data.init(feed, config);
    
    // -------------------------------------------------------------------------
    // Decleration of mycons events
    // -------------------------------------------------------------------------
    $("#zoomout").click(function () {view.zoomout(); reload = true; autoUpdate = false; update();});
    $("#zoomin").click(function () {view.zoomin(); reload = true; autoUpdate = false; update();});
    $('#right').click(function () {view.panright(); reload = true; autoUpdate = false; update();});
    $('#left').click(function () {view.panleft(); reload = true; autoUpdate = false; update();});
    
    $('.time-select').click(function () {
        view.timewindow($(this).attr("time")/24.0); 
        reload = true; 
        autoUpdate = true;
        update();
    });
    
    $("#unit-select-cost").click(function(){
        $("#unit-select-cost").html('<b>Cost</b>');
        $("#unit-select-kwh").html('kWh');
        viewMode = "cost";
        redraw = true;
        update();
    });
    
    $("#unit-select-kwh").click(function(){
        $("#unit-select-cost").html('Cost');
        $("#unit-select-kwh").html('<b>kWh</b>');
        viewMode = "energy";
        redraw = true;
        update();
    });
}

function show() {
    /*
    $(".navbar-inner").css('background-image','none');
    $(".navbar-inner").css('background-color','#44b3e2');
    $(".nav li a").css('color','#fff');
    $(".nav li a").css('text-shadow','none');
    $(".caret").css('border-top-color','#fff');
    $(".caret").css('border-bottom-color','#fff');
    */
    
    // start of all time
    var meta = feed.getMeta(config.app.cons_energy.value);
    startalltime = meta.start_time;
    view.first_data = meta.start_time * 1000;
    
    // resize and start updaters
    resize();
    updateTimer = setInterval(update, 5000);
}

function resize() {
    var windowheight = $(window).height();
    
    var width = $("#placeholder_bound_kwhd").width();
    $("#placeholder_kwhd").attr('width',width);
    energyGraph.width = width;
    
    var height = $("#placeholder_bound_kwhd").height();
    $("#placeholder_kwhd").attr('height',height); 
    energyGraph.height = height;
    
    var width = $("#placeholder_bound_power").width();
    $("#placeholder_power").attr('width',width);
    powerGraph.width = width;
    
    var height = $("#placeholder_bound_power").height();
    $("#placeholder_power").attr('height',height); 
    powerGraph.height = height;
    
    if (width <= 500) {
        $(".electric-title").css("font-size", "16px");
        $(".power-value").css("font-size", "38px");
        $(".units").hide();
        $(".visnav").css("padding-left", "5px");
        $(".visnav").css("padding-right", "5px");
    }
    else if (width <= 724) {
        $(".electric-title").css("font-size", "18px");
        $(".power-value").css("font-size", "52px");
        $(".units").show();
        $(".visnav").css("padding-left", "8px");
        $(".visnav").css("padding-right", "8px");
    }
    else {
        $(".electric-title").css("font-size", "22px");
        $(".power-value").css("font-size", "85px");
        $(".units").show();
        $(".visnav").css("padding-left", "8px");
        $(".visnav").css("padding-right", "8px");
    }

    $(".ajax-loader").show();
    redraw = true;
    update();
}
    
function hide() {
    clearInterval(updateTimer);
}
    
function update() {
    var now = new Date();
    
    // --------------------------------------------------------------------------------------------------------
    // REALTIME POWER GRAPH
    // -------------------------------------------------------------------------------------------------------- 
    // Check if the updater ran in the last 60s
    // if the app was sleeping, the data needs a full reload.
    if ((now.getTime() - lastUpdate) >= 60000) {
        var timeWindow = view.end - view.start;
        view.end = now.getTime();
        view.start = view.end - timeWindow;

        reload = true;
    }
    lastUpdate = now.getTime();

    data.update(function(result) {
        // --------------------------------------------------------------------------------------------------------
        // Draw latest power value and this week, month, year and total energy values
        // --------------------------------------------------------------------------------------------------------
        var powerTime = result.getLatestTime("cons_power");
        if (redraw || (powerTime - lastPowerTime) >= interval) {
            lastPowerTime = powerTime;
            
            drawPowerValues(result);
            if (!reload) {
                drawPowerGraph(result);
            }
        }

        var energyTime = result.getLatestTime("cons_energy");
        if (redraw || (energyTime - lastEnergyTime) >= interval) {
            lastEnergyTime = energyTime;

            drawEnergyValues(result);
            if (!reload) {
                drawEnergyGraph(result);
            }
        }
        
        // --------------------------------------------------------------------------------------------------------
        // Draw the power and energy graph
        // --------------------------------------------------------------------------------------------------------
        if (reload) {
            // Disable automatic value appending
            autoUpdate = false;
            
            var interval = Math.round(((view.end - view.start)/data.datapointsLimit)/1000);
            if (interval < 1) interval = 1;
            
            view.start = 1000*Math.floor((view.start/1000)/interval)*interval;
            view.end = 1000*Math.ceil((view.end/1000)/interval)*interval;
            
            data.loadPower(view.start, view.end, interval, function(result) {
                lastPowerTime = result.getLatestTime("cons_power");

                drawPowerGraph(result);
                autoUpdate = true;
            });

            // Get the daily data for a maximum amount of the last 30 days
            var days = 30;
            
            var interval = 86400000;
            var now = new Date();
            var end = now.getTime();
            var start = end - interval * Math.round(energyGraph.width/days);
            
            data.loadDailyEnergy(start, end, function(result) {
                drawEnergyGraph(result);
            });
            
            reload = false;
        }
        redraw = false;
        
    }, autoUpdate);
}

function drawPowerValues(power) {
    var value = power.getLatestValue("cons_power");
    
    // set the power now value
    if (viewMode == "energy") {
        if (value < 10000) {
            $("#powernow").html((value*1).toFixed(0)+"W");
        }
        else {
            $("#powernow").html((value*0.001).toFixed(1)+"kW");
        }
    } else {
        // 1000W for an hour (x3600) = 3600000 Joules / 3600,000 = 1.0 kWh x 0.15p = 0.15p/kWh (scaling factor is x3600 / 3600,000 = 0.001)
        var cost_now = value*1*config.app.unitcost.value*0.001;
        
        if (cost_now < 1.0) {
            $("#powernow").html(config.app.currency.value+(value*1*config.app.unitcost.value*0.001).toFixed(3)+"/hr");
        }
        else {
            $("#powernow").html(config.app.currency.value+(value*1*config.app.unitcost.value*0.001).toFixed(2)+"/hr");
        }
    }
}

function drawPowerGraph(power) {
    var consPower = power.getData("cons_power");
    
    var series = {
        "solar_power": {
            color: "rgba(255, 255, 255, 1.0)",
            data: []
        },
        "cons_power": {
            color: "rgba(6, 153, 250, 0.5)",
            data: consPower
        }
    };
    
    powerGraph.draw("placeholder_power", series, view.start, view.end);
    $(".ajax-loader").hide();
}

function drawEnergyValues(energy) {
    var consEnergy = data.get("cons_energy");
    var latestTime = consEnergy.getLatestTime();
    var latestValue = consEnergy.getLatestValue();
    
    var scale = 1;
    if (viewMode == "energy") {
        $("#constoday_units_a").html("");
        $("#constoday_units_b").html(" kWh");
        $(".u1a").html(""); $(".u1b").html("kWh");
        $(".u2a").html(""); $(".u2b").html(" kWh/d");
    }
    else {
        scale = config.app.unitcost.value;
        
        $("#constoday_units_a").html(config.app.currency.value);
        $("#constoday_units_b").html("");
        $(".u1a").html(config.app.currency.value); $(".u1b").html("");
        $(".u2a").html(config.app.currency.value); $(".u2b").html("/day");
    }

    var now = new Date();

    // -------------------------------------------------------------------------------------------------------- 
    // TODAY: Get the consumed energy since midnight, scaled to unit cost
    // --------------------------------------------------------------------------------------------------------       
    var today = new Date();
    today.setHours(0,0,0,0);
    var todayStartTime = today.getTime();

    var todayStart = consEnergy.getTimevalue(todayStartTime);
    if (todayStart == null || todayStart[1] == null) {
        todayStart = [
            consEnergy.getEarliestTime(),
            consEnergy.getEarliestValue()
        ];
    }
    var todayValue = scale*(latestValue - todayStart[1]);
    
    if (todayValue < 100) {
        $("#constoday").html(todayValue.toFixed(1));
    }
    else {
        $("#constoday").html(todayValue.toFixed(0));
    }
    
    // -------------------------------------------------------------------------------------------------------- 
    // WEEK: Get the time of the start of the week, if we have rolled over to a new week, load the watt hour
    // --------------------------------------------------------------------------------------------------------       
    // value in the watt accumulator feed recorded for the start of this week.
    var dayOfWeek = now.getDay();
    if (dayOfWeek > 0) {
        dayOfWeek -= 1;
    }
    else {
        dayOfWeek = 6;
    }
    var weekStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()-dayOfWeek).getTime();
    
    var weekStart = consEnergy.getTimevalue(weekStartTime);
    if (weekStart == null || weekStart[1] == null) {
        weekStart = [
            consEnergy.getEarliestTime(),
            consEnergy.getEarliestValue()
        ];
    }
    var weekEnergy = latestValue - weekStart[1];
    var weekDays = (latestTime - weekStart[0])/86400000;
    
    // --------------------------------------------------------------------------------------------------------       
    // MONTH: repeat same process as above
    // --------------------------------------------------------------------------------------------------------       
    var monthStartTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    var monthStart = consEnergy.getTimevalue(monthStartTime);
    if (monthStart == null || monthStart[1] == null) {
        monthStart = [
            consEnergy.getEarliestTime(),
            consEnergy.getEarliestValue()
        ];
    }
    var monthEnergy = latestValue - monthStart[1];
    var monthDays = (latestTime - monthStart[0])/86400000;
    
    // -------------------------------------------------------------------------------------------------------- 
    // YEAR: repeat same process as above
    // --------------------------------------------------------------------------------------------------------       
    var yearStartTime = new Date(now.getFullYear(), 0, 1).getTime();
    
    var yearStart = consEnergy.getTimevalue(yearStartTime);
    if (yearStart == null || yearStart[1] == null) {
        yearStart = [
            consEnergy.getEarliestTime(),
            consEnergy.getEarliestValue()
        ];
    }
    var yearEnergy = latestValue - yearStart[1];
    var yearDays = (latestTime - yearStart[0])/86400000;
    
    // -------------------------------------------------------------------------------------------------------- 
    // ALL TIME
    // --------------------------------------------------------------------------------------------------------
    var allTimeEnergy = latestValue - consEnergy.getEarliestValue();
    var allTimeDays = (latestTime - consEnergy.getEarliestTime())/86400000;

    // -------------------------------------------------------------------------------------------------------- 
    // Draw this week, month, year and total energy values, scaled to unit cost
    // --------------------------------------------------------------------------------------------------------
    $("#week_kwh").html((scale*weekEnergy).toFixed(1));
    $("#week_kwhd").html((scale*weekEnergy/weekDays).toFixed(1));
    
    $("#month_kwh").html((scale*monthEnergy).toFixed(1));
    $("#month_kwhd").html((scale*monthEnergy/monthDays).toFixed(1));
    
    $("#year_kwh").html((scale*yearEnergy).toFixed(1));
    $("#year_kwhd").html((scale*yearEnergy/yearDays).toFixed(1));
    
    $("#alltime_kwh").html(Math.round(scale*latestValue));
    $("#alltime_kwhd").html((scale*allTimeEnergy/allTimeDays).toFixed(1));
}

function drawEnergyGraph(energy) {
    var scale;
    var unit;
    if (viewMode == "energy") {
        scale = 1;
        unit = 'kWh';
    }
    else {
        scale = config.app.unitcost.value;
        unit = config.app.currency.value;
    }
    
    // Align start and end times to midnight of a maximum of 30 days in the past
    var interval = 86400000;
    var days = 30;
    var now = new Date();
    now.setHours(0,0,0,0);
    var end = now.getTime();
    var start = end - interval * Math.round(energyGraph.width/days);
    
    daily = [];
    for (var day of energy.iterateDailyEnergy(start, end)) {
        var time = day.time;
        
        var value = day['cons_energy'];
        // Trim days with zero energy consumption
        if (value > 0 || daily.length > 0) {
            daily.push([time, scale*value]);
        }
    }
    
    energyGraph.draw('placeholder_kwhd', [daily], unit);
    $(".ajax-loader").hide();
}

$(window).resize(function(){ resize(); });

// ----------------------------------------------------------------------
// App log
// ----------------------------------------------------------------------
function appLog(level, message) {
    if (level == "ERROR") {
        alert(level + ": " + message);
    }
    console.log(level + ": " + message);
}

</script>
