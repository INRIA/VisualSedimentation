(function ($) {

$.fn._vs.chart.sylochart = function(_this,fn,options) {

  this.init = function (_this){
    console.log('heapchart Init')

    _this.world.m_gravity   = new _this.phy.b2Vec2(0, 0);
    _this.chartPhySetup     = {grounds:[],wall:[]}
    this.setupChartPhysics(_this);
  };
  
  this.setupChartPhysics = function(_this){

    var spacer      = _this.settings.chart.spacer;
    var colSize     = (_this.settings.chart.width/_this.settings.data.model.length)
    var colBwid     = spacer;
    var colYpos     = _this.settings.chart.height/2+_this.settings.chart.y+colBwid

    // I must move that to a other part of the code
    for (var i = 0; i <_this.settings.data.model.length; i++) { 
      _this.settings.data.model[i].value=0
      if(typeof(_this.settings.data.strata[i])!="undefined"){
        for (var j = 0; j <_this.settings.data.strata[i].length; j++) { 
         _this.settings.data.model[i].value += _this.settings.data.strata[i][j].value
        }
      } 
    }
    
    for( var i = 0 ; i<_this.settings.data.model.length+1 ; i++) {
        // process the position 
        var colXpos = _this.settings.chart.x+(i*colSize);
        // create the wall 
        _this.chartPhySetup.wall[i] = this.createMyChartBox (
                          _this,
                          colXpos,
                          colYpos,
                          colBwid,
                          _this.settings.chart.height/2,
                          "wall",
                          _this.settings.chart.wallColor);
  
        // Fix incomming points for tokens 
        if(i<_this.settings.data.model.length){
          _this.settings.sedimentation.incoming.point[i]={
                                                    x:colXpos+(colSize/2),
                                                    y:_this.settings.y+_this.settings.height/2
                                                    }
        }
    }
  }

  this.token = function (_this,options){
    //console.log('token query')
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

  this.createMyChartBox = function (_this,x,y,w,h,type,color){
     // you could create your own box 2d object for the physical layout 
     var scale          = _this.settings.options.scale
     var fixDef         = new _this.phy.b2FixtureDef;
     fixDef.density     = 1.0;
     fixDef.friction    = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef  = new _this.phy.b2BodyDef;
     bodyDef.type = _this.phy.b2Body.b2_staticBody;
     fixDef.shape = new _this.phy.b2PolygonShape;
     fixDef.shape.SetAsBox(w/scale, h/scale);
     bodyDef.position.Set(x/scale,y/scale );
     var box = _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
     box.m_userData = {type:type,fillColor:color,w:w,h:h}
     return box
  }
  
 if (typeof(fn)!=undefined){
    var result = this[fn](_this,options);  
    if (typeof(result)!=undefined){
      return result
    }
  }

}


})(jQuery);
