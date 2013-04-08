// Tokens legend
var tlegend = d3.select("#caption").append("svg").attr("width", "250px").attr("height", "200px");

var tEnter = tlegend.selectAll("circle").data([2,20]).enter();

tEnter.append("circle")
	.attr("cx", 30).attr("cy", function(d) {return 100-d}).attr("r", String)
	.style("fill","none").style("stroke-width",2).style("stroke", "#ccc").style("stroke-dasharray","1 1")

 tEnter.append("line")
  .attr("x1", 30).attr("x2", 70)
  .attr("y1", function(d) {return 100-d*2}).attr("y2", function(d) {return 100-d*2})
  .style("fill","none").style("stroke-width",.5).style("stroke", "#000")

 tEnter.append("text")
  .attr("x", 70).attr("y", function(d) {return 100-d*2}).text(function(d,i) { 
    if(i==0) return 1 + " file is modified";
    else
      return 80+ " files are modified";
  })

  tlegend.append("circle").attr("cx", 30).attr("cy", 20).attr("r", 5)
    .style("fill","none").style("stroke-width",1).style("stroke", "#ccc")//.style("stroke-dasharray","1 1")

 tlegend.append("line")
  .attr("x1", 30).attr("x2", 70)
  .attr("y1", 20).attr("y2", 20)
  .style("fill","none").style("stroke-width",.5).style("stroke", "#000")

 tlegend.append("text")
  .attr("x", 70).attr("y",20).text("1 commit")

// Strata legend
var lEnter = tlegend.append("g").attr("transform", "translate(0, 120)").selectAll("rect").data([60,40,20]).enter();

lEnter.append("rect")
	.attr("height", function(d) {return d;}).attr("width", 50)
	.attr("x", 5).attr("y", function(d) {return 0}).style("fill", function(d,i) { 
		var v = 255-15*(3-i+1);
		return "rgb("+v+","+v+","+v+")";} )

 lEnter.append("line")
  .attr("x1", 30).attr("x2", 70)
  .attr("y1", function(d) {return 70-d}).attr("y2", function(d) {return 70-d})
  .style("fill","none").style("stroke-width",.5).style("stroke", "#000")

 lEnter.append("text")
  .attr("x", 70).attr("y", function(d) {return 70-d}).text(function(d,i) { 
    if(i==0) return "Previous day";
    else if(i==1) return "Previous week";
    else return "Since the begining";;
  })