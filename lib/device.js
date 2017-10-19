class Device {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    getTemplateList(callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var devices = {};
    	var promise = $.ajax({                                      
    		url: path+"device/template/listshort.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to retrieve device list: " + result);
    			}
    			else devices = result;
    			
    			if (async) {
    				callback(devices);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return devices;
    }
    
    
    getDeviceControlList(callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var devices = {};
    	var promise = $.ajax({                                      
    		url: path+"device/control/list.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to retrieve device list: " + result);
    			}
    			else devices = result;
    			
    			if (async) {
    				callback(devices);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return devices;
    }
    
    setControl(id, outputId, powerSwitch, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
    	var powerState = {};
        var promise = $.ajax({                                      
            url: path+"device/control/set.json" + apiKeyStr,
            dataType: 'json',
            async: async,
//            type: "post",
            data: "id="+id+"&outputid="+outputId+"&value="+powerSwitch,
            success(result) {
                if (!result || result === null || result === "") {
                    console.log("ERROR", "failed to switch " + powerSwitch + " power: " + result);
                    if(powerSwitch === "on") powerState.powerState = "off";
                    else powerState.powerState = "on";
                }
                else powerState = result;

                if (async) {
                    callback(powerState);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return powerState;
    }
    
    getControl(id, outputId, callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var powerState = {};
    	var promise = $.ajax({                                      
    		url: path+"device/control/get.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		data: "id="+id+"&outputid="+outputId,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to retrieve power state: " + result);
    			}
    			else powerState = result;
    			
    			if (async) {
    				callback(powerState);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return powerState;
    }
}