class Feed {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    setPower(id, powerSwitch, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
    	var powerState = {};
        var promise = $.ajax({                                      
            url: path+"app/powerswitch.json" + apiKeyStr,//feed/
            dataType: 'json',
            async: async,
//            type: "post",
            data: "id="+id+"&power_switch="+powerSwitch,
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
    
    getPower(id, callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var powerState = {};
    	var promise = $.ajax({                                      
    		url: path+"app/powerstate.json" + apiKeyStr,//feed/
    		dataType: 'json',
    		async: async,
    		data: "id="+id,
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
    
    getList(callback) {
    	var async = false;
    	if (typeof callback == 'function') {
    		async = true;
    	}
    	
    	var apiKeyStr = "";
    	if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
    	
    	var feeds = {};
    	var promise = $.ajax({                                      
    		url: path+"feed/list.json"+apiKeyStr,
    		dataType: 'json',
    		async: async,                      
    		success(result) {
    			if (!result || result === null || result === "" || result.constructor != Array) {
    				console.log("ERROR", "feed.list received invalid result: " + result);
    			}
    			else feeds = result;
    			
    			if (async) {
    				callback(feeds);
    			}
    		}
    	});
    	
    	if (async) {
    		return promise;
    	}
    	else return feeds;
    }

    getListById(callback) {
        var result;
        if (typeof callback == 'function') {
        	result = this.getList(function(feeds) {
                var feedsById = {};
                for (var i in feeds) feedsById[feeds[i].id] = feeds[i];
                
                if (typeof callback == 'function') {
                	callback(feedsById);
                }
        	});
        }
        else {
            result = {};
            
        	var feeds = this.getList();
            for (var i in feeds) result[feeds[i].id] = feeds[i];
        }
        
        return result;
    }

    getListByName(callback) {
        var result;
        if (typeof callback == 'function') {
        	result = this.getList(function(feeds) {
                var feedsByName = {};
                for (var i in feeds) feedsByName[feeds[i].name] = feeds[i];
                
                if (typeof callback == 'function') {
                	callback(feedsByName);
                }
        	});
        }
        else {
            result = {};
            
        	var feeds = this.getList();
            for (var i in feeds) result[feeds[i].name] = feeds[i];
        }
        
        return result;
    }

    getMeta(id, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;

    	var meta = {};
        var promise = $.ajax({                                      
            url: path+"feed/getmeta.json"+apiKeyStr,                         
            data: "id="+id,
            dataType: 'json',
            async: async,
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Object) {
                    console.log("ERROR", "feed.getMeta received invalid result: " + result);
                }
                else meta = result;

                if (async) {
                    callback(meta);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return meta;
    }

    getData(id, start, end, interval, skipMissing, limitInterval, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        if (typeof skipMissing == 'boolean') {
        	skipMissing = skipMissing ? 1 : 0;
        }
        if (typeof limitInterval == 'boolean') {
        	limitInterval = limitInterval ? 1 : 0;
        }

        var data = [];
        var promise = $.ajax({    
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval+"&skipmissing="+skipMissing+"&limitinterval="+limitInterval,
            dataType: 'json',
            async: async,
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    console.log("ERROR", "feed.getData received invalid result: " + result);
                }
                else data = result;

                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return data;
    }

    getDailyData(id, start, end, callback) {
        return this.getDMYData(id, start, end, "daily", callback);
    }

    getDMYData(id, start, end, mode, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        var promise = $.ajax({
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&mode="+mode,
            dataType: 'json',
            async: async,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    console.log("ERROR", "feed.getDMY received invalid result: " + result);
                }
                else data = result;
                
                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return data;
    }

    getDailyTimeOfUse(id, start, end, split, callback) {
        return this.getDMYTimeOfUse(id, start, end, "daily", split, callback);
    }

    getDMYTimeOfUse(id, start, end, mode, split, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        var promise = $.ajax({                                      
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&mode="+mode+"&split="+split,
            dataType: 'json',
            async: async,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    console.log("ERROR", "feed.getDataDMY received invalid result: " + result);
                }
                else data = result;
                
                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return data;
    }

    getAverage(id, start, end, interval, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        var promise = $.ajax({                                      
            url: path+"feed/average.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval,
            dataType: 'json',
            async: async,                      
            success: function(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    console.log("ERROR", "feed.getAverage received invalid result: " + result);
                }
                else data = result;
                
                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return data;
    }

    getValue(id, time, callback)  {
        var result;
        if (typeof callback == 'function') {
        	result = this.getData(id, time, time+1000, 1, false, false, function(data) {
                var value = data.length > 0 ? data[0] : null;
                
                if (typeof callback == 'function') {
                	callback(value);
                }
        	});
        }
        else {
        	var data = this.getData(id, time, time+1000, 1, false, false);
            result = data.length > 0 ? data[0] : null;
        }
        
        return result;
    }

    getRemoteData(id, start, end, interval, skipMissing, limitInterval, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        if (typeof skipMissing == 'boolean') {
        	skipMissing = skipMissing ? 1 : 0;
        }
        if (typeof limitInterval == 'boolean') {
        	limitInterval = limitInterval ? 1 : 0;
        }
        
        var data = [];
        var promise = $.ajax({                                      
            url: path+"app/dataremote",
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval+"&skipmissing="+skipMissing+"&limitinterval="+limitInterval,
            dataType: 'json',
            async: async,
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    console.log("ERROR", "feed.getDataRemote received invalid result: " + result);
                }
                else data = result;
                
                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return data;
    }

    getRemoteValue(id, callback) {
        var async = false;
        if (typeof callback == 'function') {
        	async = true;
        }
        
        var value = 0;
        var promise = $.ajax({                                      
            url: path+"app/valueremote",                       
            data: "id="+id,
            dataType: 'json',
            async: async,
            success(result) {
                if (isNaN(result)) {
                    console.log("ERROR", "feed.getValueRemote received value that is not a number: " + result);
                }
                else value = parseFloat(result);
                
                if (async) {
                    callback(data);
                }
            }
        });
        
        if (async) {
        	return promise;
        }
        else return value;
    }
}
