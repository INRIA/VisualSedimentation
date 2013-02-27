// ....................................................................
// Stream function 
// 
// ....................................................................

(function ($) {

$.fn._vs.stream = {
    i:null,
    buffer:[],
    speed:10000/6,
    strategy:null,
    type:null,
    _vs:null,
    init:function(_this){
      this.speed = _this.settings.data.stream.refresh
      this._vs   = _this
      //console.log('stream',_this)
      type       = _this.settings.data.stream.provider
    },
    push:function(elements){
      console.log(elements)
      for (var i = elements.length - 1; i >= 0; i--) {
        buffer.push(elements)
      };
    },
    update:function (_this){
      if(type=='generator'){
        for(var i = 0 ; i<_this.settings.data.model.length ; i++) {
        // Start stream data
         _this.dataFlow[i] = setInterval(
                            (function(i,_this){
                              return function() { 
                                // find the element inside the chart conf files
                                var token = _this.chart[_this.settings.chart.type](_this,'token',i)
                                _this.addToken(token);
                              }
                            })(i,_this)
                            ,this.speed);
        }
      }else if (type=='buffer'){
        console.log('buffer')
      }else{
        //console.log('direct no stream')
      }
    },
    generator:function(_this,fn){
      /*
      function sine(){}
      function cosine(){}
      function tane(){}
    */
    },
    test:function (_this){                                              
       _this.tokens.push(
         _this.token.createDataBarBall(
             _this,
             (_this.settings.sedimentation.incoming[i].x+(Math.random()*2)),
             (_this.settings.sedimentation.incoming[i].y+(Math.random()*1)),
              _this.settings.sedimentation.token.size,
              i)
       )                  
    },
    setSpeed:function(_this,speed){
      speedFlow  = speed;
      for( var i = 0 ; i<categories.length ; i++) {
        window.clearInterval(dataFlow[i]);
      }
      window.clearInterval(decayFlow);
      dataFlow(categories);
    }
}


})(jQuery);
