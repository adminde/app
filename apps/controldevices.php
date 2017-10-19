<?php
global $path, $session;
$v = 6;
?>
<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/dark.css?v=<?php echo $v; ?>" rel="stylesheet">

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/device.js?v=<?php echo $v; ?>"></script>

<link href="<?php echo $path; ?>Modules/app/css/titatoggle-dist-min.css?v=<?php echo $v; ?>" rel="stylesheet">
<!-- link href="<?php echo $path; ?>Lib/titatoggle/titatoggle-dist-min.css?v=<?php echo $v; ?>" rel="stylesheet"-->


<style>
    .checkbox-slider--b {
        width: 40px;
        border-radius: 25px;
        background-color: gainsboro;
        height: 30px;
    }
</style>

<div id="app-block" style="display:none">
  <div style="height:20px; border-bottom:1px solid #333; padding:8px;">
    <div style="float:right;">
      <i class="openconfig icon-wrench icon-white" style="cursor:pointer"></i>
    </div>
  </div>
  <div style="text-align:center">
    <div id="app-title" class="electric-title">DEVICE CONTROL</div>
  </div>
      <div class="col1"><div class="col1-inner">
          <table><tr id="Switch">
              <td>
              	<i class="icon-off icon-white"></i>
              </td>
              <td>
              	<div class="checkbox checkbox-slider-md checkbox-slider--b  checkbox-slider-info">
        			<label>
        				<input id="power-switch" type="checkbox"><span></span>
        			</label>
        		</div>
              </td>
          </tr></table>
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

    $("#power-switch").prop('checked', device.getControl(7, 1).value);
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
    },
    "device": {
	     "type": "device",
	     "class": "power",
	     "autoname": "Device"
    }
};

config.name = "<?php echo $name; ?>";
config.db = <?php echo json_encode($config); ?>;
config.devices = device.getDeviceControlList();

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
	var id = config.app.device.value;
	var outputs = config.devicesbyid[id].output;
	for (var o in outputs) {
		config.app[outputs[o].name] = {
			     "type": "checkbox",
			     "default": true,
		         "name": outputs[o].name,
		         "description": "Control parameter"
			};
	}
}
    
function show() {
	$("#app-title").html(config.app.title.value);

	var id = config.app.device.value;
	var outputs = config.devicesbyid[id].output;
	for (var o in outputs) {
	    if (config.app[outputs[o].name].value) {
	        $("#"+outputs[o].name).show();
	    }
	    else {
	        $("#"+outputs[o].name).hide();
	    }
	}
    
    $(".ajax-loader").hide();
}
   
function update() {

}

//-------------------------------------------------------------------------------
//EVENTS
//-------------------------------------------------------------------------------
$('#power-switch').click(function() {
	var powerSwitch = $('#power-switch').is(':checked');
	device.setControl(7, 1, powerSwitch, function(result) {
		if(powerSwitch === result.value) {
			console.log("Power " + result.value);
		} else {
			$('#power-switch').prop('checked', !$('#power-switch').is(':checked'));
		}
	});
});

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