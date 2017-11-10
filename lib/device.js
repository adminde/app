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
    				console.log("ERROR", "failed to retrieve device list");
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
    
    setControl(id, outputId, value, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
    	var msg = {};
        var promise = $.ajax({                                      
            url: path+"device/control/set.json" + apiKeyStr,
            dataType: 'json',
            async: async,
//            type: "post",
            data: "id="+id+"&outputid="+outputId+"&value="+value,
            success(result) {
                if (!result || result === null || result === "") {
                    console.log("ERROR", "failed to set value to " + value);
                }
                else msg = result;

                if (async) {
                    callback(msg);
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
    	
    	var msg = {};
    	var promise = $.ajax({
    		url: path+"device/control/get.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		data: "id="+id+"&outputid="+outputId,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to retrieve control data");
    			}
    			else msg = result;
    			
    			if (async) {
    				callback(msg);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return powerState;
    }
    
//    'getControl':function(id)
//    {
//        var result = {};
//        $.ajax({ url: path+"device/control/get.json", data: "id="+id, dataType: 'json', async: false, success: function(data) {result = data;} });
//        return result;
//    },

    setControlOn(id, ctrlid, callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var state = {};
    	var promise = $.ajax({
    		url: path+"device/control/on.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		data: "id="+id+"&&controlid="+ctrlid,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to set control on");
    			}
    			else state = result;
    			
    			if (async) {
    				callback(state);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return state;
    }
    
    setControlOff(id, ctrlid, callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var state = {};
    	var promise = $.ajax({
    		url: path+"device/control/off.json" + apiKeyStr,
    		dataType: 'json',
    		async: async,
    		data: "id="+id+"&&controlid="+ctrlid,
    		success(result) {
    			if (!result || result === null || result === "") {
    				console.log("ERROR", "failed to set control off");
    			}
    			else state = result;
    			
    			if (async) {
    				callback(state);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return state;
    }
}