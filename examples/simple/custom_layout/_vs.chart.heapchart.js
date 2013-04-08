(function ($) {

$.fn._vs.chart.heapchart = function(_this,fn,options) {

  this.init = function (_this){
    console.log("Init my Custom heap chart")
    // Define the gravity (here 0)
    _this.world.m_gravity   = new _this.phy.b2Vec2(0, 0);
    // Save the physical layout setup 
    _this.chartPhySetup     = {grounds:[],wall:[]}
    // Setup the layout 
    this.setupChartPhysics(_this);
  };
  
  this.setupChartPhysics = function(_this){

    // Here you could setup :
    // - the incomming point 
    // - alle physical element like grounds 

    var colSize       = (_this.settings.chart.width/_this.settings.data.model.length)    
    for( var i = 0 ; i<_this.settings.data.model.length+1 ; i++) {
        
        var colXpos   = _this.settings.chart.x+(i*colSize);

        // Define incomming points for tokens 
        if(i<_this.settings.data.model.length){
          _this.settings.sedimentation.incoming.point[i]={
                                                    x:colXpos+(colSize/2),
                                                    y:_this.settings.y+_this.settings.height/2
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
              targets:[]
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
