(function ($) {

$.fn._vs.chart.sylochart = function(_this,fn,options) {

  this.init = function (_this){
    console.log('typo Init')
    _this.world.m_gravity   = new _this.phy.b2Vec2(0.1, 2);
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
    
    
    var colXpos = _this.settings.chart.x+(1*colSize);

    _this.settings.sedimentation.incoming.point[0]={
                                           x:190,
                                           y:0//_this.settings.y+_this.settings.height/2
                                           }
    _this.settings.sedimentation.incoming.point[1]={
                                           x:350,
                                           y:0//_this.settings.y+_this.settings.height/2
                                           }
    _this.settings.sedimentation.incoming.point[2]={
                                           x:390,
                                           y:0//_this.settings.y+_this.settings.height/2
                                           }

    var v={x:150
          ,y:40
          ,b:8
          ,h:100
        }
    
    var i={x:320
          ,y:45
          ,b:8
          ,h:90
        }
    
    var z={x:420
          ,y:45
          ,b:8
          ,h:90
        }
    var wallColor="#fff"



      // V 
     _this.chartPhySetup.wall[0] = this.createMyChartBox (
                          _this,
                          v.x,
                          v.y,
                          v.b,
                          v.h,
                          (0.92 * Math.PI*2),
                          "wall",
                          wallColor);

     _this.chartPhySetup.wall[1] = this.createMyChartBox (
                          _this,
                          v.x+120,
                          v.y,
                          v.b,
                          v.h,
                          (0.58 * Math.PI*2),
                          "wall",
                          wallColor);
     //
     _this.chartPhySetup.wall[2] = this.createMyChartBox (
                          _this,
                          v.x+50,
                          v.y+20,
                          v.b,
                          v.h-60,
                          (0.92 * Math.PI*2),
                          "wall",
                          wallColor);

     _this.chartPhySetup.wall[3] = this.createMyChartBox (
                          _this,
                          v.x+120-50,
                          v.y+20,
                          v.b,
                          v.h-60,
                          (0.58 * Math.PI*2),
                          "wall",
                          wallColor);

     _this.chartPhySetup.wall[4] = this.createMyChartBox (
                          _this,
                          v.x+60,
                          v.y-20,
                          v.b,
                          v.h-60,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);


     // I 
        _this.chartPhySetup.wall[5] = this.createMyChartBox (
                          _this,
                          i.x,
                          i.y,
                          i.b,
                          i.h,
                          (1 * Math.PI*2),
                          "wall",
                          wallColor);

        _this.chartPhySetup.wall[5] = this.createMyChartBox (
                          _this,
                          i.x+12,
                          i.y+160,
                          i.b,
                          20,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);
   _this.chartPhySetup.wall[6] = this.createMyChartBox (
                          _this,
                          i.x+50,
                          i.y,
                          i.b,
                          i.h,
                          (1 * Math.PI*2),
                          "wall",
                          wallColor);

    // Z
   _this.chartPhySetup.wall[7] = this.createMyChartBox (
                          _this,
                          z.x-10,
                          z.y+30,
                          z.b,
                          z.h-10,
                          (0.58 * Math.PI*2),
                          "wall",
                          wallColor);

   _this.chartPhySetup.wall[7] = this.createMyChartBox (
                          _this,
                          z.x+65,
                          z.y-10,
                          z.b,
                          z.h-10,
                          (0.58 * Math.PI*2),
                          "wall",
                          wallColor);

        _this.chartPhySetup.wall[8] = this.createMyChartBox (
                          _this,
                          z.x+22,
                          z.y+100,
                          z.b,
                          80,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);

        _this.chartPhySetup.wall[10] = this.createMyChartBox (
                          _this,
                          z.x+60,
                          z.y+100,
                          z.b,
                          40,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);


        _this.chartPhySetup.wall[10] = this.createMyChartBox (
                          _this,
                          z.x-5,
                          z.y,
                          z.b,
                          40,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);

        _this.chartPhySetup.wall[10] = this.createMyChartBox (
                          _this,
                          z.x+60,
                          z.y-58,
                          z.b,
                          50,
                          (0.25 * Math.PI*2),
                          "wall",
                          wallColor);

   _this.chartPhySetup.wall[7] = this.createMyChartBox (
                          _this,
                          z.x+100,
                          z.y+132,
                          z.b,
                          z.h-75,
                          (0 * Math.PI*2),
                          "wall",
                          wallColor);



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

  this.createMyChartBox = function (_this,x,y,w,h,r,type,color){
     // you could create your own box 2d object for the physical layout 
     var scale          = _this.settings.options.scale
     var fixDef         = new _this.phy.b2FixtureDef;
     fixDef.density     = 1.0;
     fixDef.friction    = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef  = new _this.phy.b2BodyDef;
     bodyDef.type = _this.phy.b2Body.b2_staticBody;
     bodyDef.angle= r;
     fixDef.shape = new _this.phy.b2PolygonShape;
     fixDef.shape.SetAsBox(w/scale, h/scale);
     bodyDef.position.Set(x/scale+(w/scale),y/scale+(h/scale) );
     var box = _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
     box.m_userData = {type:type,fillStyle:color,w:w,h:h}
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
