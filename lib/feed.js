class Feed {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    getAsyncListById(callback) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var feeds = {};
        $.ajax({
            url: path+"feed/list.json"+apiKeyStr,
            dataType: 'json',
            async: true,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.listByIdAsync received invalid response: " + result);
                }
                feeds = result;
                
                var byid = {};
                for (z in feeds) byid[feeds[z].id] = feeds[z];
                callback(byid);
            }
        });
    }

    getListById() {
        var feeds = this.getList();
        var byid = {};
        for (var i in feeds) byid[feeds[i].id] = feeds[i];
        return byid;
    }

    getListByName() {
        var feeds = this.getList();
        var byname = {};
        for (var i in feeds) byname[feeds[i].name] = feeds[i];
        return byname;
    }

    getList() {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var feeds = {};
        $.ajax({                                      
            url: path+"feed/list.json"+apiKeyStr,
            dataType: 'json',
            async: false,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.list received invalid response: " + result);
                }
                feeds = result; 
            } 
        });
        
        return feeds;
    }

    getMeta(id) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var meta = {};
        $.ajax({                                      
            url: path+"feed/getmeta.json"+apiKeyStr,                         
            data: "id="+id,
            dataType: 'json',
            async: false,
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Object) {
                    appLog("ERROR", "feed.getMeta received invalid response: " + result);
                }
                meta = result; 
            } 
        });
        return meta;
    }

    getData(id, start, end, interval, skipmissing, limitinterval) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        $.ajax({
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval+"&skipmissing="+skipmissing+"&limitinterval="+limitinterval,
            dataType: 'json',
            async: false,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.getData received invalid response: " + result);
                }
                data = result; 
            }
        });
        return data;
    }

    getDailyData(id, start, end) {
        return this.getDMY(id, start, end, "daily")
    }

    getDMYData(id, start, end, mode) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        $.ajax({
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&mode="+mode,
            dataType: 'json',
            async: false,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.getDMY received invalid response: " + result);
                }
                data = result; 
            }
        });
        return data;
    }

    getDailyTimeOfUse(id, start, end, split) {
        return this.getDMYTimeOfUse(id, start, end, "daily", split)
    }

    getDMYTimeOfUse(id, start, end, mode, split) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        $.ajax({                                      
            url: path+"feed/data.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&mode="+mode+"&split="+split,
            dataType: 'json',
            async: false,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.getDataDMY received invalid response: " + result);
                }
                data = result; 
            }
        });
        return data;
    }

    getAverage(id, start, end, interval, skipmissing, limitinterval) {
        var apiKeyStr = "";
        if (this.apiKey != "") apiKeyStr = "?apiKey=" + this.apiKey;
        
        var data = [];
        $.ajax({                                      
            url: path+"feed/average.json"+apiKeyStr,                         
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval,
            dataType: 'json',
            async: false,                      
            success: function(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.getAverage received invalid response: " + result);
                }
                data = result; 
            }
        });
        return data;
    }

    getValue(feedid, time)  {
        var result = this.getData(feedid, time, time+1000, 1, 0, 0);
        if (result.length > 0) return result[0];
        return false;
    }

    getRemoteData(id, start, end, interval) {   
        var data = [];
        $.ajax({                                      
            url: path+"app/dataremote",
            data: "id="+id+"&start="+start+"&end="+end+"&interval="+interval+"&skipmissing=0&limitinterval=0",
            dataType: 'json',
            async: false,                      
            success(result) {
                if (!result || result === null || result === "" || result.constructor != Array) {
                    appLog("ERROR", "feed.getDataRemote received invalid response: " + result);
                    result = [];
                }
                data = result;
            }
        });
        return data;
    }

    getRemoteValue(id) {   
        var value = 0;
        $.ajax({                                      
            url: path+"app/valueremote",                       
            data: "id="+id, dataType: 'json', async: false,                      
            success(result) {
                if (isNaN(result)) {
                    appLog("ERROR", "feed.getValueRemote received value that is not a number: " + result);
                    result = 0;
                }
                value = parseFloat(result);
            }
        });
        return value;
    }
}
