// Streamgraph dimensions
var w = 1000, h = 500;
var myBarChart;		
var colorRangeTmp = ['red', 'yellow', 'blue', 'green', 'orange', 'brown'];			
var mySettings = {};

var format = d3.time.format("%B, %d");		
var totalFormat = d3.format(',')
var current_date = new Date();
var logscale;
var buffer_mms, all_played_tokens = [];

var FREQ_UPDATE = 15;
var IS_PLAYING = true;
var TOTAL_TIME = 0;

d3.json("dataset.php", function(datamms) {
	buffer_mms = datamms;

	var max_val = d3.max(buffer_mms.stream, function(b) { return d3.max(b, function(c) { return c.value} ) });

	var max_tweet_per_interval = d3.sum(buffer_mms.stream, function(b) { return d3.max(b, function(c) { return c.value} ) });

	var max_tweets_day = 0;
	for(var s=0; s<buffer_mms.stream[1].length; s++) {
		var tmp_max = 0;
		for(var t=0; t<colorRangeTmp.length; t++) {
			tmp_max+=buffer_mms.stream[t*2+1][s].value;
		}
		max_tweets_day = Math.max(max_tweets_day, tmp_max);
	}


	var junct_scale = d3.scale.linear()
		.range([0, max_tweets_day])
		.domain([0, 500]);



	var min_time = d3.min(buffer_mms.stream[1], function(d) {return d.time_day;})
	var max_time = d3.max(buffer_mms.stream[1], function(d) {return d.time_day;})

	// Scaling data for streamgraph
	logscale = d3.scale.pow().exponent(.7).domain([0,max_val]).range([0,max_val*100000000]);

	function tweetRefresh(once) {

		if(typeof once == "undefined")
			once = false

		d3.select("#nb_tokens_left").text(buffer_mms.tokens.length);
		d3.select("#next_update_time").text(FREQ_UPDATE-TOTAL_TIME%FREQ_UPDATE);
		d3.select("#total_mms").text(totalFormat(buffer_mms.total_mms));


			// If we've been waiting for more than 60 seconds
			if(TOTAL_TIME%FREQ_UPDATE==0 || once) {
				// updates strata
				d3.json("dataset.php", function(newdata) {

					mySettings.data.strata = buffer_mms.strata;
					myBarChart.strata.update(myBarChart);

					var list_new_tokens = [];
					// bufferize newly fetched data
					for(var t=0; t<newdata.tokens.length; t++) {

						var is_new_token = true;
						for(var u=0; u<buffer_mms.tokens.length; u++) {
		
							if(buffer_mms.tokens[u].id == newdata.tokens[t].id)
								is_new_token = false;
						}

						for(var u=0; u<all_played_tokens.length; u++) {
		
							if(all_played_tokens[u].id == newdata.tokens[t].id)
								is_new_token = false;
						}
						

						if(is_new_token) {
							list_new_tokens.push(newdata.tokens[t])
						}

					}

					var buffer_empty = false;
					if(buffer_mms.tokens.length==0)
						buffer_empty = true;
					// Merge the old and new tokens
					for(t=0; t<list_new_tokens.length; t++) {
						buffer_mms.tokens.push(list_new_tokens[t])
					}

					if(buffer_empty)
						display_tweets(buffer_mms.tokens.shift())

					console.log("UPDATED with "+list_new_tokens.length+"/"+newdata.tokens.length+"/"+buffer_mms.tokens.length)
					
					if(myBarChart.selectAll().length>50) {

			//		if(myBarChart.selectAll()length>)
					// FLOCCLATE AFTER 5 MINUTES
						var time_5min_ago = new Date() - 5 * 60 * 1000;  
						for(var c=0; c<myBarChart.settings.data.model.length; c++) {
							var tks = myBarChart.selectAll("category", c);
							for(var t=0; t<tks.length; t++) {
								if(tks[t].attr("t") < time_5min_ago)
									tks[t].flocculate();
							}
						}
					}
				});
			}
	}

	d3.select("#btn-refresh").on("click", function() { tweetRefresh(true)})

  var sp = new StreamPlayer('simple-stream-player', {
      auto_start: true,
      current_time: function() {  

      },
      current_speed: 2000,
      current_step: 100000,
      max_time: 0,
      updateCallback: function() {

      	var time_5min_ago = new Date() - 5 * 60 * 1000;  

				transition_round(1000, 500);
				d3.select("#current_time").text(new Date());

      },
      playCallback: function() {
        d3.select("#btn-playpause").classed("active", false);
        transition_round(0, 500);
      },
      pauseCallback: function() {
        d3.select("#btn-playpause").classed("active", true);
      },
      nextCallback: function(self) {
      	tweetRefresh();
      	if(buffer_mms)
				transition_round(100, 100);
        // TODO: skip transition
      },
      soundCallback: function() {PLAY_SOUND = !PLAY_SOUND;}
    });

		// Display the first M&M's
		if(buffer_mms.tokens.length>0) {
			display_tweets(buffer_mms.tokens.shift())
		}

		// Continuous refresh that never stops
		setInterval(function() {
			  TOTAL_TIME++;
			  tweetRefresh();
			}, 1000)
        
 	 	mySettings = {
      width:600,
      height:400,
      data:{
            "model":
                    [
                      {label:"Column A"},
                      {label:"Column B"},
                      {label:"Column C"},
                      {label:"Column A"},
                      {label:"Column B"},
                      {label:"Column C"}
                    ],
            "strata": buffer_mms.strata,
          stream:{
                  provider:'direct'
            },
          },
      sedimentation:{
        token:{
          size:{original:6,minimum:2}
        },
        aggregation:{height:100},
        suspension:{
          decay:{power:1}
        }
      },
      options:{
        layout:false,
              canvasFirst:false
      },
      chart:{
      	      width:500,
      height:400

      }
    }

	myBarChart = $("#sediviz").vs(mySettings).data('visualSedimentation');

	myBarChart.strata.update(myBarChart);
	var n = 13,//datamms.stream[0].length+1, //20, // number of layers
			m = buffer_mms.stream[1].length, // number of samples per layer
			data0 = d3.layout.stack().offset("silhouette")(stream_waves(n, m)),
			data1 = d3.layout.stack().offset("silhouette")(stream_waves(n, m));

	var mx = m - 1,
	my = d3.max(data0.concat(data1), function(d) {
		return d3.max(d, function(d) {
			return d.y0 + d.y;
		});
	});

	var area = d3.svg.area()
			.x(function(d) { return d.x * w / mx; })
			.y0(function(d) { return h - d.y0 * h / my; })
			.y1(function(d) { return h - (d.y + d.y0) * h / my; })
			.interpolate("basis");

var rulestoday = d3.select("svg").append("g");

rulestoday.append("text")
  .attr("x", 530)
  .attr("y", 320)
 	.attr("class", "ruletoday")
  .style("color", "gray")
  .attr("text-anchor", "middle")
  .text("TODAY")

rulestoday.append("text")
  .attr("x", 530)
  .attr("y", 340)
 	.attr("class", "ruletoday")
  .style("color", "gray")
  .attr("text-anchor", "middle")
  .text(function() {
		
		return format(new Date());

  })

	var vis = d3.select("#streamchart")
		.append("svg")
		.attr("width", 600)
		.attr("height", h*2)
		.append("g")
			.attr("transform", "rotate(90)translate(0,-500)");

	vis.selectAll("path")
		.data(data0)
			.enter().append("path")
			.style("fill", function(d, i) {
				if(i%2==0) { // for in between streams (equivalent to bar's intervals)
					return "white"; 
				} else {

					if(mySettings.data.strata[(i-1)/2][2].texture!=null) {
							return "url(#RectanglePattern_"+((i-1)/2)+"_0)"; // 0 for small patterns
					} else {
							return colorRangeTmp[Math.floor((i-1)/2)]; 
					}				
				}
			})
			.attr("class", function(d,i) { 
				return "streamgraph "+"pStream_"+i;
			})
			.attr("d", area)
			.on("mouseover", function(d,i) {
					d3.selectAll("path").style("opacity", 0.4); 
					d3.select(this).style("opacity", 1);
					d3.selectAll(".col_"+Math.floor((i-1)/2)).style("opacity", 1);

					for(var c=0; c<myBarChart.settings.data.model.length; c++) {
						var tks = myBarChart.selectAll("category", c);

						if(c!=(i-1)/2) {
							for(var t=0; t<tks.length; t++) {
									// remove texture
 									// tks[t].attr("fillStyle", "rgba(255,0,0,.9)");
									// tks[t].attr("texture", {'src':'img/redmms20.jpg'});
							}
						}
					}

			})
			.on("mouseout", function(d,i) {
				d3.selectAll("path").style("opacity", 1); 
			})          
			.on("click", function(d) {
				//transition();
			});

		d3.selectAll(".gcol")
			.on("mouseover", function(d,i) {
				d3.selectAll("path").style("opacity", 0.4); 
				d3.selectAll(".pStream_"+Math.floor((i/2+1))).style("opacity", 1);
				d3.selectAll(".col_"+Math.floor((i/4))).style("opacity", 1);
			})			
			.on("mouseout", function(d,i) {
				d3.selectAll("path").style("opacity", 1); 
			})    


var y = d3.scale.linear()
	.range([0, h - 40])
	.domain([0, 150]);

var x = d3.scale.linear()
				.range([0, w])
				.domain([0, 105]);	

var rules = vis.append("g");


/*
var rulestoday = rules.selectAll(".ruletoday")
		.data(y.ticks(1))
	.enter().append("g")
	.attr("transform", function(d) { return "translate(" + x(d) + ", 0)"; }).append("text")
  .attr("x", 6)
  .attr("y", -200)
 	.attr("class", "ruletoday")
  .attr("transform", "rotate(270)")
  .style("color", "gray")
  .text("TODAY")
*/

rules = rules.selectAll(".rule")
		.data(y.ticks(60))
			.enter().append("g")
			.attr("class", "rule")
			.attr("transform", function(d) { return "translate(" + x(d) + ", 0)"; });

rules.append("text")
  .attr("x", 6)
  .attr("dy", "2.5em")
  .attr("transform", "rotate(270)")
  .style("color", "gray")
  .text(function(d, i) { 
		 if(i==1) {
			return "Yesterday";
		} else if(i>0) {
			var this_date = current_date;

			var dt = new Date();
			dt.setDate(dt.getDate() - i);

			//this_date = new Date().getTime() - i * 8 * 60 * 60 * 1000//this_date.setDate(this_date.getDate()-1))
 
			if(i%5==0)
				return format(dt); //this_date.format("dddd, mmmm dS, yyyy, h:MM:ss TT");//; // date
			else
				return "";
		} else
			return "";
	});
			
rules.filter(function(d,i) {
	if(i%2==0) return d;
	}).append("line")
  .attr("y2", w);


	var max = [];
	max[0] = d3.max(buffer_mms.stream[0], function(v) { return v.value; });

	function stream_waves(n, m) {
		return d3.range(n).map(function(i) {
			return d3.range(m).map(function(j) {
				if(j==0 || j==1 || j==2) {
					if(i==0 || i==12) {
						return logscale(junct_scale(3)/2);//logscale(max_val)/3;
					} else if(i%2==1) {
						return logscale(junct_scale(60));//logscale(max_val)/3;
					} else {
						return logscale(junct_scale(4));
					}
				}
				if(i%2==1) {
					return logscale(buffer_mms.stream[i][j].value);     
				} else {
					return 0;
				}
			}).map(stream_index);
		});
	}

	function stream_index(d, i) {
		return {x: i, y: Math.max(0, d)};
	}

});
