var myPodium,
    myTweetSource,
    myQueueManager;

var columnCounts,
    onlineTweets = [],
    dumpIsPaused = false;

var MAX_TWEETS_BEFORE_DUMP = 20,
    TWEETS_TO_DUMP_AT_ONCE = 10;

function updateLastTweetList() {
    var _filtered = myTweetSource, //.afterDate(startHour),
        _txtFilter = ""//$("#btv-cp-champ-filtre").val(),
        _reFilter = null;
    if (_txtFilter.length > 1) {
        _filtered = _filtered.search(_txtFilter);
        _reFilter = regexpFromText(_txtFilter);
        for (var _i = 0; _i < onlineTweets.length; _i++) {
            if (onlineTweets[_i].text.search(_reFilter) == -1) {
                $('#'+onlineTweets[_i].id_str).fadeTo(250, 0.1);
            } else {
                $('#'+onlineTweets[_i].id_str).fadeTo(250, 1);
            }
        }
    } else {
        for (var _i = 0; _i < onlineTweets.length; _i++) {
            $('#'+onlineTweets[_i].id_str).fadeTo(250, 1);
        }
    }
    $('#btv-cp-liste-tweets-tout').html(
        _filtered.reverse().slice(0,20).map(function(_t) {
            return '<li onclick="addTweetToSelection(this); return false;"><a title="Ajouter à la sélection" href="#">'
                + '<span class="btv-cp-tweet-date tweet-data-date">'
                + _t.created_at.match(/\d+:\d+:\d+/)[0]
                + '</span> <span class="btv-cp-tweet-from tweet-data-from">'
                + ( _reFilter ? ('@' + _t.from_user).replace(_reFilter, '<span class="btv-cp-highlight">$1</span>') : ('@' + _t.from_user) )
                + '</span> <span class="btv-cp-tweet-from-name tweet-data-from-name">'
                + _t.from_user_name
                + '</span> <span class="btv-cp-tweet-text tweet-data-text">'
                + ( _reFilter ? _t.text.replace(_reFilter, '<span class="btv-cp-highlight">$1</span>') : _t.text )
                + '</span><img class="btv-cp-tweet-image tweet-data-image" src="'
                + _t.profile_image_url
                + '" /><div class="btv-cp-tweet-button btv-cp-tweet-add"></div></a></li>'
        }).join('')
    );
}

function saveTweetSelection() {
    if (window.localStorage) {
        localStorage.setItem('listetweets', $("#btv-cp-liste-tweets-selection").html());
    }
}

function addTweetToSelection(_e) {
    $("#btv-cp-liste-tweets-selection").prepend(
        '<li><a title="Afficher sur l\'écran" href="#" onclick="showTweetOnScreen(this); return false;">'
        + '<span class="btv-cp-tweet-date tweet-data-date">'
        + $(_e).find(".tweet-data-date").text()
        + '</span>  <span class="btv-cp-tweet-from tweet-data-from">'
        + $(_e).find(".tweet-data-from").text()
        + '</span>  <span class="btv-cp-tweet-from-name tweet-data-from-name">'
        + $(_e).find(".tweet-data-from-name").text()
        + '</span> <span class="btv-cp-tweet-text tweet-data-text">'
        + $(_e).find(".tweet-data-text").text()
        + '</span><img class="btv-cp-tweet-image tweet-data-image" src="'
        + $(_e).find(".tweet-data-image").attr("src")
        + '" /><div class="btv-cp-tweet-button btv-cp-tweet-show"></div></a>'
        + '<a title="Supprimer de cette liste" href="#" onclick="$(this).parent().detach(); saveTweetSelection(); return false;"><div class="btv-cp-tweet-button btv-cp-tweet-remove"></div></a></li>'
    );
    saveTweetSelection();
}

function showTweetOnScreen(_e) {
    $("#btv-bigtweet").html('<img class="btv-bigtweet-image" src="'
    + $(_e).find(".tweet-data-image").attr("src")
    + '" /><p class="btv-bigtweet-screen-name">'
    + $(_e).find(".tweet-data-from").text()
    + '</p><p class="btv-bigtweet-name">'
    + $(_e).find(".tweet-data-from-name").text()
    +'</p><p class="btv-bigtweet-text">'
    + $(_e).find(".tweet-data-text").text()
    +'</p>').show();
    $(".btv-cp-hide-tweets").show();
}

function showTooltip(_t, _x, _y) {
    $("#btv-tooltip").html('<img class="btv-tooltip-image tweet-data-image" src="'
        + _t.profile_image_url
        + '" /><p class="btv-tooltip-name"><span class="tweet-data-from">'
        + _t.from_user
        + '</span> (<span class="tweet-data-from-name">'
        + _t.from_user_name
        +'</span>)<span class="btv-tooltip-date tweet-data-date">'
        + _t.created_at.match(/\d+:\d+:\d+/)[0]
        + '</span></p><p class="tweet-data-text">'
        + _t.text
        +'</p><div class="btv-tooltip-arrow"></div>').show().css({
            "left": _x + "px",
            "top": _y + "px",
        })
}

function hideTooltip() {
    $("#btv-tooltip").hide();
}

function showControlPanel() {
    $("#btv-cp-container").dequeue().animate({
            "left": 0
        });
}

function hideControlPanel() {
    $("#btv-cp-container").dequeue().animate({
            "left": "-315px"
        });
}

function updatePodiumAndLabels(_counts) {
    //myPodium.update(_counts);
    //$("#podium-chiffres").html(_counts.map(function(_c) {
    //    return '<li>' + _c + '</li>'
    //}).join(""));
}

function getPodium() {
    $.getJSON(serverUrl
        + 'podium/'
        + Math.floor(startHour/1000)
        + '/'
        + columnKeywords.map(function(_c) {
            return encodeURIComponent(_c);
        }).join(',')
        + '?callback=?',
    function(_data) {
        var _counts = columnKeywords.map(function(_c) {
            return _data.podium[_c] || 0;
        });
        $("#btv-cp-nb-tweets").html(_data.total);
        updatePodiumAndLabels(_counts);
   });
}

$(function() {
    columnCounts = columnKeywords.map(function() {
        return 0;
    })
    setInterval(function() {
        var _d = (new Date() - startHour),
            _t = Math.abs(Math.floor(_d/1000)),
            _s = _t % 60,
            _m = Math.floor(_t/60) % 60,
            _h = Math.floor(_t/3600);
        $("#btv-cp-temps").html(
            (_d < 0 ? '-' : '' ) + _h  + ':' + (_m < 10 ? '0' : '') + _m + ':' + (_s < 10 ? '0' : '') + _s
        )
    }, 500);
    
    
    if (typeof serverUrl != "undefined") {
        setInterval(getPodium, 2000);
    }
    
    $("#podium-labels").html(columnKeywords.map(function(_w) {
        return '<li>' + _w + '</li>'
    }).join(""));
    
    myTweetSource = new Btv_TweetSource({
        keywords: searchKeywords
    });
    myTweetSource.setOnNewTweets(function() {
        console.log("new tweets")
        updateLastTweetList();
        if (typeof serverUrl == "undefined") {
            var _filtered = this.afterDate(startHour);
            $("#btv-cp-nb-tweets").html(_filtered.count());
            var _counts = [];
            for (var _i = 0; _i < columnKeywords.length; _i++) {
                _counts.push(_filtered.search(columnKeywords[_i]).count());
            }
            updatePodiumAndLabels(_counts);
        }
    });
    myQueueManager = new Btv_TweetQueueManager(myTweetSource, function(_t) {
        var _cat = -1;
        for (var i = 0; i < columnKeywords.length; i++) {
            if (_t.text.search(regexpFromText(columnKeywords[i])) != -1) {
                _cat = i;
                break;
            }
        }
        if (_cat != -1) {
            _t.cat = _cat;
            columnCounts[_cat]++;
            onlineTweets.push(_t);
            //createBallTweetForce(_t);
            if (!dumpIsPaused) {
                for (var _i = 0; _i < columnCounts.length; _i++) {
                    if (columnCounts[_cat] > MAX_TWEETS_BEFORE_DUMP) {
                        var toDel = onlineTweets.splice(0,TWEETS_TO_DUMP_AT_ONCE);
                        
                        for (var _j = 0; _j < toDel.length; _j++) {
                            var _id = toDel[_j].id_str;
                            world.DestroyBody(b2bod[_id]);
                            
                            $('#'+_id).fadeTo(500, 0, function() {
                                $(this).remove(); 
                            });
                        }
                        
                        // Regenerate column counts
                        columnCounts = columnKeywords.map(function() {
                            return 0;
                        });
                        for (var _k = 0; _k < onlineTweets.length; _k++) {
                            columnCounts[onlineTweets[_k].cat]++;
                        }
                        break;
                    }
                }
            }
        }
    });
    
    $("#btv-cp-container").mouseover(showControlPanel).mouseout(hideControlPanel);
    
    $("#btv-cp-champ-filtre").keyup(function() {
        updateLastTweetList();
    });
    $("#btv-cp-clear-filtre").click(function() {
        $("#btv-cp-champ-filtre").val("");
        updateLastTweetList();
        return false; 
    });
    $("#btv-bigtweet, .btv-cp-hide-tweets").click(function() {
        $("#btv-bigtweet, .btv-cp-hide-tweets").hide();
    });
    $("#btv-cp-cont-pause-amont").click(function() {
       if (myQueueManager.playPause()) {
           $(this).removeClass("btv-cp-status-pause");
           $(this).addClass("btv-cp-status-play");
       } else {
           $(this).addClass("btv-cp-status-pause");
           $(this).removeClass("btv-cp-status-play");
       }
    });
    $("#btv-cp-cont-pause-aval").click(function() {
        dumpIsPaused = !dumpIsPaused
        if (dumpIsPaused) {
            $(this).removeClass("btv-cp-status-pause");
            $(this).addClass("btv-cp-status-play");
        } else {
            $(this).addClass("btv-cp-status-pause");
            $(this).removeClass("btv-cp-status-play");
        }
    });
    
    if (window.localStorage) {
        var _tw = localStorage.getItem('listetweets');
        if (_tw) {
            $("#btv-cp-liste-tweets-selection").html(_tw);
        }
    }
});