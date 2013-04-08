
var width = 800,
    height = 250,
    height2 = 150;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

function move_rect() {

  var nx = d3.event.x;
  if (nx<0 || nx>width) 
    return;

  d3.select(this).attr("width", d3.event.x);
  set_current_time(new Date(x.invert(d3.event.x)).getTime());
  sp.updateCallback(true);
}

var chart_distribution = function(data) {

  var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x2(d.date); })
      .y0(height2)
      .y1(function(d) { return y2(d.price); });

  var svg = d3.select("#distribution").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  var context = svg.append("g")
        .attr("transform", "translate(0,10)");

  // Histogram to show distribution		
  var distribution = [];
  var nb_step = 200;
  var time_step = (max_time - min_time) / nb_step;

  for(i=0; i<nb_step; i++) {
  	distribution[i]={};
    distribution[i].date = new Date(min_time+i*time_step);
  	distribution[i].price = 0;
  }
  	
  entries.map(function (d) {

  	var t = Math.floor((Date.parse(d3.select(d).select("date")[0][0].textContent)-min_time)/time_step);

  	if(typeof(distribution[t]) == 'undefined') {
  		distribution[t] = {}
  		distribution[t].price = 0;
  	}
  	distribution[t].price++;
  	distribution[t].date = new Date(d3.select(d).select("date")[0][0].textContent);
  });

  x.domain(d3.extent(distribution.map(function(d) { return d.date; })));
  y.domain([0, d3.max(distribution.map(function(d) { return d.price; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  context.append("path")
      .datum(distribution)
      .attr("d", area);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("rect")
        .attr("class", "window")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height2)
        .attr("width", 1)
        .attr("pointer-events", "all")
        .attr("cursor", "ew-resize")
        .call(d3.behavior.drag().on("drag", move_rect));

  context.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .style("font-size", "11px")
        .attr("id", "current_time");

  context.append("line")
        .attr("x", 0)
        .attr("y", 30)
        .attr("id", "relative_time");

  context.append("line")
         .attr("x1", "763px")
         .attr("x2", "763px")
         .attr("y1", "0px")
         .attr("y2", "150px")
         .style("stroke-dasharray", "5, 2")
         .style("stroke-width", "1")
         .attr("class", "top")
         .style("opacity", .2)
         .style("stroke", "black");

  context.append("text")
        .attr("x", "763px")
        .attr("y", "-2px")
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .text("Deadline");

}