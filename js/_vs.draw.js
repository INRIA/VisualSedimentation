(function ($) {
  
$.fn._vs.draw = {

    settings:{
              draw:{
                trail:1,
                showLayout:false
              }
    },

    update:function(_this){
      /* refresh rate of canvas (show trail) */
      //console.log(_this.ctx)
      if(this.settings.draw.trail==1) {
        _this.ctx.clearRect(0, 0, _this.ctx.canvas.clientWidth, _this.ctx.canvas.clientHeight);
      }else{
        debugDrawChart(0,
            0,
            ctx.canvas.clientWidth,
            ctx.canvas.clientHeight,
            "rgba(255,255,255,"+this.settings.draw.trail+")",
            ctx);
      }

      /* Draw body(s) from box2d */
      for( var b = _this.world.GetBodyList() ; b ; b = b.GetNext()) {
        for (var s = b.GetFixtureList(); s != null; s = s.GetNext()) {
          this.drawShape(_this,s);
        }
      }
    
      /* Show wireframe mode */
      if(this.settings.draw.showLayout==true){
        this.debugDrawChart(chart.position.x,
                chart.position.y,
                chart.position.width,
                chart.position.height,
                "rgba(255,0,0,0.2)",
                ctx);
      }
    },
    debugDrawChart :function (x,y,w,h,color,ctx) {
      ctx.save();  
      ctx.translate(0,0);  
      ctx.fillStyle = color;  
      ctx.beginPath();
      ctx.rect(x,y,w,h);      
      ctx.closePath();
      ctx.strokeStyle ="#000"
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();  
    },
    showTexture:function( s, ctx ){
      if (typeof(s.m_userData.texture) !== "undefined" && typeof(s.m_userData.texture.pattern) !== "undefined") {
          ctx.fillStyle = s.m_userData.texture.pattern;
          ctx.fill();
      }
    },
    
    drawShape: function (_this,s) {
    var b           = s.GetBody();
    var position    = b.GetPosition();
    var angle       = b.GetAngle();
    var radiusCoef  = 9;
    var radiusCoefMax=10
    var scale       = _this.settings.options.scale

    // add x and y to userData
    s.m_userData.x  = b.GetWorldCenter().x*scale
    s.m_userData.y  = b.GetWorldCenter().y*scale



    if(typeof(s)!="undefined"){
    switch (s.GetType()){
      case 0:  // round

        switch (s.m_userData){
          case null:
            _this.ctx.fillStyle = "rgba(255,0,0,1)";  
          break;
          default:
            _this.ctx.fillStyle = s.m_userData.fillStyle;  
          break
        }

        var radius = s.m_shape.m_radius

        // round token 
        if(_this.settings.sedimentation.token.visible==true){

          _this.ctx.save();  
          _this.ctx.translate(position.x*scale, position.y*scale);  
          _this.ctx.rotate(angle);  
          _this.ctx.beginPath();
          var h = (radius/radiusCoefMax*radiusCoef)*scale
          
          //console.log(s.m_userData.strokeStyle)
          if(typeof(s.m_userData.strokeStyle)!="undefined"){
            _this.ctx.strokeStyle = s.m_userData.strokeStyle
          } else{ 
            _this.ctx.strokeStyle = "rgba(0,0,0,0)"
          }

          if(typeof(s.m_userData.lineWidth)!="undefined"){
            _this.ctx.lineWidth   = s.m_userData.lineWidth 
          } else { 
            _this.ctx.lineWidth = 0
          }
          
          _this.ctx.arc(0, 0,h, 0, Math.PI*2, true); 

          _this.ctx.closePath();

          if(_this.settings.options.layout==true){
            _this.ctx.strokeStyle = "#000"
            _this.ctx.lineWidth   = 0.5
            _this.ctx.stroke();
          }else{
             _this.ctx.fill();
             _this.ctx.stroke();
             this.showTexture(s, _this.ctx);

          }

          _this.ctx.restore();

        }


      break
      case 1: // vertice (polygon and squares ...)

        //if(s.m_userData.type != "wall" && s.m_userData.type != "lift")console.log("draw",s.m_userData)
        
        switch (s.m_userData){
          case null:
            _this.ctx.fillStyle = "rgba(255,0,0,1)";  
          break;
          default:
            _this.ctx.fillStyle = s.m_userData.fillStyle;  
          break
        }

        var width = s.m_shape.m_vertices[0].x*scale
        var height = s.m_shape.m_vertices[0].y*scale
        var posx = position.x*scale-s.m_shape.m_vertices[0].x*scale
        var posy = position.y*scale-s.m_shape.m_vertices[0].y*scale
        
        _this.ctx.save();
        _this.ctx.translate(position.x*scale, position.y*scale); 
        _this.ctx.rotate(angle);
        _this.ctx.beginPath();

        //if(s.m_userData.ID==1 ){ console.log(s.m_userData.lineWidth) }
        //if(typeof(s.m_userData.fillStyle)!="undefined")   _this.ctx.fillStyle   = s.m_userData.fillStyle
        if(typeof(s.m_userData.strokeStyle)!="undefined"){ _this.ctx.strokeStyle = s.m_userData.strokeStyle
        } else{   _this.ctx.strokeStyle = s.m_userData.fillStyle}

        if(typeof(s.m_userData.lineWidth)!="undefined"){  _this.ctx.lineWidth   = s.m_userData.lineWidth 
        } else{   _this.ctx.lineWidth = 0}

        for (var i = 0; i < s.m_shape.m_vertices.length; i++) {
          var points = s.m_shape.m_vertices;
          //var this = {x:0,y:0}
          _this.ctx.moveTo(( points[0].x) * scale, (points[0].y) * scale);
          for (var j = 1; j < points.length; j++) {
             _this.ctx.lineTo((points[j].x ) * scale, (points[j].y ) * scale);
          }
          _this.ctx.lineTo(( points[0].x) * scale, ( points[0].y) * scale);
        }
        _this.ctx.closePath();
        
        
        _this.ctx.fill();
        
        this.showTexture(s, _this.ctx);

        // pour le debug mode
        if(_this.settings.options.layout==true){
          _this.ctx.lineWidth   = .25;
          _this.ctx.strokeStyle ="rgb(0,0,0)"
          _this.ctx.stroke();

          // incomming points Drawer
          //for (var i = _this.settings.sedimentation.incoming.point.length - 1; i >= 0; i--) {
            //
            //_this.settings.sedimentation.incoming.point[i].y
            // draw green 
            //_this.ctx.font = '40px Arial';
            //_this.ctx.fillText("x", _this.settings.sedimentation.incoming.point[i].x, _this.settings.sedimentation.incoming.point[i].y);
            //_this.ctx.fillStyle = "rgb(0,250,0,0.5)";  

          //};

        }else{
          _this.ctx.stroke();
        }
        _this.ctx.restore();

      break;
      case 2:
  
      break;
      _this.ctx.fillStyle = "rgb(0,0,0)";  
    }
   }

    // Call back draw 
    if(typeof(s.m_userData.callback)!="undefined"){
        if(typeof(s.m_userData.callback.draw)=="function"){
               var t = _this.select('ID',s.m_userData.ID)
               s.m_userData.callback.draw(t)  
        }
    }

    //if(s.m_userData.fillStyle=="black"){
    //  console.log(s.m_userData.cycle,"",s)
    //}
  }
}

})(jQuery);
