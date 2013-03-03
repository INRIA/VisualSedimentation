(function ($) {

  $.fn._vs.aggregate = {
      defaultSettings:{
    },

  // Returns n layers
	strata_layers: function (_this, n, m, p) {
        var sn = d3.scale.linear().domain([1, m-2]).range([Math.PI/2, 2*Math.PI-Math.PI/2]);  
				var logscale = d3.scale.pow().exponent(10).domain([0, m]).range([0,1]);
				
        return d3.range(n).map(function(i) {
					var r = 5*Math.random();
				
					return d3.range(m).map(function(j) {

						if(_this.settings.sedimentation.aggregation.strataType=="sin") {
						if(i==1) return 20;
							var x = 5+r*5*Math.sin(sn(j))+(i*50);
							if(x<0) return -x; else return x;
						} else if(_this.settings.sedimentation.aggregation.strataType=="log") {
							return i+1;
							//return logscale(j);//logscale(i);
						} else {
							if(typeof(p)=='undefined')
								p=0;
								return _this.settings.data.strata[p][i].value;
						}
					}).map(stream_index);
				});
				
				function stream_index(d, i) {
					return {x: i, y: Math.max(0, d)};
				}			
			
			},

      init:function (_this){

      	// Skip layers if no strata is defined
				if(typeof(_this.settings.data.strata)=='undefined' || _this.settings.data.strata.length==0  || _this.settings.data.strata[0].length==0)
					return;

				var color = _this.token.colorRange; 


      if(_this.settings.chart.type=='StackedAreaChart') {

        var w = _this.settings.chart.width/_this.settings.data.model.length,
            h = _this.settings.sedimentation.aggregation.height;

        var vis = d3.select("#"+_this.settings.DOMelement.id)
					//.insert("div", ":first-child")
					.append("div")
						.attr("class", "vis")
					//	.style("position", "relative")
						.style("z-index", 10)
          .append("svg")
            .attr("width", _this.settings.width)
            .attr("height", _this.settings.height)

					.append("g")
						.attr("transform", "translate(" + _this.settings.chart.x + "," + _this.settings.chart.y + ")");

        var g = vis.selectAll("g.gcol")
            .data(_this.settings.data.strata, function(d) {return [d];})
            .enter()
          .append("g")
            .attr("transform", function(d, i) {
							return "translate("+(i*w)+", "+(_this.settings.chart.height-_this.settings.sedimentation.aggregation.height)+")";
						}).attr("class", function(d,i) { return "gcol col_"+i;});;

        var data =_this.settings.data.strata.map(function(d) { return {value:d[0].value};});    

        var sn = _this.settings.data.strata[0].length, // number of layers
						sm = 20; // number of samples per layer
            smx = sm - 1, smy = 0;
       
				var hh=0;
		
				// Rectangular strata
        var area = d3.svg.area()
            .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
            .y0(function(d) { return (h - d.y0 * hh); }) //hh/smy
            .y1(function(d) { return (h - (d.y + d.y0) * hh ); }); //hh/smy
						
        var hhh = [];

        var gpath = g.selectAll("gpath")
             .data(function(d,i) {
                var sd = d3.layout.stack().offset("expand")(_this.aggregate.strata_layers(_this, d.length, sm, i));
                smy = d3.max(sd, function(d) {
                  return d3.max(d, function(d) {
                    return d.y0 + d.y;
                  });
                });
								sd.map(function(d) {d.map(function(d) {d.col=i;return d;});}); // Put col # in data
                return sd;
             })
            .enter().append("g").attr("class", "gpath");
						
					gpath.append("path")
            .attr("d", function(d,i) {
							hh = _this.settings.chart.height-_this.chart.getPosition(_this)[d[0].col].y;
							return area(d);
          }).style("fill", function(d,i) { 
			        if(_this.settings.data.strata[d[0].col][i].texture!=null) {
                return "url(#RectanglePattern_"+d[0].col+"_"+i+")";
              } else {
								
                return d3.rgb(color(d[0].col))
									.darker(_this.settings.data.strata[d[0].col].length/2-(i+1)/2); // The more away from the token, the darker
              }
            })
						.attr("class",  function(d,i) { return "layer";})
						.attr("class",  function(d,i) { return "col_"+d[0].col+" layer_"+i;});
	
				// Textures
				// strata.texture: {url:"../..", size:1}, 
				var patternWidth = w/1;
				var patternHeight = patternWidth;        
								
				for(var s=0; s<_this.settings.data.strata.length; s++) { 
					for(var l=0; l<_this.settings.data.strata[s].length; l++) {          
						if(_this.settings.data.strata[s][l].texture!=null) {

							var pattern = vis.append('pattern')
									.attr('id','RectanglePattern_'+s+"_"+l)
									.attr('height', patternHeight)
									.attr('width', patternWidth)
									.attr('patternTransform', 'translate(0, 0) scale('+_this.settings.data.strata[s][l].texture.size+', '+_this.settings.data.strata[s][l].texture.size+') rotate(0)')
									.attr('patternUnits','userSpaceOnUse');
									
							pattern.append('image')
									.attr('x', 0)
									.attr('y', 0)
									.attr('height', patternHeight)
									.attr('width', patternWidth)
									.attr('xlink:href', function() { return _this.settings.data.strata[s][l].texture.url;});    
						}
					}
				}			

			// PIE CHAR
			} else if(_this.settings.chart.type=='CircleLayout') {
					
				// strata
        var svg = d3.select("#"+_this.settings.DOMelement.id)
			.append("div")
			.attr("class", "vis")//.style("margin-top", "-"+_this.settings.height+"px")
            .attr("width", _this.settings.width)
            .attr("height", _this.settings.height)						
            .append("svg")
            .attr("width", _this.settings.width)
            .attr("height", _this.settings.height);					
										
					// bubble chart
					if(typeof(_this.settings.chart.treeLayout)!="undefined") {

					for(var i=0; i<_this.settings.data.model.length; i++) {
						var data =_this.settings.data.strata[i];   
						 var color = function(s) { return _this.token.colorRange(i)};
						_this.aggregate.create_pie_chart(_this, data, svg, data[0].value, color,
						 ((i+1/2))*_this.settings.chart.width/(_this.settings.data.model.length)+_this.settings.chart.x,
						  _this.settings.chart.y+_this.settings.chart.height/6);

						}

					} else {
						var data =_this.settings.data.strata.map(function(d) { return {value:d[0].value};});   
							console.log(_this.settings.data.strata, data);
						  var color = _this.token.colorRange;
						_this.aggregate.create_pie_chart(_this, data, svg, _this.settings.chart.radius, color,
						 _this.settings.chart.x+_this.settings.chart.width/2,
						 _this.settings.chart.y+_this.settings.chart.height/2);
					}
					
				}
      },
			
			create_pie_chart: function(_this, data, svg, r, color, posx, posy) {
					
        var w = _this.settings.width/_this.settings.data.model.length,
            h = _this.settings.sedimentation.aggregation.height;//_this.settings.height;
/*
        var vis = d3.select("#"+_this.settings.DOMelement.id)
					.append("div")
						.attr("class", "vis") //.style("margin-top", "-"+_this.settings.height+"px")//+_this.settings.DOMelement.id
          .append("svg")
            .attr("width", _this.settings.width)
            .attr("height", _this.settings.height);

        var g = vis.selectAll("g")
            .data(_this.settings.data.strata, function(d) {return [d];})
            .enter()
          .append("g")
            .attr("transform", function(d, i) {
							return "translate("+(i*w)+", "+(_this.settings.height-_this.settings.sedimentation.aggregation.height)+")";
						});
            */
        var x = d3.scale.linear()
            .domain([0, _this.settings.data.strata.length-1])
            .range([0, _this.settings.width]);            
            
        
        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {return d.value; })]) 
            .rangeRound([0, h]);            
					
					/*
        var sn = _this.settings.data.strata[0].length, // number of layers
						sm = 20; // number of samples per layer
         
        var sdata0 = d3.layout.stack().offset("expand")(strata_layers(sn, sm)),
            sdata1 = d3.layout.stack().offset("expand")(strata_layers(sn, sm)),
            smx = sm - 1, smy = 0;
						   */
				
				// CIRCLE
        var wp = _this.settings.width,
            hp = _this.settings.height,
            hhp = _this.settings.sedimentation.aggregation.height;
           //Math.min(w, hh) / 2,
            labelr = r + 30, // radius for label anchor
						donut = d3.layout.pie().sort(null),
						arc = d3.svg.arc().innerRadius(0).outerRadius(r);
											
				var id=Math.random();
				svg.append("g.arcs_"+id)
            .attr("class", "arcs_"+id);
              				
        var garcs = svg.selectAll(".arcs")
            .data(donut(data.map(function(d, i) { return d.value})))
          .enter().append("svg:g").attr("transform", "translate(" + posx + "," + posy + ")"); 
         /*
        var arcs = garcs.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", function(d) {	
						
						
							return arc(d);
							
						})
            .each(function(d) { this._current = d; });
						
						*/
						// END CIRCLE					
						
						
				var hh=0;
		
				// Rectangular strata
        var area = d3.svg.area()
            .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
            .y0(function(d) { return (h - d.y0 * hh); }) //hh/smy
            .y1(function(d) { return (h - (d.y + d.y0) * hh ); }); //hh/smy
						
        var arcs = garcs.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", function(d,i) {	
		
							/*
.data(function(d,i) {
                var sd = d3.layout.stack().offset("expand")(strata_layers(d.length, sm));
                smy = d3.max(sd, function(d) {
                  return d3.max(d, function(d) {
                    return d.y0 + d.y;
                  });
                });
								sd.map(function(d) {d.map(function(d) {d.col=i;return d;});}); // Put col # in data
                return sd;
             })							
						*/
							return arc(d);
							
						})
            .each(function(d) { this._current = d; });
												
						/*
        var hhh = [];
			
        g.selectAll("path")
             .data(function(d,i) {
                var sd = d3.layout.stack().offset("expand")(strata_layers(d.length, sm));
                smy = d3.max(sd, function(d) {
                  return d3.max(d, function(d) {
                    return d.y0 + d.y;
                  });
                });
								sd.map(function(d) {d.map(function(d) {d.col=i;return d;});}); // Put col # in data
                return sd;
             })
            .enter().append("path")
            .attr("d", function(d,i) {
              hh = 450-_this.chart.getPosition(_this)[d[0].col].y;
							return area(d);
          }).style("fill", function(d,i) { 
			        if(_this.settings.data.strata[d[0].col][i].texture!=null) {
                return "url(#RectanglePattern_"+d[0].col+"_"+i+")";
              } else {
								// The more away from the token, the darker
                return d3.rgb(color(d[0].col)).darker(_this.settings.data.strata[d[0].col].length/2-(i+1)/2); 
              }
            });

*/
						
      
      /* else if(_this.settings.chart.type=='CircleLayout2') {

        var data1 = _this.settings.data.strata,
            data = data1,
            data2 = _this.settings.data.strata; // 2nd dataset if we want to update

						console.log("data", data);
						
        var w = _this.settings.width,
            h = _this.settings.height,
            hh = _this.settings.sedimentation.aggregation.height;
            r = _this.settings.chart.radius,//Math.min(w, hh) / 2,
            labelr = r + 30, // radius for label anchor
						donut = d3.layout.pie().sort(null),
						arc = d3.svg.arc().innerRadius(0).outerRadius(r);
						
						console.log("donut", donut(data));
												
						// strata
			
        var svg = d3.select("#"+_this.settings.DOMelement.id).attr("class", "vis")//.style("margin-top", "-"+_this.settings.height+"px")
          .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            //.style("position", "absolute")
          .append("svg:g")
            .attr("class", "arcs")
            .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");   
            
				var ddd = donut(_this.settings.data.strata.map(function(d, i) { return d[0].value}));

				
        var garcs = svg.selectAll("g")
            .data(donut(data.map(function(d, i) { return d[0].value})))
          .enter().append("svg:g");
         
        var arcs = garcs.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", function(d) {	return arc(d);})
            .each(function(d) { this._current = d; });

	
				var labels = garcs.append("svg:text")
						.attr("transform", function(d) {
								var c = arc.centroid(d),
										x = c[0],
										y = c[1],
										h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse
								return "translate(" + (x/h * labelr) +  ',' +
									 (y/h * labelr) +  ")"; 
						})
						.attr("dy", ".35em")
						.attr("text-anchor", function(d) {
								return (d.endAngle + d.startAngle)/2 > Math.PI ?  // are we past the center?
										"end" : "start";
						})
						.text(function(d, i) { return _this.settings.data.model[i].label; }); //.toFixed(2) if num val

						d3.select(window).on("click", function() {
							data = data === data1 ? data2 : data1; // swap the data
							arcs = arcs.data(donut(data.map(function(d) { return d[0].value}))); // recompute the angles and rebind the data
							arcs.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
  
							labels.data(donut(data.map(function(d,i) {  return d[0].value})))
								.transition().duration(750).attr("transform", function(d) {
											var c = arc.centroid(d),
													x = c[0],
													y = c[1],
													// pythagorean theorem for hypotenuse
													h = Math.sqrt(x*x + y*y);

											return "translate(" + (x/h * labelr) +  ',' +
												 (y/h * labelr) +  ")"; 
									})
									.attr("dy", ".35em")
									.attr("text-anchor", function(d) {
											// are we past the center?
											return (d.endAngle + d.startAngle)/2 > Math.PI ?
													"end" : "start";
									})
									.text(function(d, i) { return _this.settings.data.model[i].label}); //d.value.toFixed(2); });
						});

						// Store the currently-displayed angles in this._current.
						// Then, interpolate from this._current to the new angles.
						function arcTween(a) {
							var i = d3.interpolate(this._current, a);
							this._current = i(0);
							return function(t) {
								return arc(i(t));
							};
						}
				}  // end if char/pie layout
				*/
			
			},
			
  update : function (_this) {

		if(typeof(_this.settings.data.strata)=='undefined' || _this.settings.data.strata.length==0  || _this.settings.data.strata[0].length==0) // Skip layers if no strata is defined
			return;
				
		var w = _this.settings.chart.width/_this.settings.data.model.length;
		var h = _this.settings.sedimentation.aggregation.height;

    var x = d3.scale.linear()
        .domain([0, _this.settings.data.strata.length-1])
        .range([0, _this.settings.width]);            
        
    var data =_this.settings.data.strata.map(function(d) { return {value:d[0].value};});    
        
		var sum_strata =_this.settings.data.strata.map(
			function(d) { 
					for(var v=0, res=0; v<d.length; v++)
						res+=d[v].value;
					return res;
			});

    var y = d3.scale.linear()
        .domain([0, d3.max(sum_strata)]) 
        .range([0, _this.settings.sedimentation.aggregation.height]);            
			
    var sn = _this.settings.data.strata[0].length, // number of layers
				sm = 20; // number of samples per layer
				smx = sm - 1, smy = 0;
   
		var hh=0;
	
		// Rectangular strata
    var area = d3.svg.area()
        .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
        .y0(function(d) { return (h - d.y0 * hh); }) //hh/smy
        .y1(function(d) { return (h - (d.y + d.y0) * hh ); }); //hh/smy
				
		var vis = d3.select("svg");
    var g = vis.selectAll(".gcol");
    
		g.data(_this.settings.data.strata, function(d,i) { return [d];});
					
    var gpath = g.selectAll(".gpath")
         .data(function(d,i) {
            var sd = d3.layout.stack().offset("expand")(_this.aggregate.strata_layers(_this, d.length, sm, i));
            smy = d3.max(sd, function(d) {
              return d3.max(d, function(d) {
                return d.y0 + d.y;
              });
            });
						sd.map(function(d) {d.map(function(d) {d.col=i;return d;});}); // Put col # in data
            return sd;
         });

		gpath.select("path")
			.transition()
            .duration(100)
            .attr("d", function(d,i) {
							_this.chartUpdate(i, -y(sum_strata[i])-(h-_this.settings.chart.height));
							hh = _this.settings.chart.height-_this.chart.getPosition(_this)[d[0].col].y;
							return area(d);
          });
			}
  }    
})(jQuery);
