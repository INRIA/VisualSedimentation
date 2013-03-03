(function ($) {

$.fn._vs.chart.CircleLayout = function(_this,fn,options) {

  var mouseJointTest;
  var csX;
  var csY;
  var treeLayout;
  var initValue  = []; // Initiation des valeurs
  var tdv        = 0;  // Incoming point
  var _this;

  this.init = function (_this,options){
    console.log('Circle Layout Init')
    this._this              = _this
    gravity                 = new _this.phy.b2Vec2(0, 0);    // Zero gravity
    _this.world.m_gravity   = gravity;
    _this.chartPhySetup     = {grounds:[],wall:[]}
    this.treeLayout         = _this.settings.chart.treeLayout;

            for (var i=0; i<_this.settings.data.model.length; i++) {
            _this.settings.data.strata[i][0].value = _this.settings.data.strata[i][0].initValue;
            }

    // process data distribution to form layout
    for (var i = 0; i <_this.settings.data.model.length; i++) { 
      //console.log("-->",_this.settings.data.model[i])
      _this.settings.data.model[i].value=0
      for (var j = 0; j <_this.settings.data.strata[i].length; j++) { 
         //console.log("-->",_this.settings.data.strata[i][j].value)
        _this.settings.data.model[i].value += _this.settings.data.strata[i][j].value
      }
      //console.log("-->",_this.settings.data.model[i].value)
      initValue.push(_this.settings.data.model[i].value)
      tdv += _this.settings.data.model[i].value
    }

    if(this.treeLayout){
      console.log("ici")
     this.setupBubbleChartPhysics(_this);
    }else{
     this.setupPieChartPhysics(_this);
    }
   
  };

  this.setupPieChartPhysics = function(_this){

    console.log("w",_this.settings.width)
    // Pivot drawing
    var radius = _this.settings.chart.radius
        csX    = _this.settings.chart.width/2+_this.settings.chart.x
        csY    = _this.settings.chart.height/2+_this.settings.chart.y
    var axis   = pivot(csX,csY,radius, _this.settings.chart.wallColor);
  
    //targets
    for (var i = 0;  i< _this.settings.data.model.length; i++) {
      _this.settings.sedimentation.incoming.target[i] = {x:csX,y:csY};
    }

    // Separation 
    var wall   = []
    var spacer = _this.settings.chart.spacer;
  
    // Incoming point
    var p      = 0;

    console.log("tdv",tdv)

    if (tdv==0){
      for (var i = 0; i <_this.settings.data.length; i++) { 
        initValue[i] = 1;
      }
      tdv = initValue.length
    }

    for (var i = 0; i <initValue.length; i++) { 
       v = initValue[i]
       a2 = ((v/2+p)/tdv)*360-90
       p += v
       a = (p/tdv)*360-90
       c = circularCoordinate(a2,radius*5,csX,csY)

    // incomming point setup 
       console.log(c)
      _this.settings.sedimentation.incoming.point[i] = c 
    
    // Bounds Wall drawing
    _this.chartPhySetup.grounds[i]= this.createBox(
                  _this,
                  csX,
                  csY,
                  spacer,
                  radius,
                  a,
                  radius,
                  'wall',
                  _this.settings.chart.wallColor);
    }
    console.log("w",_this.settings.chart.width)

  };

  this.update = function(_this,options){
    console.log("update")
    var defaultOptions = {cat:0,r:0}
    options.r-=90
    var angle          = (options.r+90)*(Math.PI/180)

    var c              = circularCoordinate(options.r,
                                    _this.settings.chart.radius,
                                    _this.settings.chart.width/2+_this.settings.chart.x,
                                    _this.settings.chart.height/2+_this.settings.chart.y)
   
    if(_this.chartPhySetup.grounds[options.cat]!=null) {
      var myBody = _this.chartPhySetup.grounds[options.cat].GetBody();
      var myPos  = myBody.GetWorldCenter();
      var myAngle= myBody.GetAngle()
      //console.log(myAngle)
      myPos.y    = c.y/ _this.settings.options.scale
      myPos.x    = c.x/ _this.settings.options.scale
      myAngle    = angle
      myBody.SetPosition(myPos);
      myBody.SetAngle(myAngle);      
      //console.log(myBody)
    }
  }

  // default token for stream 
  this.token = function (_this,options){
    var i = options;
    //console.log(options)
    var token = {
              x:(_this.settings.sedimentation.incoming.point[i].x+(Math.random()*2)),
              y:(_this.settings.sedimentation.incoming.point[i].y+(Math.random()*1)),
              t:_this.now(),
              size:_this.settings.sedimentation.token.size.original,
              category:i,
              phy:{
                  density:10,
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

  function circularCoordinate(degree,radius,posX,posY){
      j = degree*Math.PI/180
      var x = (Math.cos(j) * radius)+posX;
      var y = (Math.sin(j) * radius)+posY;
      var c = {x:x,y:y}
      return c
  }

  function pivot (centerSceneX,centerSceneY,radius,color){
    var scale           = _this.settings.options.scale
    var fixDef          = new _this.phy.b2FixtureDef;

    fixDef.density      = 1.0;
    fixDef.friction     = 0.5;
    fixDef.restitution  = 0.2;
    var bodyDef         = new _this.phy.b2BodyDef;
    fixDef.shape        = new _this.phy.b2CircleShape(radius/scale);
    bodyDef.position.Set(centerSceneX/scale, centerSceneY/scale);

    var axis            = _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    axis.m_userData     = {type:"wall",familyID:null,fillStyle:color,strokeStyle:color,r:radius}
    return  axis;
  }

  this.createBox = function (_this,x,y,w,h,a,r,type,color){
     var scale          = _this.settings.options.scale
     var fixDef         = new _this.phy.b2FixtureDef;
     var c              = circularCoordinate(a,r,x,y)

     fixDef.density     = 1.0;
     fixDef.friction    = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef        = new _this.phy.b2BodyDef;
     var angle          = (a+90)*(Math.PI/180)
     bodyDef.angle      = angle;//a+80 ;
     //create ground
     bodyDef.type       = _this.phy.b2Body.b2_staticBody;
     fixDef.shape       = new _this.phy.b2PolygonShape;
     fixDef.shape.SetAsBox(w/scale, h/scale);
     bodyDef.position.Set(c.x/scale,c.y/scale );
     var box = _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
     box.m_userData = {type:type,fillStyle:color,w:w,h:h,r:r}
     //console.log(box)
     return box
  }

  this.getPosition = function(_this){
    var result =[]
    for (var i = 0; i < _this.chartPhySetup.grounds.length; i++) {
      myElement = _this.chartPhySetup.grounds[i]
      myBody    = myElement.GetBody();
      //console.log(myBody.GetAngle())
      result.push({
        x:(myBody.GetWorldCenter().x* _this.settings.options.scale),
        y:(myBody.GetWorldCenter().y* _this.settings.options.scale),
        a:myBody.GetAngle(),
        w:myElement.m_userData.w,
        h:myElement.m_userData.h,
        r:myElement.m_userData.r,
      })
    };  
   return result 
  }


//  --------- --------- --------- --------- --------- --------- ---------
// Bubble ---------
  this.setupBubbleChartPhysics= function(_this){
    console.log("setupBubbleChartPhysics")

    var colSize = ( _this.settings.chart.width/ _this.settings.data.model.length)
    var colBwid = _this.settings.chart.spacer
    var colYpos = _this.settings.chart.height/2+_this.settings.y+colBwid
    var Ypos    = 0;//chart.position.y;
    var Xpos    = 0;//chart.position.x;
    var NumCol  = _this.settings.chart.column;
   // console.log(Xpos)
   // console.log( _this.settings.width)

  // array layout
  for( var i = 0 ; i<_this.settings.data.model.length; i++) {
      
      Xpos =  _this.settings.chart.x+(i%NumCol*colBwid)+(colBwid/2)
      Ypos =  _this.settings.chart.y+Math.floor(i/NumCol)*colBwid+(colBwid/2)
      //console.log("- "+i+" x:"+Xpos+" y:"+Ypos);
      _this.settings.sedimentation.incoming.target[i] = {x:Xpos,y:Ypos};
      
      pivot[i] = creatMyBubblePivot(Xpos,
                                    Ypos,
                                    _this.settings.chart.spacer,
                                    i);

      _this.settings.data.model[i].incomingPoint = {
                                     x:Xpos,
                                     y:Ypos
                                   };
      
    }

  }
function creatMyBubblePivot(Xpos,Ypos,radius,id){
   console.log("CreatMyBubblePivot",Xpos,Ypos,radius,id)
   
   var scale          = _this.settings.options.scale
   var fixDef         = new _this.phy.b2FixtureDef;
   var colorRange     = d3.scale.category10()

    fixDef.density    = 10000;
    fixDef.friction   = 0.0;
    fixDef.restitution= 0.0;

   var bodyDef        = new _this.phy.b2BodyDef;
   fixDef.shape       = new _this.phy.b2CircleShape(radius*scale);
   bodyDef.position.Set(Xpos/scale, Ypos/scale);

   var axis           = _this.world.CreateBody( bodyDef);
   var axisf          = axis.CreateFixture(fixDef);

   console.log(id,colorRange(id))
   axisf.m_userData   = {
                         type:"BubblePivot",
                         familyID:id,
                         fillStyle:_this.settings.chart.wallColor
                        }
   console.log(id,axisf)

   axisf.m_shape.m_radius = _this.settings.data.model[id].value/scale;
   //console.log(Xpos,Ypos)
   return axisf;
}

this.getPivotPosition =function (id){
  
  //console.log(_this.settings.data.model)

  if(typeof(id)!="undefined"){
    return this.pivot
  } else{
    var result=[];
      for( var i = 0 ; i<_this.settings.data.model.length; i++) {
        result.push(_this.settings.data.model[i])
    }
    return result
  }
}

function updatePivotFixPosition(x,y,id){
    var myBody        = pivot[id].GetBody();
    myBody.SetPosition(new b2Vec2(x/scale, y/scale));
    _this.settings.data.model[id].incomingPoint.x=x;
    _this.settings.data.model[id].incomingPoint.y=y;
    setFlowSpeed(speedFlow);

}
function setPivotPosition(x,y,id){
    for( var i = 0 ; i<categorys[id].joins.length; i++) {
      categorys[id].joins[i].SetTarget(new b2Vec2(x/scale, y/scale));
    }
}
function setPivotRadius(r,id){
    //nBodies[b].m_shape.m_radius
    pivot[id].m_shape.m_radius=r;
}


// Bubble ---------
//  --------- --------- --------- --------- --------- --------- ---------
  if (typeof(fn)!=undefined){
    var result = this[fn](_this,options);
    if (typeof(result)!=undefined){
      return result
    }
  }
  
}


})(jQuery);
