(function ($) {

$.fn._vs.chart.sylochart = function(_this,fn,options) {

  this.init = function (_this){
    console.log('balance chart Init')
    _this.world.m_gravity   = new _this.phy.b2Vec2(0.1, 5);
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

    _this.settings.sedimentation.incoming.point[0]={x:100,y:0}
    _this.settings.sedimentation.incoming.point[1]={x:250,y:0}
    _this.settings.sedimentation.incoming.point[2]={x:250,y:0}

    this.createBoxContainer(_this,50,100,100,300,null,null,0,0)
    this.createBoxContainer(_this,200,100,100,300,null,null,0,0)

    this.createMyChartBox(_this,10,300,800,10,0.1)
    this.createMyChartBox(_this,10,10,200,10,0.1,"dynamic")

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


  this.createBoxContainer  = function (_this,x,y,w,h,l,r,slope,outSize,color,type){

    if(typeof(x)=="undefined") x=50
    if(typeof(y)=="undefined") y=100
    if(typeof(w)=="undefined") w=100
    if(typeof(h)=="undefined") h=100
    if(typeof(l)=="undefined") l=3
    if(typeof(type)=="undefined"){
     type = _this.phy.b2Body.b2_staticBody;
    }else{
     type = _this.phy.b2Body.b2_dynamicBody
    }
    if(typeof(outSize)=="undefined") outSize=10
    if(typeof(slope)=="undefined") {
      slope= (0 * Math.PI*2)
    }else{
      var slope1= (slope * Math.PI*2)
      var slope2= ((0-slope) * Math.PI*2)
    }

    this.createMyChartBox ( _this,x,y,l,h,null,null,"wall",color);
    this.createMyChartBox ( _this,x+w,y,l,h,null,null,"wall",color);
    this.createMyChartBox ( _this,x,y+h,(w/2)-(outSize/2),l,slope1,null,"wall",color);
    this.createMyChartBox ( _this,x+w-(w/2)+(outSize),y+h,(w/2)-(outSize/2),l,slope2,null,"wall",color);
  } 

  this.addJoint = function(body1Id, body2Id) {
      var body1 = this.bodiesMap[body1Id];
      var body2 = this.bodiesMap[body2Id];
      var joint = new b2RevoluteJointDef();
      joint.Initialize(body1, body2, body1.GetWorldCenter());
      this.world.CreateJoint(joint);
  }

  this.createMyChartBox = function (_this,x,y,w,h,r,type,name,color){
    if(typeof(type)=="undefined"){
     type =  _this.phy.b2Body.b2_staticBody;
    }else{
     type =  _this.phy.b2Body.b2_dynamicBody
    }

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
     fixDef.shape.SetAsBox(w/2/scale, h/2/scale);
     bodyDef.position.Set((x/scale)+(w/2/scale),(y/scale)+(h/2/scale) );
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
