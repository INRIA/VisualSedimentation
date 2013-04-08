![Visual sedimentation](http://www.visualsedimentation.org/img/Towards-Visual-sedimentation.png "Toward visual sedimentation")

* 20-02-2013 workshop 
* @fabelier
* by @cybunk


---
#  #What is it ?

Dislcamer : early release ! We accept feedback !

* [1. Why we design it?](#3)
* [2. What we design ?](#8)
* [3. How to play with the javascript library =)](#12)

---
### 1. Why we design it ?
# Datastream 
* "a data stream is a sequence data packets used to transmit or receive information that is in the process of being transmitted."
-- <cite>[Wikipedia](http://en.wikipedia.org/wiki/Data_stream)</cite>


---
### Example of datastream constantly change ?
* [Rss feed of wikipedia editing](http://en.wikipedia.org/w/index.php?title=Special:RecentChanges&feed=atom) 
* [Twitter](https://twitter.com/) 
* Mail 
* Logs 
* And so on ...

---
### Classical chart update sucks on data streams.
<iframe src="http://www.youtube.com/embed/UDI4weoMu_0" frameborder="0" allowfullscreen></iframe>

---
# It's normal they are not made for that !
Normaly we use [this things](https://www.google.com/search?q=time+series) to present time.

---
# It's good, but in some case you want to have an overview and access to last element.

---
# 2. What we design ?

---
### Natural Sedimentation
* Rock fall down 
* Decay over time 
* And agregate into strata
![Natural sedimentation](http://www.visualsedimentation.org/img/natural-sedimentation.png "Natural sedimentation")

---
### Visual Sedimentation
![Natural sedimentation](http://www.visualsedimentation.org/img/physical-and-visual-sedimentation.png "Visual sedimentation")

---
## Visual sedimentation 
<iframe width="560" height="315" src="http://www.youtube.com/embed/g22b48oDJ8Q" frameborder="0" allowfullscreen></iframe>

---
# 3. How to play with the javascript library =)

---
## How to play with the javascript library =)
<iframe src="http://www.visualsedimentation.org/dev/examples/stackoverflow/" frameborder="0" allowfullscreen></iframe>


---
# First step :
1. Find one or several datastream(s). (rss, tweets ...)
2. Define what would be a token. (post entry? sentence? word? )
3. Define category to visualize it. (tags, regurlar expression)

---
# Second step, Download :
* [Go on git hub](https://github.com/INRIA/VisualSedimentation)
* Click on the **☆** if you like it :-)
* And Download it !

---
### Files organization :
* **build** : don't care 
* **css** : don't care 
* **documentation** : that's usefull to look on it sometimes
* **examples** : fun to play 
* **js** : the libs 
* **licence** :  don't care it's opensource
* [index.html](http://www.visualsedimentation.org)
	
---
### Third step, copy an example :

Make a folder examples/MyFolder/
And copy the file examples/simple/blankProject.html into examples/MyFolder/myProject.html

	mkdir examples/MyFolder
	cp examples/simple/blankProject.html examples/MyFolder/myProject.html

Open it in chrome browser !
And now you have your first VisualSedimentation chart.

---
### How it's look like :
*⌥⌘I* : Developper tool and Javascript console will help you to inspect : 

	<html>
	  <head>
	    <meta charset="utf-8">
	    <title>Name of your project</title>
	    <script type="text/javascript" src="../../js/_VisualSedimentation.js"></script>
	    <style>@import url(../../css/fan-of-mike-style.css);</style>
	   </head>
	   <body>
	      <h1>Name of your project</h1>
	      <div id="myDemo"></div>
	      <script type="text/javascript">	              
	              // setting 
	              var setting = {}
	              // initialise it
	              var scene = $("#myDemo").vs(mySettings).data('visualSedimentation');
	      </script>
	  </body>   
	</html>

---
### Change the setting, make it larger, add categories and show the layout : 
      mySettings = {
          width:500px,
          data:{
                model:[ {label:"Column A"},
                        {label:"Column B"},
                        {label:"Column C"},
                        {label:"Column D"},
                        {label:"Column E"}],
              },
          sedimentation:{
            token:{
              size:{original:10,minimum:3}
            },
          },
          options:{
            layout:true,
          }
        }
    
---
### Next what we will do : 
* Define the number of category you want 
* Stop the simulation flow 
* Create a token by your self 
* Real time update
* Use a callback on the mouse 

---
### Define the number of category you want  : 
Add a model object into your setting.data object :
 data:{
    model:[
            {label:"Column A"},
            {label:"Column B"}
            //(...)
    ],
  }

---
### Stop the simulation : 
Add a stream object into your setting.data object :
  data:{
    model:[
            {label:"Column A"},
            {label:"Column B"},
            {label:"Column C"},
    ],
    stream:{
      provider:'tokens',
      refresh:1000/6
    }
  }


---
### Create a token  :
* **⌥⌘I** open the console
* and add token with [addtoken()]() : 
  var mytoken = scene.addToken({
   size:30,
   category:1,
   t:1360164350473,
   texture:{src:'http://www.visualsedimentation.org/img/football.gif'},       
  })
* and then you could change is property with [attr()](): 
  mytoken.attr("size":5)

---
### Feed the visualization with your own datas.
Two possibility : 
* Re read scenario 
* Real time one, load your data in live 

---
### Re Read Scenario :
You can download a bunch of data had it in the setup with t as a timestamp
Just add you datas in the setting :

  var setting = {
        data:{
           model:[
            {label:"Column A"},
            {label:"Column B"},
            {label:"Column C"},
          ],
          stream:{
            provider:'tokens',
            refresh:1000/6
          },
          tokens:[
            {t:1,category:0},
            {t:1,category:1},
            {t:2,category:2}
          ]
        }
  }


---
### Load your data in live :
* What is your rss feed URL ?
  http://en.wikipedia.org/w/api.php?action=featuredfeed&feed=featured&feedformat=atom
 
  var ecodedURL = encodeURIComponent('http://en.wikipedia.org/w/api.php?action=featuredfeed&feed=featured&feedformat=atom')

---
### Load your data in live, bufferise your data :
* load minibuffer
    <script type="text/javascript" src="../lib/miniBuffer/miniBuffer.js"></script>

* setup it : 
        var bufferSetting = {
            // Query configuration
            queryUrl:"http://rss.dev.fabelier.org/dq",
            queryParam:{url:ecodedURL,nobuffer:Math.random()},
            callback:true,
            // data model 
            idTocheck:"id",
            objectToBufferize:null,
            // Timing and limitations
            delay:10000,
            maxElement:1000, // not implemented yet
            debug:true,
            callback:{}
          }
       miniBuffer.init(bufferSetting)  




---
### Load your data in live, play the data : 
       dataPlayer = {
                      i:0,
                      play:function(buffer){
                        if(this.i<=(buffer.length-1)){
                          console.log(this.i)
                          if(typeof(buffer[this.i])!="undefined"){          
                            // add token in Visualization
                            scene.addToken({
                              category:0,
                              size:10,
                              author:buffer[this.i].author,
                              label:buffer[this.i].title,
                              link:buffer[this.i].link,
                            })

                            // Update legend
                            $('#record').text((this.i+1)+" / "+buffer.length)

                            // INCREMENT 
                            this.i++;
                          }
                        } else {
                          console.log("no more fresh data ")
                        }
                      }
          } 
       var playData = window.setInterval(function(){
                                           dataPlayer.play(miniBuffer.buffer)
                                         },
                                         1000); 






---
# The End !
To know more : 
* on twitter : @sediviz
* mailing liste : google groupe
* website : visualsedimentation.org
* wiki : on github
* fun example : visualsedimentation.org/examples/
