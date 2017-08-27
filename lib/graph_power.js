var powerGraph = {

    element: false,
    ctx: false,
    
    // Pixel width and height of graph
    width: 200,
    height: 200,
    
    draw: function(element, series, start, end) {
    
        // Initialise the canvas get context
        if (!ctx) {
            this.element = element;
            var c = document.getElementById(element);  
            this.ctx = c.getContext("2d");
        }
        var ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0,0,this.width,this.height);
        
        // graph area is inset by 1 pixel on each edge so that axes 
        // line width is shown fully - otherwise axes appears thin
        var graph_left = 1;
        var graph_top = 1;
        var graph_width = this.width - (graph_left*2);
        var graph_height = this.height - (graph_top*2);
        
        // find out max and min values of data
        var xmin = undefined;
        var xmax = undefined;
        var ymin = undefined;
        var ymax = undefined;
        
        for (s in series) {
            var data = series[s].data;
            
            for (z in data) {
                if (xmin == undefined) xmin = data[z][0];
                if (xmax == undefined) xmax = data[z][0];
                if (ymin == undefined) ymin = data[z][1];
                if (ymax == undefined) ymax = data[z][1];
                            
                if (data[z][1] > ymax) ymax = data[z][1];
                if (data[z][1] < ymin) ymin = data[z][1];
                if (data[z][0] > xmax) xmax = data[z][0];
                if (data[z][0] < xmin) xmin = data[z][0];               
            }
        }
        // var r = (ymax - ymin);
        // ymin = (ymin + (r / 2)) - (r/1.5);
        // ymax = (ymax - (r / 2)) + (r/1.5);
        
        var ytick_major = Math.round(ymax*0.2);
        if (ytick_major < 200) ytick_major = 100;
        else if (ytick_major < 400) ytick_major = 250;
        else if (ytick_major < 750) ytick_major = 500;
        else if (ytick_major < 1500) ytick_major = 1000;
        else if (ytick_major < 2500) ytick_major = 2000;
        else if (ytick_major < 3500) ytick_major = 3000;
        else if (ytick_major < 4500) ytick_major = 4000;
        else if (ytick_major < 5500) ytick_major = 5000;
        else if (ytick_major < 6500) ytick_major = 6000;
        else if (ytick_major < 7500) ytick_major = 7000;
        else if (ytick_major < 8500) ytick_major = 8000;
        else if (ytick_major < 9500) ytick_major = 9000;
        else if (ytick_major < 10500) ytick_major = 10000;
        else if (ytick_major < 20500) ytick_major = 20000;
        else if (ytick_major < 30500) ytick_major = 30000;
        else if (ytick_major < 40500) ytick_major = 40000;
        else if (ytick_major < 50500) ytick_major = 50000;
        else if (ytick_major < 60500) ytick_major = 60000;
        else if (ytick_major < 70500) ytick_major = 70000;
        else if (ytick_major < 80500) ytick_major = 80000;
        else if (ytick_major < 90500) ytick_major = 90000;
        else ytick_major = 100000;
        var ytick_minor = ytick_major/4;
        //console.log("Line graph y-axis: max "+ymax+", min "+ymin+", tick "+ytick_minor);
        
        // adjust for large values and corresponding y-axis properties
        var ytitle = 'Power';
        var yunit;
        var scale;
        if (ymax < 10000) {
        	ytitle += ' (Watts)';
        	yunit = 'W';
        	scale = 1;
        }
        else {
        	ytitle += ' (Kilowatts)';
        	yunit = 'kW';
        	scale = 0.001;
            
        	ymax = ymax*scale;
        	ytick_major = ytick_major*scale;
            ytick_minor = ytick_major/4;
        }
        ymax = Math.ceil(ymax/ytick_major)*ytick_major;
        ymin = 0;
        
        for (s in series) {
            ctx.strokeStyle = series[s].color;
            ctx.fillStyle = series[s].color;
            
            var data = series[s].data; 
            ctx.beginPath();
            for (z in data) {
                if (data[z][1] != null) {
                    var x = ((data[z][0] - xmin) / (xmax - xmin)) * graph_width;
                    var y = graph_height - (((data[z][1]*scale - ymin) / (ymax - ymin)) * graph_height);
                    if (z==0) 
                        ctx.moveTo(graph_left+x, graph_top+y); 
                    else 
                        ctx.lineTo(graph_left+x, graph_top+y);
                }
            }
            ctx.stroke();
            
            var y = graph_height - (((ymin - ymin) / (ymax - ymin)) * graph_height);
            ctx.lineTo(graph_left+x, graph_top+y);
            var x = ((xmin - xmin) / (xmax - xmin)) * graph_width;
            ctx.lineTo(graph_left+x, graph_top+y);
            
            ctx.fill();
        }
        
        ctx.beginPath();
        
        // ------------------------------------------------------------------------
        // Axes and min/majour divisions
        // ------------------------------------------------------------------------
        ctx.textAlign = "left";
        ctx.font = "12px arial";
        ctx.strokeStyle = "#0699fa";
        ctx.fillStyle = "#0699fa";
        
        ctx.fillText(ytitle, graph_left+4, 15);
        
        // x-axis
        var xtick_major;
        var windowhours = Math.round((end - start)/3600000);
        if (windowhours <= 12) {
            xtick_major = 1*3600*1000;
        }
        else if (windowhours <= 24) {
            xtick_major = 2*3600*1000;
        }
        else if (windowhours <= 24*7) {
            xtick_major = 24*3600*1000;
        }
        else {
            xtick_major = 30*24*3600*1000;
        }
        var xtick_minor = xtick_major/4;
        
        xmin = Math.floor(xmin/xtick_minor)*xtick_minor;
        var xtick = xmin;
        
        ctx.beginPath();
        while(xtick < xmax) {
            xtick += xtick_minor;
            var x = ((xtick- xmin) / (xmax - xmin)) * graph_width;
            
            var date = new Date(xtick);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if (minutes < 10) minutes = "0"+minutes;
            
            if (date % xtick_major == 0) {
                ctx.fillText(hours+":"+minutes, graph_left+x+4, graph_top+graph_height-5);
                ctx.moveTo(graph_left+x, graph_top+graph_height-0);
                ctx.lineTo(graph_left+x, graph_top+graph_height-18);
            } else {
                ctx.moveTo(graph_left+x, graph_top+graph_height-0);
                ctx.lineTo(graph_left+x, graph_top+graph_height-5);
            }
        }
        ctx.stroke();
        
        // y-axis
        ctx.beginPath();
        
        var ytick = 0;
        while(ytick < ymax) {
            ytick += ytick_minor;
            var y = this.height - (((ytick - ymin) / (ymax - ymin)) * this.height);
            
            if (ytick % ytick_major == 0) {
                ctx.fillText(ytick+yunit, graph_left+4, graph_top+y-5);
                ctx.moveTo(graph_left, graph_top+y);
                ctx.lineTo(graph_left+20, graph_top+y);
            } else {
                ctx.moveTo(graph_left, graph_top+y);
                ctx.lineTo(graph_left+5, graph_top+y);
            }
        }
        ctx.stroke();
        
        // Axes
        ctx.beginPath();
        // x-axis
        ctx.moveTo(graph_left, graph_top+graph_height);
        ctx.lineTo(graph_left+graph_width, graph_top+graph_height);
        // y-axis
        ctx.moveTo(graph_left, graph_top+graph_height);
        ctx.lineTo(graph_left, graph_top);
        ctx.stroke();
        
        ctx.beginPath();
    }
};
