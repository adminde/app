<?php
global $path, $session;
$v = 6;
?>
<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/dark.css?v=<?php echo $v; ?>" rel="stylesheet">

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/feed.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/data.js?v=<?php echo $v; ?>"></script>

<link href="<?php echo $path; ?>Lib/titatoggle/titatoggle-dist-min.css?v=<?php echo $v; ?>" rel="stylesheet">

<style>
    .checkbox-slider--b {
        width: 60px;
        border-radius: 25px;
        background-color: gainsboro;
        height: 40px;
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
          <table><tr>
              <td>
              	<i class="icon-off icon-white"></i>
              </td>
              <td>
              	<div id="custom-check" class="checkbox checkbox-slider-lg checkbox-slider--b  checkbox-slider-info">
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

var feed = new Feed(apiKey);

// ----------------------------------------------------------------------
// Display
// ----------------------------------------------------------------------
$("body").css('background-color', '#222');
$(window).ready(function() {
    $("#footer").css('background-color', '#181818');
    $("#footer").css('color', '#999');

    if(feed.getPower(2).powerState == "on") {
        $("#power-switch").prop('checked', true);
    } else {
    	$("#power-switch").prop('checked', false);
    }
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
        "type": "feed",
        "class": "power",
        "autoname": "device",
        "engine": "2,5,6"
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
    clear();
};

// ----------------------------------------------------------------------
// Application
// ----------------------------------------------------------------------
config.init();

function init() {   
    // -------------------------------------------------------------------------
    // Initialize power and energy data
    // -------------------------------------------------------------------------
    data.init(feed, config);
}
    
function show() {
	$("#app-title").html(config.app.title.value);
    $(".ajax-loader").hide();
}
   
function update() {

}

//-------------------------------------------------------------------------------
//EVENTS
//-------------------------------------------------------------------------------
$('#power-switch').click(function() {
	var powerSwitch = $('#power-switch').is(':checked') ? "on" : "off";
	feed.setPower(2, powerSwitch, function(result) {
		if(powerSwitch === result.powerState) {
			console.log("Power " + result.powerState);
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