var lineGraph = {

    element: false,
    ctx: false,
    
    // Pixel width and height of graph
    width: 200,
    height: 200,
    
    draw: function(element, series, options) {
    
        // Initialise the canvas get context
        if (!ctx) 
        {
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
        
        for (s in series)
        {
            var data = series[s].data;
            for (z in data)
            {
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
        
        var ytick = Math.round((ymax) * 0.2);
        if (ytick < 200) ytick = 100;
        else if (ytick < 400) ytick = 250;
        else if (ytick < 750) ytick = 500;
        else if (ytick < 1500) ytick = 1000;
        else if (ytick < 2500) ytick = 2000;
        else if (ytick < 3500) ytick = 3000;
        else if (ytick < 4500) ytick = 4000;
        else if (ytick < 5500) ytick = 5000;
        else if (ytick < 6500) ytick = 6000;
        else if (ytick < 7500) ytick = 7000;
        else if (ytick < 8500) ytick = 8000;
        else if (ytick < 9500) ytick = 9000;
        else if (ytick < 10500) ytick = 10000;
        else if (ytick < 20500) ytick = 20000;
        else if (ytick < 30500) ytick = 30000;
        else if (ytick < 40500) ytick = 40000;
        else if (ytick < 50500) ytick = 50000;
        else if (ytick < 60500) ytick = 60000;
        else if (ytick < 70500) ytick = 70000;
        else if (ytick < 80500) ytick = 80000;
        else if (ytick < 90500) ytick = 90000;
        else ytick = 100000;
        
        options.yaxis.major_tick = ytick;
        options.yaxis.minor_tick = ytick * 0.25;
        
        console.log("Line graph y-axis: max "+ymax+", min "+ymin+", tick "+options.yaxis.major_tick);
        
        ymax = Math.ceil(ymax / options.yaxis.major_tick) * options.yaxis.major_tick;
        ymin = 0;
        
        for (s in series)
        {
            ctx.strokeStyle = series[s].color;
            ctx.fillStyle = series[s].color;
            
            var data = series[s].data; 
            ctx.beginPath();
            for (z in data)
            {
                if (data[z][1] != null) {
                    var x = ((data[z][0] - xmin) / (xmax - xmin)) * graph_width;
                    var y = graph_height - (((data[z][1] - ymin) / (ymax - ymin)) * graph_height);
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
        ctx.textAlign    = "left";
        ctx.font = options.axes.font;
        ctx.fillStyle = options.axes.color;
        ctx.strokeStyle = options.axes.color;
        
        ctx.fillText(options.yaxis.title, graph_left+4, 15);
        
        // X-AXES
        xmin = Math.floor(xmin / options.xaxis.minor_tick)*options.xaxis.minor_tick;
        var xtick = xmin;
        
        ctx.beginPath();
        while(xtick < xmax) {
            xtick += options.xaxis.minor_tick;
            var x = ((xtick- xmin) / (xmax - xmin)) * graph_width;
            
            var date = new Date(xtick);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if (minutes < 10) minutes = "0"+minutes;
            
            if (date % options.xaxis.major_tick == 0) {
                ctx.fillText(hours+":"+minutes, graph_left+x+4, graph_top+graph_height-5);
                ctx.moveTo(graph_left+x, graph_top+graph_height-0);
                ctx.lineTo(graph_left+x, graph_top+graph_height-18);
            } else {
                ctx.moveTo(graph_left+x, graph_top+graph_height-0);
                ctx.lineTo(graph_left+x, graph_top+graph_height-5);
            }
        }
        ctx.stroke();
        
        // Y-AXES
        ctx.beginPath();
        
        var ytick = 0;
        while(ytick < ymax) {
            ytick += options.yaxis.minor_tick;
            var y = this.height - (((ytick - ymin) / (ymax - ymin)) * this.height);
            
            if (ytick % options.yaxis.major_tick == 0) {
                ctx.fillText(ytick+options.yaxis.units, graph_left+4, graph_top+y-5);
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
