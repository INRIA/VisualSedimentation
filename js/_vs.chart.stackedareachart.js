(function ($) {

$.fn._vs.chart.StackedAreaChart = function(_this,fn,options) {
  var mouseJointTest;

  this.init = function (_this){
    //console.log('StackedAreaChart Init')
    gravity                 = new _this.phy.b2Vec2(0.001, 10);
    _this.world.m_gravity   = gravity;
    _this.chartPhySetup     = {grounds:[],wall:[]}
    this.setupChartPhysics(_this);
    //dataFlow(categorys);
  };
  
  this.setupChartPhysics = function(_this){

    // Ground 
    var spacer = _this.settings.chart.spacer;
    //console.log(_this.settings.chart)
  
    // Bounds for bar chart 
    var colSize     = (_this.settings.chart.width/_this.settings.data.model.length)
    var colBwid     = spacer;
    var colYpos     = _this.settings.chart.height/2+_this.settings.chart.y
    
    // height of lift 
    var agreHeight  =  _this.settings.chart.height - _this.settings.sedimentation.aggregation.height
    //console.log(agreHeight)

    var tdv = 0; 
    for (var i = 0; i <_this.settings.data.model.length; i++) { 
      _this.settings.data.model[i].value=0
      if(typeof(_this.settings.data.strata)!="undefined"){
        if(typeof(_this.settings.data.strata[i])!="undefined"){
         for (var j = 0; j <_this.settings.data.strata[i].length; j++) { 
          _this.settings.data.model[i].value += _this.settings.data.strata[i][j].value
         }
        } 
      }
      tdv += _this.settings.data.model[i].value
    }
    

    for( var i = 0 ; i<_this.settings.data.model.length+1 ; i++) {
        var colXpos = _this.settings.chart.x+(i*colSize);
        _this.chartPhySetup.wall[i] = this.createMyChartBox (
                          _this,
                          colXpos,
                          colYpos,
                          colBwid,
                          _this.settings.chart.height/2,
                          "wall",
                          _this.settings.chart.wallColor);

        //console.log(colXpos,colYpos)
  
        // Fix incomming points for tokens 
        if(i<_this.settings.data.model.length){
          _this.settings.sedimentation.incoming.point[i]={
                                                    x:colXpos+(colSize/2),
                                                    y:_this.settings.y
                                                    }
        }
  
  
        // Create lift 
       if(i<_this.settings.data.model.length){
          _this.chartPhySetup.grounds[i] = this.createMyChartBox (
                          _this,
                          colXpos+(colSize/2),
                          _this.settings.chart.height+_this.settings.chart.y+_this.settings.sedimentation.aggregation.height,
                          colSize/2,
                          _this.settings.chart.height,
                          "lift",
                          "rgba(250,250,250,0)");

          // Move Lift to data
          // based on scale (data / all data * height )
          /*
          if(_this.settings.data.model[i].value>=0){
            // ?????
            var liftPosition = (_this.settings.data.model[i].value/tdv*(_this.settings.chart.height-_this.settings.sedimentation.aggregation.height))
          }else{
            var liftPosition = 0          
          }*/
          this.update(_this,{cat:i,y:_this.settings.chart.height});
        }
    }
  };

  this.token = function (_this,options){
    //console.log('token query')
    var i = options;
    var token = {
              
              x:(_this.settings.sedimentation.incoming.point[i].x+(Math.random()*2)),
              y:(_this.settings.sedimentation.incoming.point[i].y+(Math.random()*1)),
              t:_this.now(),
              size:_this.settings.sedimentation.token.size.original,
              category:i,
              lineWidth:0,
            
            }
    return token; 
  }

  this.createMyChartBox = function (_this,x,y,w,h,type,color){
     var scale          = _this.settings.options.scale
     var fixDef         = new _this.phy.b2FixtureDef;
     fixDef.density     = 1.0;
     fixDef.friction    = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef  = new _this.phy.b2BodyDef;
     //create ground
     bodyDef.type   = _this.phy.b2Body.b2_staticBody;
     fixDef.shape   = new _this.phy.b2PolygonShape;
     fixDef.shape.SetAsBox(w/scale, h/scale);
     bodyDef.position.Set(x/scale,y/scale );
     var box        = _this.world.CreateBody(bodyDef).CreateFixture(fixDef);
     box.m_userData = {type:type,fillStyle:color,w:w,h:h,x:x,y:y}
     //console.log(box)
     return box
  }
  
  this.update = function(_this,options){
    var defaultOptions = {cat:0,y:0}
    if(_this.chartPhySetup.grounds[options.cat]!=null) {
      var myBody = _this.chartPhySetup.grounds[options.cat].GetBody();
      var myPos = myBody.GetWorldCenter();
      myPos.y = (options.y
                + _this.settings.chart.height
                +_this.settings.chart.y
                +_this.settings.sedimentation.aggregation.height)/ _this.settings.options.scale
      myBody.SetPosition(myPos);
      //console.log(myBody)
    }
  }
  

  this.getPositionOld = function(_this){
    var result =[]
    for (var i = 0; i < _this.chartPhySetup.grounds.length; i++) {
      myElement = _this.chartPhySetup.grounds[i]
      myBody    = myElement.GetBody();
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


  this.getPosition = function(_this){
    var result =[]
    for (var i = 0; i < _this.chartPhySetup.grounds.length; i++) {
      myElement = _this.chartPhySetup.grounds[i]
      myBody    = myElement.GetBody();
      //console.log("myBody.GetWorldCenter().y",myBody.GetWorldCenter().y)
      result.push({
        x:(myBody.GetWorldCenter().x* _this.settings.options.scale),
        y:(myBody.GetWorldCenter().y* _this.settings.options.scale)
          - _this.settings.chart.height
          - _this.settings.chart.y
          ,
        a:myBody.GetAngle(),
        w:myElement.m_userData.w,
        h:myElement.m_userData.h,
        r:myElement.m_userData.r,
      })
    };  
   return result 
  }



 if (typeof(fn)!=undefined){
    var result = this[fn](_this,options);  
    if (typeof(result)!=undefined){
      return result
    }
  }

}


})(jQuery);
