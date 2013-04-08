/*

	# Tools to play a buffer 
	# Need Jquery for AJAX stuff 
	# Author : Samuel Huron 

*/
var DataPlayer = function(data,setup){
              
  this.i 		= 0
  this.setting  = {
  	callback:function(e){
      console.log(e)
    },
  	rate:1000
  }

  this.interval = null

  this.play = function(buffer,callback){
    if(this.i<=(buffer.length-1)){
      if(typeof(buffer[this.i])!="undefined"){    
        if(typeof(this.setting.callback)!="undefined"){this.setting.callback(buffer[this.i])}
        this.i++;
      }
    } else {
      //console.log("no more fresh data ")
    }
  }

  this.start = function (data,setup){
  	var self = this
  	if(typeof(setup)!="undefined") {
  		this.setting = setup;
  	}
  	if(this.interval!=null) window.clearInterval(this.interval)
  	this.interval = window.setInterval(
  									function(){
  									self.play(data)}
  									,this.setting.rate)
  }
  

  this.start(data,setup)
  return this;
} 




