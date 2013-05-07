(function ($) {
//console.log("flocullate loaded")
$.fn._vs.flocculate = {

    buffer:[], 

    init:function(_this){
      //console.log("init flocculate",_this)
      // create one buffer by data model (categorys)
      for (var i =0; i<_this.settings.data.model.length; i++) {
        this.buffer[i] = []
        //console.log(i)
      };
    },


    // OLD STUFF NOT USED  
    addtobuffer:function(_this,token){
      c = token.attr("category")
      bufferSize =_this.settings.sedimentation.flocculate.bufferSize
      this.buffer[c].push(token)
      _this.decay.tokens.splice(_this.decay.tokens.indexOf(token),1)
      //
      token.attr("callback","bufferFlocculation",token)

      if(this.buffer[c].length > bufferSize){
        //console.log("order")
        this.update(_this,c,bufferSize)
      }
    },

    destroyIt:function(_this,token){
      token.attr("callback","flocculation",token) // callback 
      token.attr("state",2)                       // flocullating state
      //token.myobj=null
     // console.log(token.attr('ID'))
      var del = _this.world.DestroyBody(token.myobj.GetBody());
      
      return del
    },

    update:function(_this,c,nbtokens) {
      if(_this.settings.sedimentation.flocculate.number==1){
       while(this.buffer[c].length > nbtokens) {
         var token = this.buffer[c].shift();
         this.destroyIt(_this,token)
       }
      }else {
        while(this.buffer[c].length > _this.settings.sedimentation.flocculate.number) {
           var token = this.buffer[c].shift();
           this.destroyIt(_this,token)
        }
      }

    },

    disapear:function(_this,token){
      ///draft doesn't work
       window.setInterval(
        function(){token.update(self);},
         self.settings.options.refresh/2
        );
    },

    all:function(_this) {
      // TODO destroy all 
      //console.log(_this.settings.data)
      for (var i = _this.decay.tokens - 1; i >= 0; i--) {
        //console.log(_this.decay.tokens)
        this.update(_this,i,_this.tokens.length);      
      };
    },

    strategy:function(){
       if(flocullateBuffer.length>0){
         if (chart.flocullate.strategy=="Size" 
           && flocullateBuffer.length>=chart.flocullate.bufferSize){
           //console.log(flocullateBuffer.length);
           flocullateByArray(flocullateBuffer);

         }else if (chart.flocullate.strategy=="Time") {
  
         }else if (chart.flocullate.strategy=="Height") {
  
         };  
    }

}}    



})(jQuery);
