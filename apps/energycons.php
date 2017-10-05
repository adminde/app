<?php
    global $path, $session;
    $v = 6;
?>
<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/light.css?v=<?php echo $v; ?>" rel="stylesheet">

<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Montserrat&amp;lang=en" />    
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/feed.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/data.js?v=<?php echo $v; ?>"></script>

<script type="text/javascript" src="<?php echo $path; ?>Lib/flot/jquery.flot.min.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Lib/flot/jquery.flot.time.min.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Lib/flot/jquery.flot.selection.min.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Lib/flot/date.format.js?v=<?php echo $v; ?>"></script> 
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/vis.helper.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/graph.js?v=<?php echo $v; ?>"></script>

<style>

.electric-title {
    font-weight: bold;
    font-size: 22px;
    color: #44b3e2;
}

.power-value {
    font-weight: bold; 
    font-size: 52px; 
    color: #44b3e2;
    line-height: 1.1;
}

.units {
    font-size: 75%;
}

.block-bound {
  background-color: rgb(68,179,226);
}

</style>

<div style="font-family: Montserrat, Veranda, sans-serif;">
    <div id="app-block" style="display:none">
    
        <div id="myelectric-realtime" class="col1"><div class="col1-inner">
            <div class="block-bound">
                <div class="bluenav openconfig"><i class="icon-wrench icon-white"></i></div>
                <div class="bluenav view-unit">VIEW COST</div>
                <!--<div class="bluenav cost">Cost</div>-->
                <!--<div class="bluenav energy">Energy</div>-->
                <div id="app-title" class="block-title">CONSUMPTION</div>
            </div>
            
            <div style="background-color:#fff; color:#333; padding:10px;">
                <table style="width:100%">
                    <tr>
                        <td style="width:40%">
                            <div class="electric-title">NOW</div>
                            <div class="power-value"><span id="power-now">0</span></div>
                        </td>
                        <td style="text-align:right">
                            <div class="electric-title">TODAY</div>
                            <div class="power-value"><span id="energy-today">0</span></div>
                        </td>
                    </tr>
                </table>
            </div>
        </div></div>
        
        <div class="col1"><div class="col1-inner">
        	<?php include('Modules/app/lib/graph.html'); ?>
        </div></div>
        
        <div class="col1"><div class="col1-inner">
            <div id="energystack-comparison" class="col2" style="display:none">
                <div class="block-bound">
                    <div class="block-title">COMPARISON</div>
                </div>
                
                <div style="background-color:rgba(68,179,226,0.1); padding:20px; color:#333; text-align:center">
                    <div id="comparison_summary" style=""></div><br>
                    <canvas id="energystack" width="270px" height="360px"></canvas>
                    <div style="text-align:left">
                        The ZeroCarbonBritain target is based on a household using all low energy appliances and LED lighting.
                        <br><br>
                        
                        <b>This app includes:</b><br>
                        <input id="heating" type="checkbox"> Heatpump or electric heating<br><input id="transport" type="checkbox"> Electric Vehicle
                    </div>
                    <div style="clear:both"></div>
                </div>
            </div>
        </div></div>
    </div>
</div>
        
        
<div id="app-setup" class="block">
    <h2 class="appconfig-title">Energy consumption</h2>

    <div class="appconfig-description">
        <div class="appconfig-description-inner">
            The energy consumption app is a simple home energy monitoring app to explore home or building electricity consumption over time.
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
$("body").css('background-color', 'WhiteSmoke');
$(window).ready(function(){
    //$("#footer").css('background-color','#181818');
    //$("#footer").css('color','#999');
});

if (!sessionWrite) $(".openconfig").hide();

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------
config.app = {
    "title": {
        "type": "value",
        "default": "Energy Consumption",
        "name": "Title",
        "description": "Optional title for app"
    },
    "use": {
        "type": "feed",
        "class": "power",
        "autoname": "use",
        "engine": "2,5,6"
    },
    "use_kwh": {
        "type": "feed",
        "class": "energy",
        "autoname": "use_kwh",
        "engine": "2,5,6"
    },
    "unitcost": {
        "type": "value",
        "default": 0.1508,
        "name": "Unit cost",
        "description": "Unit cost of electricity £/kWh"
    },
    "currency": {
        "type": "value",
        "default": "£",
        "name": "Currency",
        "description": "Currency symbol (£,$..)"
    },
    "showcomparison": {
        "type": "checkbox",
        "default": true,
        "name": "Show comparison",
        "description": "Energy stack comparison"
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
var viewMode = "bargraph";
var viewUnit = "energy";
var periodText = "month";
var periodAverage = 0;
var panning = false;
var previousPoint = false;
var comparisonHeating = false;
var comparisonTransport = false;
var flotFontSize = 12;
var updateTimer = false;

config.init();

function init() {
    // -------------------------------------------------------------------------
    // Initialize power and energy data
    // -------------------------------------------------------------------------
    data.init(feed, config);
    graph.init();
}

function show() {
    var timeWindow = (3600000*24.0*30);
    view.end = (new Date()).getTime();
    view.start = view.end - timeWindow;
    
    $("body").css('background-color','WhiteSmoke');
    
    $("#app-title").html(config.app.title.value);
    if (config.app.showcomparison.value) {
        $("#energystack-comparison").show();
    }
    else {
        $("#energystack-comparison").hide();
        $("#energystack-comparison").parent().hide();
    }
    

	resize();
    
    graph.loadEnergyGraph();
    graph.loadTimeOfUse();
    
    update();
    updateTimer = setInterval(update, 5000);
    $(".ajax-loader").hide();
}

function hide() {
	clearInterval(updateTimer);
}

function update() {
    data.update(function(result) {
    	graph.drawPowerValues();
    	graph.drawEnergyValues();
    });
}

function resize() {
    var offsetTop = 0;
    
    var placeholderBounds = $('#placeholder-bound');
    var placeholder = $('#placeholder');
    
    var width = placeholderBounds.width();
    var height = width*0.6;
    if (height > 500) height = 500;
    if (height > width) height = width;
    
    var heightWindow = $(window).height();
    var heightTop = $("#myelectric-realtime").height();
    
    if (!config.app.showcomparison.value) height = heightWindow - heightTop - 200;
    
    placeholder.width(width);
    placeholderBounds.height(height);
    placeholder.height(height - offsetTop);
    
    if (width <= 500) {
        $(".electric-title").css("font-size", "16px");
        $(".power-value").css("font-size", "38px");
    }
    else if (width <= 724) {
        $(".electric-title").css("font-size", "18px");
        $(".power-value").css("font-size", "52px");
    }
    else {
        $(".electric-title").css("font-size", "22px");
        $(".power-value").css("font-size", "52px");
    }
}

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
