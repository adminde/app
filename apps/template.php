<?php
    global $path, $session;
    $v = 5;
?>
<link href="<?php echo $path; ?>Modules/app/css/config.css?v=<?php echo $v; ?>" rel="stylesheet">
<link href="<?php echo $path; ?>Modules/app/css/dark.css?v=<?php echo $v; ?>" rel="stylesheet">

<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/config.js?v=<?php echo $v; ?>"></script>
<script type="text/javascript" src="<?php echo $path; ?>Modules/app/lib/feed.js?v=<?php echo $v; ?>"></script>

<div id="app-block" style="display:none">
  <div class="col1"><div class="col1-inner">
  
    <div style="height:20px; border-bottom:1px solid #333; padding-bottom:8px;">
      <div style="float:right;">
        <i class="openconfig icon-wrench icon-white" style="cursor:pointer; padding-right:5px;"></i>
      </div>
    </div>
    <div style="text-align:center">
      <div class="electric-title">POWER NOW</div>
      <div class="power-value"><span id="powernow">0</span></div>
    </div>
  
  </div></div>
</div>    

<div id="app-setup" style="display:none; padding-top:50px" class="block">
    <h2 class="appconfig-title">Template</h2>
    <div class="appconfig-description">
    <div class="appconfig-description-inner">A basic app example useful for developing new apps</div>
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
    "use": {
        "type": "feed", 
        "autoname": "use", 
        "engine": "0,2,5", 
        "description": "House or building use in watts"
    }
};
config.name = "<?php echo $name; ?>";
config.db = <?php echo json_encode($config); ?>;
config.feeds = feed.getList();

config.initapp = function() {
    init()
};
config.showapp = function() {
    show()
};
config.hideapp = function() {
    clear()
};

// ----------------------------------------------------------------------
// APPLICATION
// ----------------------------------------------------------------------
var feeds = {};

config.init();

function init() {   
    // Quick translation of feed ids
    feeds = {};
    for (var key in config.app) {
        if (config.app[key].value) feeds[key] = config.feedsbyid[config.app[key].value];
    }
}
    
function show() {
    $(".ajax-loader").hide();
    
    resize();
    updateTimer = setInterval(update, 5000);
}

function update() {
    var latestData = feed.getListById();
    $("#powernow").html((latestData[feeds["use"].id].value*1).toFixed(1)+"W");
}

function resize() {
	update();
}

function clear() {
    clearInterval(updateTimer);
}

$(window).resize(function() {
    resize();
});

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
