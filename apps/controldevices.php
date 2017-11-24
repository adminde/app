<?php
global $path, $session;
$v = 6;
?>
<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/light.css?v=<?php echo $v; ?>" rel="stylesheet">

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/device.js?v=<?php echo $v; ?>"></script>

<link href="<?php echo $path; ?>Modules/app/css/titatoggle-dist-min.css?v=<?php echo $v; ?>" rel="stylesheet">

<style>
    .checkbox-slider--b {
        width: 20px;
        border-radius: 25px;
        background-color: gainsboro;
        height: 20px;
    }
    
    *::before, *::after {
        box-sizing: border-box;
    }
    
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
    
    .block-content {
        background-color:#fff;
        color:#333;
        padding:10px;
    }
    
    .list-item {
        margin-bottom: 12px;
    }
    
    .collapse-graph {
       width: 100%; 
       text-align: right; 
       border-bottom: 1px solid lightgray; 
       line-height: 0.1em;
       margin: 10px 0 5px; 
       color: lightgray;
    } 
    
    .collapse-graph a { 
        background:#fff; 
        padding:0 10px; 
    }
    
/*     .icon-chevron-down, .icon-chevron-up {  */
/*         opacity: 0.35;  */
/*     } */
    
    .control-label {
        color: grey;
        font-weight: bold;
        padding-top: 5px;
    }
    
    .name {
        text-align: right;
        width: 75%;
    }
    
    .left {
        text-align: right;
        width: 15%;
        padding-right: 0.7%;
    }
    
    .control {
        text-align: right;
        width: 5%;
    }
    
    .right {
        text-align: left;
        width: 10%;
    }
    
    .switch {
    
    }
    
    input.number {
        width: 27px;
        color: grey;
        background-color: white;
        margin-bottom: 5px;
        margin-right: 5px;
    }
    
     input.number[disabled] {
         background-color: #eee;
     }
   
   .device {
        margin-bottom:10px;
        border: 1px solid #aaa;
    }
    
    .device-info {
        background-color:#ddd;
        cursor:pointer;
    }
 
    .device-controls {
        padding: 0px 5px 5px 5px;
        background-color:#ddd;
    }
    
    .device-control {
        background-color:#f0f0f0;
        border-bottom:1px solid #fff;
        border-left:2px solid #f0f0f0;
        height:41px;
    }
</style>

<div id="app-block" style="display:none">
	<div id="myelectric-realtime" class="col1"><div class="col1-inner">
        <div class="block-bound">
            <div class="bluenav openconfig"><i class="icon-wrench icon-white"></i></div>
            <div class="bluenav view-unit">VIEW COST</div>
            <!--<div class="bluenav cost">Cost</div>-->
            <!--<div class="bluenav energy">Energy</div>-->
            <div id="app-title" class="block-title">DEVICE CONTROL</div>
        </div>
        
       <div class="block-content">
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
          <div id="device-list" style="width:100%"></div>
  	</div></div>
</div>    

<div id="app-setup" style="display:none; padding-top:50px" class="block">
    <h2 class="appconfig-title">Device Control</h2>
    <div class="appconfig-description">
    <div class="appconfig-description-inner">Configure Device Control</div>
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

var device = new Device(apiKey);

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
	"title": {
        "type": "value",
        "default": "Device Control",
        "name": "Title",
        "description": "Optional title for app"
    }
};

config.name = "<?php echo $name; ?>";
config.db = <?php echo json_encode($config); ?>;
config.devices = device.getDeviceControlList();//

config.initapp = function() {
    init();
};
config.showapp = function() {
    show();
};
config.hideapp = function() {
    clear();
};

// ----------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------
config.init();

function init() {
	config.devices.forEach(function(d) {
		$("#device-list").append(
	          	"<div class='block-bound list-item device'>" +
    	          	"<div class='device-info'>" +
        	          	"<div class='device-controls'>" +
            	          	"<table id='device" + d.id + "' style='width:100%'><tr>" +
            	              "<td>" +
            	                "<div class='block-title' style='color: grey;'>" + d.name + "</div>" +
            	              "</td>" +
            // 	              "<td>" +
            // 	                "<div class='block-title'>" + d.description + "</div>" +
            // 	              "</td>" +
            	         	"</tr>" +
            	         	"</table>" +
            
            	         	"<div id='consumption" + d.id + "' style='padding:10px;'>" +
                	            "<table style='width:100%'>" +
                	                 "<tr>" +
                	                    "<td style='width:15%'>" +
                                     		 "<span class='electric-title'><span id='power-now'>0</span></span>" +
                                 		"</td>" +
                                 		"<td style='width:35%'>" +
                	                         "<span class='electric-title'>NOW</span>" +
                	                     "</td>" +
                	                    "<td style='width:35%;text-align:right'>" +
                                         	 "<span class='electric-title'>TODAY</span>" +
                                     	"</td>" +
                                     	"<td style='width:15%;text-align:right''>" +
                                         	 "<span class='electric-title'><span id='energy-today'>0</span></span>" +
                	                     "</td>" +
                	                 "</tr>" +
                	             "</table>" +
            	         	"</div>" +
        	         	"</div>" +
    	         	"</div>" +
	         	
// 	         	"<div class='panel-group block-content'>" +
// 	            "<div class='panel panel-default'>" +
// 	              "<div class='panel-heading'>" +
// 	                "<div class='panel-title collapse-graph'>" +
// 	                  "<a data-toggle='collapse' href='#collapse" + d.id + "'>" +
// 	                  	"<span id='chevron-down" + d.id + "' class='icon-chevron-down'></span>" +
// 	                  	"<span id='chevron-up" + d.id + "' class='icon-chevron-up'></span>" +
// 	                  "</a>" +
// 	                "</div>" +
// 	              "</div>" +
// 	              "<div id='collapse" + d.id + "' class='panel-collapse collapse'>" +
// 	                "<div class='panel-body'>" +
// 	                "</div>" +
// 	              "</div>" +
// 	            "</div>" +
	          "</div>"
		);

		config.app["consumption" + d.id] = {
			     "type": "checkbox",
			     "default": false,
		         "name": d.name+": Consumption",
		         "description": "Show device energy consumption"
		};
		
		d.control.forEach(function(c) {
			if(c.type === "Switch") {
        		$("#device" + d.id).append(
        	    		"<table class='device-control' id='" + d.id + "_" + c.id + "' style='width:100%'><tr>" +
    	                "<td class='control-label name'>" +
    	              	  "<span>" + c.label + "</span>" +
    	                "</td>" +
    	                "<td class='control-label left'>" +
    	              	  "<span>Off</span>" +
    	                "</td>" +
    	        		"<td class='control-label control'>" +
    	              	"<div class='checkbox checkbox-slider--b checkbox-slider-info'>" +
    	        			"<label>" +
    	        				"<input id='device" + d.id + "_output" + c.id + "' type='checkbox'><span></span>" +
    	        			"</label>" +
    	        		"</div>" +
    	              "</td>" +
                      "<td class='control-label right'>" +
                  	    "<span>On</span>" +
                      "</td>" +
    	              "</tr></table>"
              	);
			} else if(c.type === "Text") {
				$("#device" + d.id).append(
    	    		  "<table class='device-control' id='" + d.id + "_" + c.id + "' style='width:100%'><tr>" +
	                  "<td class='control-label name'>" +
	              	    "<span>" + c.label + "</span>" +
	                  "</td>" +
  	                "<td class='control-label left'>" +
	                "</td>" +
	        		  "<td class='control-label control'>" +
	              	    "<input class='number' id='device" + d.id + "_output" + c.id + "' type='text' value=" + (c.value ? c.value : 0).toFixed(c.format[2]) + " />" +
    	              "</td>" +
                      "<td class='control-label right'>" +
                  	    "<span>" + c.format.split(" ")[1] + "</span>" +
                      "</td>" +
    	              "</tr></table>"
              	);
			}
			config.app["device" + d.id + "_output" + c.id] = {
				     "type": "checkbox",
				     "default": true,
			         "name": d.name + ": " + c.label,
			         "description": "Control power state"
			};

			var outputTag = $("#device" + d.id + "_output" + c.id);
			if(c.mode === "read") {
				outputTag.prop('disabled', true);
			}
			outputTag.prop('checked', c.value === "1");
			
			//-------------------------------------------------------------------------------
			//EVENTS
			//-------------------------------------------------------------------------------
			outputTag.click(function() {
				if(c.type === "Switch") {
    				var checked = !outputTag.is(':checked');
    				if(checked) {
    					device.setControlOff(d.id, c.id, function(result) {
        					if(!result.success) {
            					console.log(result.message);
        						outputTag.prop('checked', true);
        					}
        				});
    				} else {
    					device.setControlOn(d.id, c.id, function(result) {
        					if(!result.success) {
        						console.log(result.message);
        						outputTag.prop('checked', false);
        					}
        				});
    				}
				} else if(c.type === "Number") {
					device.setControl(d.id, c.id, outputTag.value, function(result) {
    					if(!result.success) {
    						console.log(result.message);
    						outputTag.value = c.value;
    					}
    				});
				}
			});
		});

		var collapse = $("#collapse" + d.id);
		collapse.on('show.bs.collapse', function() {
			$("#chevron-down" + d.id).hide();
			$("#chevron-up" + d.id).show();
		});
		collapse.on('hide.bs.collapse', function() {
			$("#chevron-down" + d.id).show();
			$("#chevron-up" + d.id).hide();
		});

		$("#chevron-up" + d.id).hide();
	});
}
    
function show() {
	$("#app-title").html(config.app.title.value);

	config.devices.forEach(function(d) {
		d.control.forEach(function(c) {
    		var conf = config.app["device" + d.id + "_output" + c.id];
    	    if (typeof conf.value === 'undefined' ? conf.default : conf.value) {
    	        $("#"+d.id+"_"+c.id).show();
    	    }
    	    else {
    	        $("#"+d.id+"_"+c.id).hide();
    	    }
    	});
	    var conf = config.app["consumption" + d.id];
	    if (typeof conf.value === 'undefined' ? conf.default : conf.value) {
	        $("#consumption" + d.id).show();
	    }
	    else {
	        $("#consumption" + d.id).hide();
	    }
	});

	$("body").css('background-color','WhiteSmoke');
    $(".ajax-loader").hide();
}
   
function update() {

}

function resize() {

}

function clear() {

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