/*

	# Tools to request and make a javascript client side mini buffer of element
	# Need Jquery for AJAX stuff 
	# Author : Samuel Huron 

*/

var miniBuffer = {
					defaultSetting:{
						// Query configuration
						queryUrl:"http://127.0.0.1:9616/q",
						queryParam:{query:"{}",limit:100,nobuffer:Math.random(),field:null},
						callback:true,

						// data model 
						idTocheck:"guid",
						objectToBufferize:null,
						
						// Timing and limitations
						delay:10000,
						maxElement:1000, // not implemented yet

						// trace element
						debug:true,

						// Callback to execute at each step
						callback:{
							//init:function(e){console.log(e)},
							//update:function(e){console.log(e)},
							//receive:function(e){console.log("# miniBuffer : Callback receive : ",e)},
							//check:function(e){console.log(e)}
						}
					},
					setting:{},
					buffer:[],
					interval:null,
					init:function(setup){
						var self = this
						if(typeof(setup)=="undefined") {
							this.setting = this.defaultSetting
						}else{
							this.setting = setup;
						}
						if(this.interval!=null) window.clearInterval(this.interval)
						self.update()
						this.interval = window.setInterval(
														function(){
														self.update()}
														,this.setting.delay)
					},

					update:function(){
					  console.log("# miniBuffer : Update")
					  var queryUrl = null
					  var paramUrl = {}

					  if (typeof(this.setting.queryParam)!="undefined" || this.setting.queryParam!=null){
					  	paramUrl= this.setting.queryParam
					  }

					  if (this.setting.callback){
					  	queryUrl = this.setting.queryUrl+"?callback=?"
					  }else{
					  	queryUrl = this.setting.queryUrl
					  }
					  var self = this;
					  $.getJSON(queryUrl,
					  			this.setting.queryParam,
					  			function(data){
					  				self.receive(data)
					  			});
					   if(typeof(this.setting.callback.update)!="undefined"){
							this.setting.callback.update(this.buffer)
					   }
					},

					receive:function(data){
						var toBufferize = data
						//console.log(toBufferize)
						//console.log(toBufferize.length)
						if(typeof(data[this.setting.objectToBufferize])!="undefined"){
							//console.log("array",data[this.setting.objectToBufferize].length)
							toBufferize = data[this.setting.objectToBufferize]
					    }
					    var numOfAddedElement = 0
					    for (var i = 0; i < toBufferize.length; i++) {
					       if (this.check(toBufferize[i])) {
					       		this.buffer.push(toBufferize[i]);
					       		numOfAddedElement++
					       };
					    }
					    //console.log("Mini buffer : ",numOfAddedElement)
					    if(typeof(this.setting.callback.receive)!="undefined"){
							this.setting.callback.receive(this.buffer)
					    }
					},

					check:function(data){
						for (var i = this.buffer.length - 1; i >= 0; i--) {	
							//console.log(this.buffer[i][this.setting.idTocheck],"?=",data[this.setting.idTocheck])
							if(this.buffer[i][this.setting.idTocheck] == data[this.setting.idTocheck]){
								//console.log("exist")
								return false
							}
						}
						//console.log("not exist")
						return true
					}

}