// JQuery Twitter Feed. Coded by www.tom-elliott.net (2012) and modified from https://twitter.com/javascripts/blogger.js
function tweet_feed(dtmms) {
    var displaylimit = 3;
    var twitterprofile = "tomelliott0";
    var showtweetlinks = true;

    var feeds = dtmms;
    var feedHTML = '';
    var displayCounter = 1;         
    for (var i=0; i<feeds.length; i++) {
      var username = feeds[i].user.screen_name;
      var profileimage = feeds[i].user.profile_image_url_https;
      var status = feeds[i].text; 
       
      if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {             
        if (showtweetlinks == true) {
            status = addlinks(status);
        }
         
        if (displayCounter == 1) {
            feedHTML += '<h1><a href="https://twitter.com/'+twitterprofile+'" target="_blank">@'+twitterprofile+'</a> on Twitter</h1>';
        }
                     
        feedHTML += '<div class="twitter-article">';                  
        feedHTML += '<div class="twitter-pic"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></div>';
        feedHTML += '<div class="twitter-text"><p>'+status+'<br/><span class="tweet-time">'+relative_time(feeds[i].created_at)+'</span></p></div>';
        feedHTML += '</div>';
        displayCounter++;
      }   
    }
}


//Function modified from Stack Overflow
function addlinks(data) {
  //Add link to all http:// links within tweets
  data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'" target="_blank">'+url+'</a>';
  });
       
  //Add link to @usernames used within tweets
  data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
  });
  return data;
}
 
function relative_time(time_value) {

  var values = time_value.split(" ");
  //time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'less than a minute ago';
  } else if(delta < 120) {
    return 'about a minute ago';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (120*60)) {
    return 'about an hour ago';
  } else if(delta < (24*60*60)) {
    return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
    return '1 day ago';
  } else {
    return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}

var transition_round = function(duration, transition) {
  setTimeout(function() {

    var cat = $('ul#list_tweets li:first').attr("data-mmsid");
    var catpx = (cat*500/6) + 20 ;
   
    $('ul#list_tweets li:first')
    //.animate({width:'50px', marginTop:'0px', marginLeft:catpx}, 350, 'linear', function() {})
    //.animate({height:'50px', marginTop:'20px', marginLeft:catpx+ "px"}, 100, 'linear', function() {})
    .animate({height:'20px', width:'20px', marginTop:'30px', marginLeft:catpx-15+ "px"}, transition, 'linear', function() {
    }).addClass('circle')
      .html('<div class="innertext" style="border-background-image:url(img/'+colorRangeTmp[cat]+'mms22.jpg); background-repeat:no-repeat; height:90px; width:90px;"></div>')
      .animate({"opacity":"0"}, 200, function() {
  
        myBarChart.addToken({
          t:1,
          category: cat,
          size:10,
          x:catpx+20,
          y:50,
          texture:{src:'img/'+colorRangeTmp[cat]+'mms20.jpg'},
          value: 1,
          userdata: {},
          fillStyle:"rgba(255,255,0,.9)",
          strokeStyle:'#fff', 
          lineWidth:0,
          callback:{},
          impulse:{       
            angle:200+Math.random()*140,     // angle 
            power:.05+Math.random()*.05,     // throw force
          }
        })

        $(this).remove();
        

        if(buffer_mms.tokens.length>0) {

          display_tweets(buffer_mms.tokens.shift())

        } else {

        }
    });
  }, duration);
}


function display_tweets(tweet) {

  // Before we continue we check that we got data
  if(typeof tweet != "undefined") {
    // Calculate how many hours ago was the tweet posted
    var date_tweet = new Date(tweet.created_at);
    var date_now = new Date();
    var date_diff = date_now - date_tweet;
    var hours = Math.round(date_diff/(1000*60*60));

    var username = tweet.from_user_name;
    var profileimage = tweet.profile_image_url_https;
    var status = tweet.text; 

    status = addlinks(status);
    feedHTML = '<li class="tweet_first tweet_odd" data-mmsid="'+tweet.mmsid+'" style="position:absolute; list-style:none"><div class="twitter-article">';                  
    feedHTML += '<div class="twitter-pic"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></div>';
    feedHTML += '<div class="twitter-text"><p>'+status+'<br/><span class="tweet-time">'+relative_time(tweet.created_at)+'</span></p></div>';
    feedHTML += '</div></li>';


    (function(b) {
      if(typeof b.tokens[0] != "undefined" && typeof b.tokens[0].profile_image_url_https != "undefined") {
          var tmp_next_img = new Image(); 
          tmp_next_img.src=b.tokens[0].profile_image_url_https;
      }
    })(buffer_mms)

    // Append html string to tweet_container div
    $('#list_tweets').append(feedHTML);
    all_played_tokens.push(tweet);
  }
}