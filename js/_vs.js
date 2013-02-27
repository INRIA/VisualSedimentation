// ....................................................................
// Main Visual Sedimentation Code
// ....................................................................

// TODO : 
// - callback on interaction (rollover, click, out ...)
// - update strate 
// - home exemple javascript
// - documentation
// - horloge

(function($){

// Name Space Plug in Jquery Objects
$.fn.vs = function (){}
$.fn._vs={}

// All this objects are define in correspondant .js files
$.fn._vs.token      = {}
$.fn._vs.draw       = {}
$.fn._vs.stream     = {}
$.fn._vs.chart      = {}
$.fn._vs.phy        = {}
$.fn._vs.decay      = {}
$.fn._vs.flocculate = {}
$.fn._vs.aggregate  = {}


// Core Classe 
var VisualSedimentation = function(element,options){

  // attach objects
  this.token        = $.fn._vs.token
  this.draw         = $.fn._vs.draw
  this.stream       = $.fn._vs.stream
  this.chart        = $.fn._vs.chart
  this.phy          = $.fn._vs.phy 
  this.decay        = $.fn._vs.decay 
  this.flocculate   = $.fn._vs.flocculate 
  this.aggregate    = $.fn._vs.aggregate 
  this.requestAnimFrame;
  

  // Mouse object have to be refactor
  this.mouse        ={}
  this.mouse.x      = 0
  this.mouse.y      = 0
  this.mouse.isMouseDragging = false
  this.mouse.isMouseDown     = false
  this.mouse.selectedBody    = null




  // Variables 
  this.dataFlow     = [];
  this.chartPhySetup= {}
  this.tokens       = [];
  this.world        = null;
  this.ctx          = null;
  var elem 	        = $(element);
  var self 	        = this;
	var tokens        = [];
	var B2D;   
	var canvas;


   // Default Settings  
	var defaultSettings = {
          x:0,
          y:0,
          width:290.5,
          height:300.5,
          DOMelement:null,

          chart:{ 
              x:undefined,
              y:undefined,
              width:undefined,
              height:undefined,
              colorRange:d3.scale.category10(),
              scale:d3.scale,
              type:'StackedAreaChart',
                  /*
                    name are based on prefuse tollokit layout :
                     - CircleLayout,
                     - StackedAreaChart,
                     //- bubbleAreaChart,
                     x AxisLabelLayout,
                     x AxisLayout,
                     x CollapsedStackLayout,
                     x GridLayout, 
                  */
              spacer:5,
              //treeLayout:false,
              column:3,
              wallColor:"rgba(230,230,230,0)",
              label:true,
              radius:10 // for CircleLayout
          },
          data:{
              model:[
                        {label:"Column A"},
                        {label:"Column B"},
                        {label:"Column C"},
                      ],
              strata:[ 
                        [
                          {value: 1, label: "Strata 1 col A"},
                          //{value: 1, label: "Strata 2 col A"}
                        ],[
                          {value: 1, label: "Strata 1 col B"},
                        ],[
                          {value: 1, label: "Strata 1 col C"},
                          //{value: 1, label: "Strata 2 col C"},
                          //{value: 0, label: "Strata 2 col C"}
                        ]      
                      ],
              token:[
                       {
                         timestamp:1,
                         categorie:1,
                         value: 1,
                         userdata:{},
                         callback:{}
                       }
                      ],
          		stream:{
                      provider:'generator',
          				    refresh:10000/8
      					},
          		}
          ,
          sedimentation:{
              token:{size:{original:4
                          ,minimum:2}
                          ,visible:true},   // fill color, shape,
              incoming:{
                        strategy:1,         // 1 = one element by one, more = by Groupe  
                        point:[{x:50,y:0},
                              {x:100,y:0},
                              {x:150,y:0}],

                        target:[{x:50,y:0},
                              {x:100,y:0},
                              {x:150,y:0}]
                        },
              granulate:{visible:false},
              flocculate:{
            			 number:1,	       // 1 = one element by one, more = by groupe of n
            			 action:"buffer",       	// [buffer,continue]
            			 strategy:"Size",       	// [BufferSize, Time, AcummulationAreaHeight, Fps, Manual]
                   bufferSize:5,         	  // number of token to make floculation
            			 bufferTime:1000,      	  // time buffer to make flocullation
            			 bufferHeight:50,       	// height (pixel) to make floculation
            			 bufferFrameRate:25,    	// if the computer is to slow floculate
                   buffer:[]
    					},
              suspension:{
                          height:null,      // pourcent,adaptative
                          incomming:'top',
                          decay:{power:null},
                          refresh:200
                         },
              accumulation:{height:null},   // pourcent ,adaptative
              aggregation:{height:0},       // pourcent ,adaptative
          },
          options:{
                  refresh:1000/25,
                  panel:false,
                  scale:30,
                  layout:false,
                  }
          }


     // get Box2d World 
     this.globalDecay = function (value){
      if(typeof(value)=='undefined'){
        return this.settings.sedimentation.suspension.decay.power
      }else{
        return this.settings.sedimentation.suspension.decay.power=value
      }
     }

     // get Box2d World 
     this.getWorld = function (){
      return this.world;
     }

     this.chartUpdate = function (cat,y){
      var options = {cat:cat,y:y}
      var tokens = this.chart[this.settings.chart.type](self,'update',options)
     }

     // Todo  ...... 
     this.flocculateTokens = function (number){
      return this.flocculate.update(self,number)
     }

     // TODO DESTROY ALL TOKENS 
    this.flocculateAll = function(){
        return this.flocculate.all(self)
     }

     // Add token function 
     this.addToken = function (element){
      //var token = this.token.addToken(self,element)
      return this.token.addToken(self,element);
     }
     
     // Select token fonction
     this.selectAll = function (key,value){
      return this.token.selectAll(self,key,value);
     }

     // Select token fonction
     this.select = function (key,value){
      return this.token.select(self,key,value);
     }

     // update a categorier in the chart
     this.updateAll = function (values){
      var tokens = this.chart.updateAll(self,key,value)
      return tokens;
     }

     // update a categorier in the chart
     this.update = function (key,value){
      var tokens = this.chart.update(self,key,value)
      return tokens;
     }


    /// Settings without 
    function modelToStrata (model){
      console.log("modelToStrata",model)
      var tmpstrata = null
      if(typeof(model[0])!="array"){
        console.log("is not an array ")
        for (var i = model.length - 1; i >= 0; i--) {
          tmpstrata = model[i]
          model[i]  = [tmpstrata]
        };
      }
      console.log(model)
      return model
    } 

    //////////////////////////// TOFIX
    // SAM @ROM1 : are you sure you need that ? extend doing it well normally
  	// Merge options with defaults
    // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    
    console.log("////////")
    //options.model = modelToStrata(options.data.model)

    function merge_options(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

     merge_options(defaultSettings, options);
     if(options.data!=undefined)
     defaultSettings.data = options.data;
     
     ////////////////////////////
     // Merge option and add the DOMelement to setting
     //this.settings = $.extend(defaultSettings, options || {});
     this.settings = $.extend(true,defaultSettings, options);
     this.settings.DOMelement = element
     //console.log('settings after extend',this.settings)

     // simple setup / if the chart pposition and size is not define use the  viewport position and size by default
     if(typeof(this.settings.chart.width) =="undefined"){this.settings.chart.width = this.settings.width}
     if(typeof(this.settings.chart.x)     =="undefined")this.settings.chart.x=0
     if(typeof(this.settings.chart.y)     =="undefined")this.settings.chart.y=0
     if(typeof(this.settings.chart.height)=="undefined")this.settings.chart.height=this.settings.height


     // Initialisation - Private method 
     this.init = function(){
       // requestAnim shim layer by Paul Irish
       // not use yet, to add
       this.requestAnimFrame = (function(){
         return  window.requestAnimationFrame       || 
                 window.webkitRequestAnimationFrame || 
                 window.mozRequestAnimationFrame    || 
                 window.oRequestAnimationFrame      || 
                 window.msRequestAnimationFrame     || 
                 function(/* function */ callback, /* DOMElement */ element){
                   window.setTimeout(callback, 1000 / 60);
                 };
       })();

        //console.log(this.settings)
        console.log('Initialisation');
        
        // Create the physical simulation 
   		   this.world = new this.phy.b2World(
   		      new this.phy.b2Vec2(0, 0)       //gravity
   		     ,  true                 //allow sleep
   		   );

   	    // Create container and canvas for physical simulation drawing 
		    var container = element.appendChild(document.createElement("div"));
		    container.id  = "box_sediviz_"+GUID()
        container.width  = this.settings.width; // TOFIX
        container.height = this.settings.height;

        //console.log(container.id)
        // Allocate the new Element 
        this.settings.DOMelement = container

		    canvas 		    = container.appendChild(document.createElement("canvas"));
		    canvas.id 	  = "canvas";
		    canvas.width  = this.settings.width; // TOFIX
		    canvas.height = this.settings.height;
        canvas.style.position = "absolute"

        console.log(this.settings.width,this.settings.height)
        this.ctx = canvas.getContext("2d");  

       // Construct the Chart
       this.chart[this.settings.chart.type](self,'init')
       // Initiatlise tokens 
       this.token.init(self)
       // Draw d3
       if(typeof(this.settings.options.debugaggregate)=="undefined"){
        this.aggregate.init(self);
       }
       // Initiatlise tokens 
       this.stream.init(self)
       // Initiatlise decay
       this.flocculate.init(self)
       // Update stream 
       this.stream.update(self);



       //FORCE UPDATE CHART due to  (bug positionnement ) @rom1
      // this.aggregate.update(this)

   		 // Update the physical simulation 
  		 window.setInterval(
              function(){self.update(self);},
               self.settings.options.refresh/2
              );
       // Refresh canvas drawings 
       window.setInterval(
              function(){self.draw.update(self);},
              self.settings.options.refresh
              );
       // Update Decay 
       window.setInterval(
              function(){self.decay.update(self);},
              self.settings.sedimentation.suspension.refresh
       );
       //this.decay.update(self);




 // MOUSE PART 
 // inspired by box2d stuffs, have to clean and finish this ! 
 // http://www.emanueleferonato.com/2008/11/20/dragging-objects-with-box2d-flash/
 // --------------------------
   this.getBodyAtMouse=function (_this) {

      var x = _this.mouse.x/_this.settings.options.scale
      var y =_this.mouse.y/_this.settings.options.scale
      var mousePVec = new _this.phy.b2Vec2(x,y);
      var aabb  = new _this.phy.b2AABB();
      var area = 0.1
      //console.log(_this.mouse.x,_this.mouse.y)
      aabb.lowerBound.Set(x - area, y - area);
      aabb.upperBound.Set(x + area, y + area);
      
      // Query the world for overlapping shapes.
      _this.mouse.selectedToken = null;

      // MERCI JULIEN POUR LE CLOSURE 
      //selectedBody
      _this.world.QueryAABB(function(fixture){
        return getBodyCB(fixture,_this,mousePVec)
      }, aabb);

      return _this.mouse.selectedToken;
   }
   //http://stackoverflow.com/questions/11674200/how-to-send-prototype-method-as-a-callback-in-javascript
   // pb here 
   function getBodyCB(fixture,_this,mousePVec) {
       //console.log("phy",phy)
      //console.log("fixture",fixture.m_userData.type,fixture)

      if(fixture.GetBody().GetType() != _this.phy.b2Body.b2_staticBody) {
         //if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
            _this.mouse.selectedToken = fixture;
            return false;
         //}
      }
      return true;
   }

    this.handleMouseMove = function(e,_this) {
       canvasPosition   = {}
       canvasPosition.y = _this.settings.DOMelement.offsetTop
       canvasPosition.x = _this.settings.DOMelement.offsetLeft
      _this.mouse.x = (e.clientX - canvasPosition.x);
      _this.mouse.y = (e.clientY - canvasPosition.y);
      //console.log("mouse",e.clientX,e.clientY )
      //console.log("mouse",canvasPosition.x,canvasPosition.y )
      //console.log("=",_this.mouse.x,_this.mouse.y)
   };   

   document.addEventListener("mousemove",   function (e){onDocumentMouseMove(e,self)});
   document.addEventListener("mouseup",   function (e){onDocumentMouseUp(e,self)});
   document.addEventListener("mousedown", function (e){onDocumentMouseDown(e,self)});



   function onDocumentMouseOver(e,_this) {
     var s = _this.getBodyAtMouse(_this);
     //console.log(s)

        if(s!=null){
          if(typeof(s.m_userData)!="undefined"){
           if(typeof(s.m_userData.callback)!="undefined"){
            if(typeof(s.m_userData.callback.mouseover)=="function"){
                 s.m_userData.callback.mouseover(s.m_userData)  
            }
           }
          }
        }
   }

   function onDocumentMouseDown(e,_this) {
     //console.log("onDocumentMouseDown")
     _this.mouse.isMouseDown = true;
     // return false;
     _this.handleMouseMove(e,_this);
     var s = _this.getBodyAtMouse(_this);
    if(s!=null){
      if(typeof(s.m_userData)!="undefined"){
        if(typeof(s.m_userData.callback)!="undefined"){
          if(typeof(s.m_userData.callback.onclick)=="function"){
              s.m_userData.callback.onclick(s.m_userData)  
         }
        }
      }
     }
   }

      function onDocumentMouseUp(e,_this) {
        _this.mouse.isMouseDown = false;
       // isMouseDown = false;
       // return false;
       //console.log("onDocumentMouseUp")
      }
      function onDocumentMouseMove( e,_this ) {

       if(_this.mouse.isMouseDown){
           _this.mouse.isMouseDragging = true;
           _this.mouse.x = e.clientX;
           _this.mouse.y = e.clientY;
      
      }else{
          _this.handleMouseMove(e,_this);
          onDocumentMouseOver("move",_this)
      }
      //console.log("m",_this)
      }
  }       
    

  this.mouse.update = function (s) {   
      if(isMouseDown && (!mouseJoint)) {
         var body = getBodyAtMouse();
         if(body) {
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300.0 * body.GetMass();
            mouseJoint = world.CreateJoint(md);
            body.SetAwake(true);
         }
      }
      
      if(mouseJoint) {
         if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
         } else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
         }
      }
   
   };



 // MOUSE END 
 // --------------------------

    this.update = function (s) {
     	this.world.Step(1 / 60, 10, 10);
     	this.world.DrawDebugData();
     	this.world.ClearForces();
      //console.log('u')
     }

    var drawInit = function(){ 		  
      ctx.fillStyle = "rgb(200,0,0)";  
 		  this.ctx.font = "14pt Calibri,Geneva,Arial";
      this.ctx.fillText("Canvas ready for Visual Sedimentation ", 10, 20);
		  window.setInterval(
			   $.fn.vs.draw.refresh(ctx,world,this.settings)
			   , this.settings.options.refresh);
		 console.log("draw Init ")
     }

    // GUID generator from : 
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var GUID = function(){
        var S4 = function ()
        {
            return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
        };
    
        return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }

    this.settings = $.extend(this.settings, {} || {});
    console.log("ici",this.settings)
    this.init();
     
 };

$.fn.vs  = function(options){
  if (!arguments.length){var options={}}
  console.log('$.fn.vs settings',options)
     return this.each(function(){
         var element = $(this);
         // Return early if this element already has a plugin instance
         if (element.data('VisualSedimentation')) return;
         var visualSedimentation = new VisualSedimentation(this,options);
         // Store plugin object in this element's data
         element.data('visualSedimentation', visualSedimentation);
         //visualSedimentation.test();
     });
 };

})(jQuery);





