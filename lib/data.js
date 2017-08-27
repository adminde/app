var data = {

    datapointsLimit: 1500,
    
    feed: null,
    cache: null,
    
    init: function(feed, config) {
        this.feed = feed;

        var data = {};
        for (var key in config.app) {
            if (config.app[key]['value']) {
                var f = config.feedsbyid[config.app[key]['value']];
                var c = config.app[key]['class'];
                if (c === 'power') {
                    if (f.engine == 5 || f.engine == 6) {
                        data[key] = new FixedIntervalPowerSeries(key, f.id, f.engine, feed);
                    }
                    else {
                        data[key] = new IntermittentPowerSeries(key, f.id, f.engine, feed);
                    }
                }
                else if (c === 'energy') {
                    if (f.engine == 5 || f.engine == 6) {
                        data[key] = new FixedIntervalEnergySeries(key, f.id, f.engine, feed);
                    }
                    else {
                        data[key] = new IntermittentEnergySeries(key, f.id, f.engine, feed);
                    }
                }
            }
        }
        this.cache = new DataCollection(data);
    },
    
    get: function(key) {
        return this.cache.get(key);
    },
    
    loadPower: function(start, end, interval, callback) {
        
        // Build an array of ajax promise objects and wait for them to finish
        var requests = [];
        for (var key in this.cache.series) {
            var series = this.cache.get(key);
            
            if (series instanceof FixedIntervalPowerSeries) {
            	// Always initialize meta data for fixed interval feeds, to enable all load
            	// requests to be aligned with the interval, to improve performance
            	requests.push(series.loadMeta(undefined, true));
            }
        }

        var self = this;
        $.when.apply($, requests).done(function() {

        	requests = [];
            for (var key in self.cache.series) {
                var series = self.cache.get(key);
                
                if (series instanceof FixedIntervalPowerSeries ||
                		series instanceof IntermittentPowerSeries) {
                	
                	requests.push(series.load(start, end, interval));
                }
            }
            $.when.apply($, requests).done(function() {

                // Callback the PowerData list with all newly fetched data series
                callback(self.cache);
            });
        });
    },
    
    loadDailyEnergy: function(start, end, callback) {
        
        // Build an array of ajax promise objects and wait for them to finish
        var requests = [];
        for (var key in this.cache.series) {
            var series = this.cache.get(key);
            
            if (series instanceof FixedIntervalEnergySeries ||
                    series instanceof IntermittentEnergySeries) {
                // Initialize the feeds earliest data, to enable verifications for consumption intervals
                requests.push(series.loadEarliest(undefined, true));
                requests.push(series.loadDaily(start, end));
            }
        }
        
        var self = this;
        $.when.apply($, requests).done(function() {

            // Callback the PowerData list with all newly fetched data series
            callback(self.cache);
        });
    },
    
    update: function(callback, updatePowerSeries) {
        var self = this;
        return this.feed.getListById(function(result) {

            for (var key in self.cache.series) {
                var series = self.cache.get(key);
                var feed = result[series.id];
                
                if (feed.value != null) {
                    // Update the latest cached time value
                    // and append latest power values to the series data cache, if the passed flag indicates it
                    series.latest = [feed.time*1000, feed.value];
                    
                    if (updatePowerSeries != null && updatePowerSeries &&
                            (series instanceof FixedIntervalPowerSeries ||
                            series instanceof IntermittentPowerSeries)) {
                        
                        series.append();
                        
                        // If the cache exceeds the specified datapoint limit, trim the first value
                        if (series.getLength() > self.datapointsLimit) {
                            series.trim();
                        }
                    }
                }
            }
            
            // Callback the updated PowerData list
            callback(self.cache);
        });
    }
}

class DataCollection {
    
    constructor(series) {
        this.series = series;
    }
    
    get(key) {
        if (this.series[key] != undefined) {
            return this.series[key];
        }
        else console.log("ERROR", "Unknown key \""+key+"\" to get data series");
    }
    
    getData(key) {
        if (this.get(key) != null) {
            return this.get(key).data;
        }
        else return [];
    }
    
    getLength(key) {
        if (this.get(key) != null) {
            return this.get(key).data.length;
        }
        else return null;
    }
    
    getLatestTime(key) {
        if (this.get(key) != null && this.get(key).latest != null) {
            return this.get(key).latest[0];
        }
        return null;
    }
    
    getLatestValue(key) {
        if (this.get(key) != null && this.get(key).latest != null) {
            return this.get(key).latest[1];
        }
        return null;
    }
    
    getEarliestTime(key) {
        if (this.get(key) != null) {
            if (this.get(key).earliest == null) {
            	this.get(key).loadEarliest();
            }
            return this.get(key).earliest[0];
        }
        else return null;
    }
    
    getEarliestValue(key) {
        if (this.get(key) != null) {
            if (this.get(key).earliest == null) {
            	this.get(key).loadEarliest();
            }
            return this.get(key).earliest[1];
        }
        else return null;
    }
    
    iterateDailyEnergy(start, end) {
    	// Each iteration will return the energy value of all configured feeds for a specific day
    	// for the passed time interval
        var interval = 86400000;
        var now = new Date();
        now.setHours(0,0,0,0);
        
        var self = this;
        var iterator = {};
        iterator[Symbol.iterator] = function *() {
        	// The index object is used to remember the position of the last correctly aligned
        	// time value. As the time values will never decrease with increasing index, this 
        	// enables to only loop each feeds data array once in total, while aligning the data
        	// of all available feeds
            var index = {};
            var time = start;
            while (time <= end) {
                var day = {};
                day['time'] = time;

                // Iterate all configured energy data series and treat missing days as zero energy
                for (var key in self.series) {
                    var series = self.get(key);
                    if (series instanceof FixedIntervalEnergySeries ||
                            series instanceof IntermittentEnergySeries) {
                        
                        if (index[key] == undefined) index[key] = 0;
                        
                        day[key] = series.iterateDay(time, now.getTime(), index);
                    }
                }
                yield day;

                time += interval;
            }
        }
        return iterator;
    }
}

class Series {

    constructor(key, id, engine, feed) {
        this.feed = feed;
        this.key = key;
        this.id = id;
        this.engine = engine;

        this.interval = 0;
        this.earliest = null;
        this.latest = null;
        this.data = [];
    }
    
    getLength() {
        return this.data.length;
    }
    
    getLatestTime() {
        if (this.latest != null) {
            return this.latest[0];
        }
        return null;
    }
    
    getLatestValue() {
        if (this.latest != null) {
            return this.latest[1];
        }
        return null;
    }
    
    getEarliestTime() {
        if (this.earliest == null) {
            this.loadEarliest();
        }
        return this.earliest[0];
    }
    
    getEarliestValue() {
        if (this.earliest == null) {
            this.loadEarliest();
        }
        return this.earliest[1];
    }
}

class FixedIntervalSeries extends Series {

    constructor(key, id, engine, feed) {
        super(key, id, engine, feed);
        
        this.meta = null;
    }

    getTimevalue(time, callback) {
    	// If the meta data is already initialized, align the requested time with the feeds meta data
    	if (this.meta != null) {
        	var metaIntervalMillis = this.meta.interval*1000;
        	var metaStartMillis = this.meta.start_time*1000;

    		if (time >= metaStartMillis) {
                time = metaStartMillis + Math.round((time - metaStartMillis)/metaIntervalMillis)*metaIntervalMillis;
    		}
    		else return null;
    	}
    	
        // TODO: Check if the value maybe is hold in cache
        return this.feed.getValue(this.id, time, callback);
    }

    load(start, end, interval) {
    	// Align the interval, start and stop times with the feeds meta data
    	if (interval > this.meta.interval) {
    		interval = Math.ceil(interval/this.meta.interval)*this.meta.interval;
    	}
    	else {
        	interval = this.meta.interval;
    	}
    	var intervalMillis = interval*1000;
        
    	var metaStartMillis = this.meta.start_time*1000;
    	if (start >= metaStartMillis) {
            start = metaStartMillis + Math.ceil((start - metaStartMillis)/intervalMillis)*intervalMillis;
    	}
    	else {
    		start = metaStartMillis;
    	}
    	
    	if (end >= metaStartMillis) {
    		end = metaStartMillis + Math.floor((end - metaStartMillis)/intervalMillis)*intervalMillis;
            
            // Only reload, if the requested interval is not already hold in cache
            if (this.data.length < 1 ||
                    start <= (this.data[0][0] - intervalMillis) || 
                    end >= (this.latest[0] + intervalMillis) ||
                    this.interval < intervalMillis) {
                
                this.interval = intervalMillis;
                
                var self = this;
                return this.feed.getData(this.id, start, end, interval, true, true, function(result) {
                    self.data = result;
                    self.latest = result[result.length-1];
                });
            }
    	}
    	else {
    		this.data = [];
    		this.latest = null;
    	}
    }

    loadEarliest(callback, async) {
        // For fixed interval feeds, this information is held in its meta data
        if (this.earliest == null) {
            if (typeof callback == 'function' || async) {
                var self = this;
                return this.loadMeta(function(result) {
                    
                    var earliestTime = self.meta.start_time*1000;
                    var earliestValue = self.getTimevalue(earliestTime);
                    self.earliest = [earliestTime, earliestValue];
                    
                    if (typeof callback == 'function') {
                        callback(self.earliest);
                    }
                });
            }
            else {
                this.loadMeta();
                var earliestTime = this.meta.start_time*1000;
                this.earliest = this.getTimevalue(earliestTime);
            }
        }
    }
    
    loadMeta(callback, async) {
        if (this.meta == null) {
            if (typeof callback == 'function' || async) {
                var self = this;
                return this.feed.getMeta(this.id, function(result) {
                    self.meta = result;
                    
                    if (typeof callback == 'function') {
                        callback(result);
                    }
                });
            }
            else {
                this.meta = this.feed.getMeta(this.id);
            }
        }
    }
}

class IntermittentSeries extends Series {

    getTimevalue(time, callback) {
        // TODO: Check if the value maybe is hold in cache
        return this.feed.getValue(this.id, time, callback);
    }
    
    load(start, end, interval) {
        var intervalMillis = interval*1000;
        
        // Only reload, if the requested interval is not already hold in cache
        if (this.data.length < 1 ||
                start <= (this.data[0][0] - intervalMillis) || 
                end >= (this.latest[0] + intervalMillis) ||
                this.interval < intervalMillis) {
            
            this.interval = intervalMillis;
            
            var self = this;
            return this.feed.getData(this.id, start, end, interval, true, true, function(result) {
                self.data = result;
                self.latest = result[result.length-1];
            });
        }
    }
    
    loadEarliest(callback, async) {
        // For intermittent feeds like for the PHPTimeseries engine, the closest value to 0
        // will be returned as the earliest time value
        if (this.earliest == null) {
            if (typeof callback == 'function' || async) {
                var self = this;
                return this.getTimevalue(0, function(result) {
                    self.earliest = result;

                    if (typeof callback == 'function') {
                        callback(self.earliest);
                    }
                });
            }
            else {
                this.earliest = this.getTimevalue(0);
            }
        }
    }
}

class FixedIntervalPowerSeries extends FixedIntervalSeries {
    
    append() {
        if (this.data.length > 0 && this.interval > 0) {
            var timeDelta = this.latest[0] - this.data[this.data.length-1][0];
            if (timeDelta == this.interval) {
                this.data.push(this.latest);
                
                console.log("Appending value to power series \""+this.key+"\": "+this.latest[1]);
            }
        }
        else {
            this.data = [];
            this.data.push(this.latest);
        }
    }
    
    trim() {
        // The shift() method removes the first item of an array, and returns that item
        this.data.shift();
    }
}

class IntermittentPowerSeries extends IntermittentSeries {
    
    append() {
        if (this.data.length > 0) {
            var timeDelta = this.latest[0] - this.data[this.data.length-1][0];
            if (timeDelta >= this.interval) {
                this.data.push(this.latest);
                
                console.log("Appending value to power series \""+this.key+"\": "+this.latest[1]);
            }
        }
        else {
            this.data.push(this.latest);
        }
    }
    
    trim() {
        // The shift() method removes the first item of an array, and returns that item
        this.data.shift();
    }
}

class FixedIntervalEnergySeries extends FixedIntervalSeries {
    
    loadDaily(start, end) {
        // only reload, if the requested interval is not already hold in cache
        if (this.data.length < 1 || start < this.data[0][0] || end > this.latest[0]) {
            var self = this;
            return this.feed.getDailyData(this.id, start, end, function(result) {
                self.data = result;
            });
        }
    }
    
    iterateDay(time, timeNow, indices) {
        var index = indices[this.key];
        var result = 0;
        
        for (var i=index; i<this.data.length; i++) {
            if (this.data[i][1] != null && this.data[i][0] == time) {
                index = i;
                break;
            }
        }
        indices[this.key] = index;
        
        if (typeof this.data[index] != undefined) {
            // Calculate the daily totals by subtracting each day from the upcoming day
            if (index < this.data.length-1 && this.data[index+1][1] != null) {
                result = this.data[index+1][1] - this.data[index][1];
            }
            else if (time == timeNow) {
                // last day in kwh data matches start of today from the browser's perspective
                // which means its safe to append today kwh value
                if (this.latest != null) {
                    result = this.latest[1] - this.data[index][1];
                }
            }
        }
        
        return result;
    }
}

class IntermittentEnergySeries extends IntermittentSeries {

    constructor(key, id, engine, feed) {
        super(key, id, engine, feed);

        // Use a 5 minute tolerance around midnight, for received values to be accepted
        this.tolerance = 300000;
    }
    
    loadDaily(start, end) {
        var interval = 86400000 + this.tolerance;
        
        // only reload, if the requested interval is not already hold in cache
        if (this.data.length < 1 ||
                start <= (this.data[0][0] - interval) || 
                end >= (this.latest[0] + interval)) {
            
            var self = this;
            return this.feed.getDailyData(this.id, start, end, function(result) {
                self.data = result;
            });
        }
    }

    iterateDay(time, timeNow, indices) {
        var interval = 86400000 + this.tolerance;
        var index = indices[this.key];
        var result = 0;
        
        for (var i=index; i<this.data.length; i++) {
            if (this.data[i][1] != null) {
                var deltaThis = Math.abs(time - this.data[i][0]);
                var deltaLast = Math.abs(time - this.data[index][0]);
                
                if (deltaThis > deltaLast) {
                    break;
                }
                else if (deltaThis <= deltaLast) {
                    index = i;
                }
            }
        }
        indices[this.key] = index;
        
        // Calculate the daily totals by subtracting each day from the upcoming day
        if (index < this.data.length-1 && 
                this.data[index+1][1] != null &&
                Math.abs(time - this.data[index][0]) < interval &&
                Math.abs(this.data[index+1][0] - this.data[index][0]) <= interval) {
            
            result = this.data[index+1][1] - this.data[index][1];
        }
        else if (time == timeNow) {
            // last day in kwh data matches start of today from the browser's perspective
            // which means its safe to append today kwh value
            if (this.latest != null) {
                result = this.latest[1] - this.data[index][1];
            }
        }
        
        return result;
    }
}
