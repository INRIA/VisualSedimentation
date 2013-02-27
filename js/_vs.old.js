// ....................................................................
// Bar Chart Plug In
// ....................................................................
(function($){

var VisualSedimentation = function(element,options){

  var elem 	= $(element);
  var self 	= this;
  
  var world;
	var nBodies = [];
	var B2D;
	var canvas;
	var   b2Vec2             = Box2D.Common.Math.b2Vec2
      ,   b2AABB             = Box2D.Collision.b2AABB
      ,   b2BodyDef          = Box2D.Dynamics.b2BodyDef
      ,   b2Body             = Box2D.Dynamics.b2Body
      ,   b2FixtureDef       = Box2D.Dynamics.b2FixtureDef
      ,   b2Fixture          = Box2D.Dynamics.b2Fixture
      ,   b2World            = Box2D.Dynamics.b2World
      ,   b2MassData         = Box2D.Collision.Shapes.b2MassData
      ,   b2PolygonShape     = Box2D.Collision.Shapes.b2PolygonShape
      ,   b2CircleShape      = Box2D.Collision.Shapes.b2CircleShape
      ,   b2DebugDraw        = Box2D.Dynamics.b2DebugDraw
      ,   b2MouseJointDef    = Box2D.Dynamics.Joints.b2MouseJointDef
      ,   b2Shape            = Box2D.Collision.Shapes.b2Shape
      ,   b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
      ,   b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
      ,   b2Joint            = Box2D.Dynamics.Joints.b2Joint
      ,   b2PrismaticJointDef= Box2D.Dynamics.Joints.b2PrismaticJointDef
      ,   b2ContactListener  = Box2D.Dynamics.b2ContactListener
      ,   b2Settings         = Box2D.Common.b2Settings;


   // Default options 
	var defaultSettings =   {
          width:500,
          height:440,
          layout:'StackedAreaChart',// AxisLabelLayout, AxisLayout, CircleLayout, CollapsedStackLayout, GridLayout, StackedAreaChart
          data:{initial:[{label:'Label A',value:20},
                		{label:'Label B',value:10},
                		{label:'Label C',value:10}],
          		stream:{provider:"generator",
          				frequency:1000/60
      					},
          		}
          ,
          sedimentation:{
              token:{size:20},           			// fill color, shape,
              flocullate:{
            			 limit:5,               	// object size limit before floculate = 2pixels
            			 animation:"collective",	// [step,group,bySet] 
            			 action:"buffer",       	// [buffer,continue]
            			 startegy:"Size",       	// [BufferSize, Time, AcummulationAreaHeight, Fps, Manual]
            			 bufferSize:50,         	// number of token to make floculation
            			 bufferTime:10000,      	// time buffer to make flocullation
            			 bufferHeight:50,       	// height (pixel) to make floculation
            			 bufferFrameRate:25    		// if the computer is to slow floculate
    					},
              suspension:{height:null,incomming:'top'}, // pixel,pourcent,adaptative
              accumulation:{height:null},           // pixel,pourcent,adaptative
              agregation:{height:300},             // pixel,pourcent,adaptative
          },
          options:{spacer:10,
                  wallColor:"rgba(230,230,230,0)",
                  label:true,
                  panel:true,
                  refresh:1000/1000,
                  panel:false
                  }
          }
  	 // Merge options with defaults
     this.settings = $.extend(defaultSettings, options || {});

     // Public method
     this.publicMethod = function(){
        console.log('publicMethod() called!');
     };

     // Initialisation - Private method 
     this.init = function(){
        console.log(this.settings)
        console.log('Initialisation');
        //console.log(defaultSettings);
        // Create the physical simulation 
   		   world = new b2World(
   		      new b2Vec2(0, 10)    //gravity
   		     ,  true                 //allow sleep
   		   );

   	    // Create container and canvas for physical simulation drawing 
		    var container = element.appendChild(document.createElement("div"));
		    container.id  = "boxsediviz"
		    canvas 		    = container.appendChild(document.createElement("canvas"));
		    canvas.id 	  = "canvas";
		    canvas.width  = this.settings.width; // TOFIX
		    canvas.height = this.settings.height;  
		    console.log(element)
    
   		 //Update the physical simulation 
  		 window.setInterval(update, 1000 / 60);
     };

    var update = function () {
     	world.Step(1 / 60, 10, 10);
     	world.DrawDebugData();
     	world.ClearForces();
     }

    var drawInit = function(){
		  ctx = canvas.getContext("2d");  
 		  ctx.fillStyle = "rgb(200,0,0)";  
 		  ctx.font = "14pt Calibri,Geneva,Arial";
      ctx.fillText("Canvas ready for Visual Sedimentation ", 10, 20);
		  window.setInterval(
			   $.fn.vs.draw.refresh(ctx,world,this.settings)
			   , this.settings.options.refresh);
		 console.log("draw Init ")
     }

     this.stream     = $.fn.vs.stream;
     this.draw       = $.fn.vs.draw;
     this.tokens     = $.fn.vs.tokens;
     this.decay      = $.fn.vs.decay;
     this.flocculate = $.fn.vs.flocculate;


     this.init();
     //drawInit();

     this.stream.test();
 };

visualSedimentation.fn = VisualSedimentation.prototype = {
    // API Methods
    hide: function() {
        this.node.style.display = 'none';
        return this;
    },
    
   /* gr:function(){
    	console.log("test ....")
    }*/
    // More methods here, each using 'return this', to enable chaining
};


visualSedimentation.fn.gr= function(){
	console.log("ici VsBarChart.fn.draw")
};

$.fn.visualSedimentation = VisualSedimentation;

$.fn.vs  = function(f,options){
	 console.log(this);
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
$.fn.visualSedimentation.vs = VisualSedimentation;

})(jQuery);





