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

    init:function(_this){
      this.speed = _this.settings.data.stream.refresh
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
         _this.dataFlow[i] = setInterval(
                            (function(i,_this){
                              return function() { 
                                _this.settings.data.stream.now++
                                // find the element inside the chart conf files
                                var token = _this.chart[_this.settings.chart.type](_this,'token',i)
                                _this.addToken(token);
                              }
                            })(i,_this)
                            ,this.speed);
        }

      }else if (type=='tokens'){

        _this.dataFlow[0] = setInterval(
                            (function(i,_this){
                              return function() { 

                                _this.settings.data.stream.now++
                                //if(){
                                  //console.log('tokens',_this.settings.stream.now)
                                  for(var i = 0 ; i<_this.settings.data.tokens.length ; i++) {
                                     if(_this.settings.data.tokens[i].t==_this.settings.data.stream.now){
                                        _this.addToken(_this.settings.data.tokens[i]);
                                     }
                                  }
                                //}
                              }
                            })(i,_this)
                            ,this.speed);

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
      for( var i = 0 ; i<categorys.length ; i++) {
        window.clearInterval(dataFlow[i]);
      }
      window.clearInterval(decayFlow);
      dataFlow(categorys);
    }
}


})(jQuery);
