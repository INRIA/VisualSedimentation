jQuery(function($) {
  $("#ticker").tweet({
    username: "romsson",
    page: 1,
    avatar_size: 64,
    count: 1,
    loading_text: "fetching M&M's from Twitter.."
  }).bind("loaded", function() {

    var ul = $(this).find(".tweet_list");
    var ticker = function() {
      setTimeout(function() {

        var cat = Math.floor(Math.random()*6);
        var catpx = (cat*500/6) + "px";
       
        $("#ticker").animate({width:'100px', height:'100px', marginLeft:catpx}, 500, 'linear', function() {
        }).addClass('circle')
          .html('<div class="innertext" style="background-image:url(img/'+colorRangeTmp[cat]+'mms.jpg); background-repeat:no-repeat; height:90px; width:90px;"></div>')
          .animate({"opacity":"1"}, 500, function() {
          //$("#ticker").slideUp({duration: 'slow', easing: 'easeOutBounce'}).hide();

          myBarChart.addToken({
            timestamp:1,
            categorie: cat,
            size:10,
            texture:{src:'img/'+colorRangeTmp[cat]+'mms20.jpg'},
            value: 1,
            userdata:{},
            callback:{}
          });  

          ticker();
      });

        /*
        ul.find('li:first').animate( {marginTop: '4em'}, 500, function() {
          $(this).detach().appendTo(ul).removeAttr('style');

      		var cat = Math.floor(Math.random()*6);
      	 	myBarChart.addToken({
      			timestamp:1,
      			categorie: cat,
      			size:10,
      			texture:{src:'img/'+colorRangeTmp[cat]+'mms20.jpg'},
      			value: 1,
      			userdata:{},
      			callback:{}
      		});  

        });
        ticker();
        */
      }, 2000);
    };

    ticker();
  });
});

$(document).ready(function()
{
$("#ticker").click(function()
{

 });
});
