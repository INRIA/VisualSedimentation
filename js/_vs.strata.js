(function ($) {
$.fn._vs.strata = {

    stratas: [],

    // Create  stratas
	  init:function(_this) {

      if(_this.settings.chart.type!='StackedAreaChart') {

        _this.strata.create_strata(_this);
        return;
      }
      settings = _this.settings;

      // No strata or empty strata, so nothing happens
      if( (typeof(settings.data.strata) != 'function') && (typeof(settings.data.strata) == "undefined" || settings.data.strata.length == 0)) { // || settings.data.strata.length == 0) {

          for (var i=0; i<settings.data.model.length; i++) {

            var defaultStrata = {
                              label: settings.data.model[i].label+"_"+i,
                              category: i,
                              value: function(t, s) { return 0;},
                            }
            _this.strata.stratas[i] = [defaultStrata];
          };

        _this.strata.create_strata(_this);
        return;
      }

      if(typeof settings.data.strata != 'function') {

        // Serialized function in JSON
        if(typeof(settings.data.strata == "object") && typeof(settings.data.strata[0]) != "undefined" && (typeof settings.data.strata[0][0].value != "undefined") && typeof(settings.data.strata[0][0].value == "string")) {

             var NB_STRATA = settings.data.strata[0].length;

            // Create default strata object
            for (var i=0; i<settings.data.model.length; i++) {
              _this.strata.stratas[i] = [];
              // Create default strata object
              for (var n=0; n<NB_STRATA; n++) {
                (function(a,b) {
                  var t=null;
                  if( (typeof settings.data.strata[a] !="undefined") && (typeof settings.data.strata[a][b] !="undefined") && (typeof settings.data.strata[a][b].texture!="undefined"))
                    t = settings.data.strata[a][b].texture;
                     var defaultStrata = {};
              
                    defaultStrata = {
                                label: settings.data.model[i].label+"_"+a,
                                category: a,
                                texture: t,
                                value: function() { r=eval("f="+settings.data.strata[a][b].value); return r();}
                              }
                 
                    
                  _this.strata.stratas[a].push(defaultStrata); 
                 })(i,n);
              }
            }
          _this.strata.create_strata(_this);

          return;
        }

        if(typeof(settings.data.strata[0]) != "undefined" && typeof(settings.data.strata[0][0]) != "undefined" && typeof(settings.data.strata[0][0].initValue != "undefined" ) ) {

          for (var c=0; c<settings.data.model.length; c++) {
            var defaultStrata = {
                              label: settings.data.model[c].label+"_"+c,
                              category: i,
                              value: function(t, s) { 
                                if(t.selectAll("category", s)) {

                                  return settings.data.strata[s][0].initValue+t.selectAll("category", s).attr("state").filter(function(d) {if(d==2) return d}).length;
                                } else
                                  return settings.data.strata[s][0].initValue;
                              },
                            }
            _this.strata.stratas[c] = [defaultStrata];
          };
          _this.strata.create_strata(_this);
          return;

        } else if(settings.data.strata[0].length == 0) { // Default bar chart  

          // Create default strata object
          for (var i=0; i<settings.data.model.length; i++) {

            var defaultStrata = {
                              label: settings.data.model[i].label+"_"+i,
                              category: i,
                              value: function(t, s) { 
                                if(t.selectAll("category", s)) {
                                  return t.selectAll("category", s).attr("state").filter(function(d) {if(d==2) return d}).length;
                                } else
                                  return 0;
                              },
                            }
            _this.strata.stratas[i] = [defaultStrata];
          };
          _this.strata.create_strata(_this);
          return;

        } else {

          var NB_STRATA = settings.data.strata[0].length;
          settings.data.strata_param = settings.data.strata;

          function fstrata() {
            var a = Array();
            for(var s=0; s<mySettings.data.model.length; s++)
              a.push(fstratum(s));
            return a;
          }

      function fstratum(a) {

        var b = Array(NB_STRATA);
        for(var r=0; r<b.length; r++)
            b[r] = Array();

        if(typeof _this != "undefined") {

          var tokens = _this.selectAll("category", s).attr("state").filter(function(d) {if(d==2) return d}).length;

          for(var k=0; k<tokens.length; k++) { 
            var tk = tokens[k];


            for(var r=0; r<b.length; r++) {

              if(tk < _this.settings.stream.now-2*(r) && tk >= _this.settings.stream.now-2*(r+1))
                b[b.length-r-1].push(tk)
              }
          }

        }
        var res = Array();

        for(var j=0; j<NB_STRATA; j++) {
          var val = b[j].length;
          (function(v) {
             res.push({value: function() { return v; }, label:"Strata "+j, category:a}) // b[j].length
          })(val);
         
        }
        return res;
      }

          _this.settings.data.strata = function() {return fstrata()};
          _this.strata.stratas = _this.settings.data.strata();
          _this.strata.create_strata(_this);
         return;
        }

      } 

      if((typeof settings.data.strata == 'function') || settings.data.strata[0].length > 0 || _this.strata.stratas.length>0) {

        // Strata have been defined, put them in the internal object
        if(typeof settings.data.strata == 'function' || (settings.data.strata[0].length > 0 && typeof(settings.data.strata[0])=="object")) {

          // Strata have been defined as functions
          if(typeof settings.data.strata == 'function') {
            _this.strata.stratas = settings.data.strata();

          } else if(typeof settings.data.strata[0].value == 'function') {

            for (var i=0; i<settings.data.model.length; i++) {

                  var defaultStrata = {
                                    label: settings.data.model[i].label+"_"+i,
                                    category: i,
                                    initValue: settings.data.model[i].value,
                                    value: function(t, s) { 
                                      return settings.data.strata[i];
                                    },
                                  }

                  _this.strata.stratas[i] = [defaultStrata];

            }

          } else { // Numerical values as strata

            for (var i=0; i<settings.data.model.length; i++) {
              var defaultStrata = {
                                label: settings.data.model[i].label+"_"+i,

                                category: i,
                                initValue: settings.data.model[i].value,

                                value: function(t, s) { 
                                  if(typeof(t.selectAll("category", s).length) == "undefined")
                                    return this.initValue;                        
                                  if(t.selectAll("category", s)) {
                                    return this.initValue+t.selectAll("category", s).attr("state").filter(function(d) {if(d==2) return d}).length;
                                  } else
                                    return 0;
                                },
                              }

              _this.strata.stratas[i] = [defaultStrata];
            };
          }
        }
        _this.strata.create_strata(_this);
      }
      // _this.strata.update(_this);
    },

      // select stratas	    
	    selectAll:function(_this,key,value){
	    	result = []
     		result.attr  = function(key,value,param){
     		  var r=[]
     		  result.forEach(function(i){
     		    q = i.attr(key,value,param)
     		    r.push(q)
     		  })
     		  return r
     		}

      		if(typeof(value) == "undefined" && typeof(key) == "undefined"){ 
      		  return this.stratas
      		}else{
      		  for (var i = _this.strata.stratas.length - 1; i >= 0; i--) {
      		    if(_this.strata.stratas[i].attr(key) == value){
      		      result.push(_this.strata.stratas[i])
      		      break;
      		    }
      		  }
      		}
      		if(typeof(result[0])=="undefined"){
      		  return false
      		}else{
      		  return result[0];
      		}
	    },

      // Create stratas
	    add:function(_this,setting){
		    
        var strata = function (){}
        strata.myobj = setting

		    strata.attr = function(key,value,param){
            if(typeof(value) == "undefined"){
              if(typeof(this[key])!="undefined"){
               return this[key]()
              }else{
               return this.myobj[key]
              }
            }else{
             if(typeof(this[key])!="undefined"){
              this[key](value,param)
             }else{
              this.myobj[key]=value
            }
           }
           return this
          }
        return strata
	    },

      // remove stratas
	   	remove:function(_this,key,value){

	   	},

  // Returns n layers
  strata_layers: function (_this, n, m, p) {

    // Scales for setting up the strata layers
    var sn = d3.scale.linear().domain([1, m-2]).range([Math.PI/2, 2*Math.PI-Math.PI/2]);  
    var logscale = d3.scale.pow().exponent(10).domain([0, m]).range([0,1]);
    
    return d3.range(n).map(function(i) {
      // For customs layers
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
            return _this.strata.stratas[p][i].value(_this, p);
        }
      }).map(stream_index);
    });
    function stream_index(d, i) {
      return {x: i, y: Math.max(0, d)};
    }     
  },
  // Strata creation
  create_strata: function(_this) {

            if(_this.settings.chart.type=='StackedAreaChart') {

              // Local variables for clearer code
              var w = _this.settings.chart.width/_this.settings.data.model.length,
                  h = _this.settings.sedimentation.aggregation.height;
              var color = _this.token.colorRange; 

            if(typeof _this.settings.options.canvasFirst != "undefined" && _this.settings.options.canvasFirst == false) {

              // Create a .vis element that overlays the canvas
              var vis = d3.select("#"+_this.settings.DOMelement.id)
                .insert("div", ":first-child")
                  .style("position", "absolute")
                  .attr("class", "vis")
                  .style("z-index", 10)
                .append("svg")
                  .attr("width", _this.settings.width)
                  .attr("height", _this.settings.height)
                .append("g")
                  .attr("transform", "translate(" + _this.settings.chart.x + "," + _this.settings.chart.y + ")");
            } else {

              var vis = d3.select("#"+_this.settings.DOMelement.id)
                .append("div")
                  .attr("class", "vis")
                  .style("z-index", 10)
                .append("svg")
                  .attr("width", _this.settings.width)
                  .attr("height", _this.settings.height)
                .append("g")
                  .attr("transform", "translate(" + _this.settings.chart.x + "," + _this.settings.chart.y + ")");
            }

              var sn = _this.strata.stratas[0].length, // number of layers
                  sm = 20; // number of samples per layer
                  smx = sm - 1, smy = 0;


            var sum_strata = _this.strata.stratas.map(
              function(d, i) { 
                  for(var v=0, res=0; v<d.length; v++)
                    res+=d[v].value(_this, i);
                  return res;
              });

                  
            var y = d3.scale.linear()
                .domain([0, Math.max(d3.max(sum_strata), _this.settings.sedimentation.aggregation.maxData)]) 
                .range([0, _this.settings.sedimentation.aggregation.height]);  

              // Create a group layer that contains all the future strata groups .gpath
              var g = vis.selectAll("g.gcol")
                  .data(_this.strata.stratas, function(d) {return [d];})
                  .enter()
                .append("g")
                  .attr("transform", function(d, i) {

                    var align = _this.settings.sedimentation.aggregation.height;
                    if(_this.settings.sedimentation.aggregation.invertStrata) {
                      align =2*_this.settings.sedimentation.aggregation.height-y(sum_strata[i]);
                    }
                    return "translate("+(i*w)+", "+(_this.settings.chart.height-align)+")";
                  }).attr("class", function(d,i) { return "gcol col_"+i;});;

              // Group path for each strata group
              var gpath = g.selectAll(".gpath")
                 .data(function(d, i) {
                    var sd = d3.layout.stack().offset("expand")(_this.strata.strata_layers(_this, d.length, sm, i));
                    smy = d3.max(sd, function(d) {
                      return d3.max(d, function(d) {
                        return d.y0 + d.y;
                      });
                    });
                    sd.map(function(d) {d.map(function(d) {d.col=i;return d;});}); // Put col # in data
                    return sd;
                  })
                  .enter().append("g").attr("class", "gpath");


            // Rectangular strata
            var area = d3.svg.area()
                .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
                .y0(function(d) { return (h - d.y0 * d.offshit); })
                .y1(function(d) { return (h - (d.y + d.y0) * d.offshit ); });

              var pathlayer = gpath.append("path")
                                .attr("d", function(d,i) {

                                  _this.chartUpdate(i, -y(sum_strata[i])-(h-_this.settings.chart.height));
                                  hh = 0;//_this.settings.chart.height-_this.chart.getPosition(_this)[d[0].col].y;
                                  d.map(function(dd) {
                                    dd.offshit = hh;
                                    return dd;
                                  });
                                  return area(d);
                                });

              // Customize layers with color and texture
              pathlayer.style("fill", function(d,i) { 
                if(_this.strata.stratas[d[0].col][i].texture!=null) {
                  return "url(#RectanglePattern_"+d[0].col+"_"+i+")";
                } else {
                  return d3.rgb(color(d[0].col))
                    .darker(_this.strata.stratas[d[0].col].length/2-(i+1)/2); // The more away from the token, the darker
                }
              })
              .attr("class",  function(d,i) { return "gcol col_"+d[0].col+" layer_"+i;});

      // Textures
      var patternWidth = w/1;
      var patternHeight = patternWidth;        
      
      if(typeof _this.settings.data.strata != "undefined") {
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
      }
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
                  _this.strata.create_pie_chart(_this, data, svg, data[0].value, color,
                     ((i+1/2))*_this.settings.chart.width/(_this.settings.data.model.length)+_this.settings.chart.x,
                      _this.settings.chart.y+_this.settings.chart.height/6);
                  }
              } else {
                var data =_this.settings.data.strata.map(function(d) { return {value:d[0].value};});   
                  var color = _this.token.colorRange;
                _this.strata.create_pie_chart(_this, data, svg, _this.settings.chart.radius, color,
                 _this.settings.chart.x+_this.settings.chart.width/2,
                 _this.settings.chart.y+_this.settings.chart.height/2);
              }
            }
  },
  create_pie_chart: function(_this, data, svg, r, color, posx, posy) {
      
    var w = _this.settings.width/_this.settings.data.model.length,
        h = _this.settings.sedimentation.aggregation.height;//_this.settings.height;

    var x = d3.scale.linear()
        .domain([0, _this.settings.data.strata.length-1])
        .range([0, _this.settings.width]);            
        
    
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value; })]) 
        .rangeRound([0, h]);            
      
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
    
    var hh=0;

    // Rectangular strata
    var area = d3.svg.area()
        .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
        .y0(function(d) { return (h - d.y0 * hh); }) //hh/smy
        .y1(function(d) { return (h - (d.y + d.y0) * hh ); }); //hh/smy
        
    var arcs = garcs.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", function(d,i) {  

          return arc(d);
          
        })
        .each(function(d) { this._current = d; });
                    
  
  },
  update: function(_this) {
      // No strata or empty strata, so nothing happens
      if(typeof(_this.strata.stratas) == "undefined" || _this.strata.stratas.length == 0) {
        //TODO: create virtual strata to store all the flocculated ones
        return;
      }

      // If strata are functions, then refresh them
      if(typeof settings.data.strata == 'function') {
        _this.strata.stratas = settings.data.strata();
      }
              var sn = _this.strata.stratas[0].length, // number of layers
                  sm = 20; // number of samples per layer
                  smx = sm - 1, smy = 0;

            // Local variables for clearer code
            var w = _this.settings.chart.width/_this.settings.data.model.length,
                h = _this.settings.sedimentation.aggregation.height;
            var color = _this.token.colorRange; 

            // Rectangular strata
            var area = d3.svg.area()
                .x(function(d) { return _this.settings.chart.spacer+d.x * (w-2*_this.settings.chart.spacer) / smx; })
                .y0(function(d) { return (h - d.y0 * d.offshit); })
                .y1(function(d) { return (h - (d.y + d.y0) * d.offshit ); });
           
            var sum_strata = _this.strata.stratas.map(
              function(d, i) { 
                  for(var v=0, res=0; v<d.length; v++) {
                    res+=d[v].value(_this, i);
                  }
                  return res;
              });

            var y = d3.scale.linear()
                .domain([0, Math.max(d3.max(sum_strata), _this.settings.sedimentation.aggregation.maxData)]) 
                .range([0, _this.settings.sedimentation.aggregation.height]);  

            var vis = d3.select("#"+_this.settings.DOMelement.id)

            var g = vis.selectAll("g.gcol")


            if(_this.settings.sedimentation.aggregation.invertStrata) {
                  g.transition().duration(100).attr("transform", function(d, i) {
                    var align = _this.settings.sedimentation.aggregation.height;
                     align =2*_this.settings.sedimentation.aggregation.height-y(sum_strata[i]);
                    return "translate("+(i*w)+", "+(_this.settings.chart.height-(2*_this.settings.sedimentation.aggregation.height-y(sum_strata[i])))+")";
                  });
            }

          // Update the group data model
            var gpath = g.selectAll("path")
               .data(function(d, i) {
                  var sd = d3.layout.stack().offset("expand")(_this.strata.strata_layers(_this, d.length, sm, i));

                  smy = d3.max(sd, function(d) {
                    return d3.max(d, function(d) {
                      return d.y0 + d.y;
                    });
                  });
                  sd.map(function(d) {
                    d.map(function(d) {
                      d.col=i;
                      return d;
                    });
                  }); // Put col # in data
                  return sd;
               });

          if(_this.settings.chart.type=='StackedAreaChart') {
            // Adding strata layers
            var pathlayer = vis.selectAll("path")
              .transition().duration(100).attr("d", function(d,i) {
  
                if(!_this.settings.sedimentation.aggregation.invertStrata) {
                    _this.chartUpdate(i, -y(sum_strata[i])-(h-_this.settings.chart.height));
                    hh = _this.settings.chart.height-_this.chart.getPosition(_this)[d[0].col].y;
                } else {
                    _this.chartUpdate(i, -2*h+_this.settings.chart.height);
                    hh = y(sum_strata[d[0].col]);
                }
                d.map(function(dd) {
                  dd.offshit = hh;
                  return dd;
                });
              return area(d);
            });
          }
    }
    //return {};
	}
})(jQuery);