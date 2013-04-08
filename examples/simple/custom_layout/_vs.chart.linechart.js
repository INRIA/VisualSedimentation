(function ($) {

$.fn._vs.chart.linechart = function(_this,fn,options) {

  this.init = function (_this){
    console.log("Init my Custom heap chart")
    // Define the gravity (here 0)
    _this.world.m_gravity   = new _this.phy.b2Vec2(49, 0);
    // Save the physical layout setup 
    _this.chartPhySetup     = {grounds:[],wall:[]}
    // Setup the layout 
    this.setupChartPhysics(_this);
  };
  
  this.setupChartPhysics = function(_this){

    // Here you could setup :
    // - the incomming point 
    // - alle physical element like grounds 

    var colSizeX       = (_this.settings.chart.width/_this.settings.data.model.length)    
    var colSizeY       = (_this.settings.chart.height/2/_this.settings.data.model.length)    

    for( var i = 0 ; i<_this.settings.data.model.length+1 ; i++) {
        var colXpos   = _this.settings.chart.x+(i*colSizeX);
        var colYpos   = _this.settings.chart.y+(i*colSizeY)+_this.settings.chart.y;

        // Define incomming points for tokens 
        if(i<_this.settings.data.model.length){
          _this.settings.sedimentation.incoming.point[i]={
                                                    x:50,
                                                    y:colYpos
                                                    }

          _this.settings.sedimentation.incoming.target[i]={
                                                    x:50,
                                                    y:colYpos
                                                    }                                                    
        }
    }
  };

  // Token feature creation call for this chart you could modify it  
  this.token = function (_this,options){
    var i = options;
    var token = {
              x:(_this.settings.sedimentation.incoming.point[i].x+(Math.random()*2)),
              y:(_this.settings.sedimentation.incoming.point[i].y+(Math.random()*1)),
              size:_this.settings.sedimentation.token.size.original,
              category:i,
              phy:{
                  density:0.1,
                  friction:0,
                  restitution:0
              },
              targets:[{
                  //  bizare x/2 or x ...
                  x: _this.settings.sedimentation.incoming.target[i].x,
                  y: _this.settings.sedimentation.incoming.target[i].y
              }]
            }
    return token; 
  }

 if (typeof(fn)!=undefined){
    var result = this[fn](_this,options);  
    if (typeof(result)!=undefined){
      return result
    }
  }

}

})(jQuery);
