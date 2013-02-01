(function ($) {
$.fn.vs.chart = {
	/* 
		actually empty everything is in 
	   _vs.AxisLabelLayout.js,
       _vs.AxisLayout.js,
       _vs.CircleLayout.js,
       _vs.CollapsedStackLayout.js,
       _vs.GridLayout.js,
       _vs.StackedAreaChart.js
   

  this.update = function(_this,options){
    var defaultOptions = {cat:0,y:0}
    if(_this.chartPhySetup.grounds[options.cat]!=null) {
      var myBody = _this.chartPhySetup.grounds[options.cat].GetBody();
      var myPos = myBody.GetWorldCenter();
      myPos.y-=options.y/ _this.settings.options.scale;
      myBody.SetPosition(myPos);
      //console.log(myBody)
    }
  }

  this.getPosition = function(_this){
    var result =[]
    for (var i = 0; i < _this.chartPhySetup.grounds.length; i++) {
      myBody = _this.chartPhySetup.grounds[i].GetBody();
     
      console.log(myBody.GetWorldCenter())
     
      result.push({
        x:(myBody.GetWorldCenter().x* _this.settings.options.scale),
        y:(myBody.GetWorldCenter().y* _this.settings.options.scale),
        a:myBody.GetAngle()
      })
    
    };  
   return result 
  }
 */
}


})(jQuery);
