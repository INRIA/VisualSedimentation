/* Author: Raphaël Velt, IRI
 * 
 * Licence: CeCILL-B - http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html
 * 
 * */

function regexpFromText(_text) {
    return new RegExp('(' + _text.replace(/(\W)/gim,'\\$1') + ')','gim');
}

Btv_TweetArray = function() {
    this.tweets = [];
    this.idIndex = [];
}

Btv_TweetArray.prototype.push = function(_tweet) {
    this.tweets.push(_tweet);
    this.idIndex.push(_tweet.id_str);
}

Btv_TweetArray.prototype.setOnAdd = function(_callback) {
    this.onAdd = _callback;
}

Btv_TweetArray.prototype.addTweet = function(_tweet) {
    if (this.idIndex.indexOf(_tweet.id_str) != -1) {
        return;
    }
    if (!_tweet.date_value) {
        _tweet.date_value = Date.parse(_tweet.created_at.replace(/(\+|-)/,'UTC$1'));
    }
    var _pos = this.tweets.length;
    while (_pos && this.idIndex[_pos - 1] > _tweet.id_str) {
        _pos--;
    }
    this.tweets.splice(_pos,0,_tweet);
    this.idIndex.splice(_pos,0,_tweet.id_str);
    if (typeof this.onAdd == "function") {
        this.onAdd(_tweet);
    }
}

Btv_TweetArray.prototype.addMultipleTweets = function(_multiTweets) {
    var _l = _multiTweets.length;
    for (var _i = 0; _i < _l; _i++) {
        this.addTweet(_multiTweets[_i], true);
    }
}

Btv_TweetArray.prototype.count = function() {
    return this.tweets.length;
}

Btv_TweetArray.prototype.tweetAtPos = function(_i) {
    return this.tweets[_i];
}

Btv_TweetArray.prototype.slice = function(_start, _end) {
    var _slice = this.tweets.slice(_start, _end),
        _result = new Btv_TweetArray(),
        _l = _slice.length;
    for (var _i = 0; _i < _l; _i++) {
        _result.push(_slice[_i]);
    }
    return _result;
}

Btv_TweetArray.prototype.reverse = function() {
    var _result = new Btv_TweetArray(),
        _l = this.tweets.length;
    for (var _i = _l-1; _i >= 0; _i--) {
        _result.push(this.tweets[_i]);
    }
    return _result;
}

Btv_TweetArray.prototype.each = function(_callback) {
    var _l = this.count();
    for (var _i = 0; _i < _l; _i++) {
        _callback(this.tweets[_i]);
    }
}

Btv_TweetArray.prototype.map = function(_callback) {
    var _result = [];
    this.each(function(_tweet) {
        _result.push(_callback(_tweet))
    });
    return _result;
}

Btv_TweetArray.prototype.search = function(_filter) {
    var _filtered = new Btv_TweetArray(),
        _reFilter = regexpFromText(_filter);
    this.each(function(_tweet) {
        var _mention = '@' + _tweet.from_user;
        if (( _tweet.text.search(_reFilter) != -1 ) || ( _mention.search(_reFilter) != -1 )) {
            _filtered.push(_tweet);
        }
    });
    return _filtered;
}

Btv_TweetArray.prototype.beforeDate = function(_date) {
    var _filtered = new Btv_TweetArray();
    this.each(function(_tweet) {
        if (_tweet.date_value <= _date) {
            _filtered.push(_tweet);
        }
    });
    return _filtered;
}

Btv_TweetArray.prototype.afterDate = function(_date) {
    var _filtered = new Btv_TweetArray();
    this.each(function(_tweet) {
        if (_tweet.date_value > _date) {
            _filtered.push(_tweet);
        }
    });
    return _filtered;
}

Btv_TweetArray.prototype.tweetById = function(_tweetId) {
    var _index = this.idIndex.indexOf(_tweetId);
    return (_index ? this.tweets[_index] : null);
}

Btv_TweetArray.prototype.lastTweet = function() {
    return this.tweets[this.tweets.length - 1];
}

/*
 * 
 */

Btv_TweetSource = function(_opts) {
    Btv_TweetArray.call(this);
    this.loading = false;
    if (!_opts || !_opts.keywords || !_opts.keywords.length) {
        return;
    }
    this.options = _opts;
    var _this = this;
    this.retrieveInitialTweets();
    setInterval(function() {
        _this.retrieveNewTweets();
    }, 5000);
}

Btv_TweetSource.prototype = new Btv_TweetArray();

Btv_TweetSource.prototype.retrieveTweets = function(_opts) {
    
    function getTwitterUrl(url) {
        $.getJSON(url, function(data) {
            _currentPage++;
            var _isLast = true;
            if (data.results && data.results.length) {
                _this.addMultipleTweets(data.results);
                var _oldestTweetId = data.results[data.results.length - 1].id_str,
                    _maxId = _oldestTweetId;
                if (_currentPage < _opts.pages) {
                    _isLast = false;
                    getTwitterUrl(_baseurl + _firstparams + '&max_id=' + _maxId + _lastparams);
                }
            }
            
            if (_isLast) {
                _this.loading = false;
                if (typeof _this.onNewTweets == "function") {
                    _this.onNewTweets();
                }
            }
        });
    }
    
    
    if (this.loading) {
        return;
    }
    this.loading = true;
    var _baseurl = "http://search.twitter.com/search.json",
        _currentPage = 0,
        _firstparams = "?q="
            + encodeURIComponent(this.options.keywords.join(' OR '))
            + "&rpp=100"
            + (this.options.lang ? "&lang=" + this.options.lang : '' ),
        _lastparams = ( _opts.since_id ? "&since_id=" + _opts.since_id : '' )
            + "&callback=?",
        _jsonurl = _baseurl + _firstparams + _lastparams,
        _this = this;
    getTwitterUrl(_jsonurl);
    
}

Btv_TweetSource.prototype.retrieveInitialTweets = function() {
    this.retrieveTweets({
        "pages": 1
    });
}

Btv_TweetSource.prototype.retrieveNewTweets = function() {
    var _last = this.lastTweet();
    this.retrieveTweets({
        "pages": 1,
        "since_id": _last ? _last.id_str : 0
    });
}

Btv_TweetSource.prototype.setOnNewTweets = function(_callback) {
    this.onNewTweets = _callback;
}

Btv_TweetQueueManager = function(_tweetArray, _callback) {
    this.tweetArray = _tweetArray;
    this.majorInterval = 10000; // Time slices for calculating the minor Interval setting
    this.minimumInterval = 1000; // Safe limit to avoid tweets going to the wrong column
    this.initialBuffer = 300000; // don't start with empty columns, but show the tweets of the last five minutes - 5 * 60 * 1000 = 300000
    this.waitIfNoTweets = 2000;
    this.callback = _callback;
    this.lastEndTime = new Date().valueOf() - this.initialBuffer;
    this.isPaused = false;
    this.onMajorInterval();
}

Btv_TweetQueueManager.prototype.onMinorInterval = function() {
    if (this.isPaused) {
        this.waitMinorInterval();
    } else {
        var _l = this.currentSlice.count();
        if (this.position < _l) {
            this.callback(this.currentSlice.tweetAtPos(this.position));
            this.position++;
            this.waitMinorInterval();
        } else {
            this.onMajorInterval();
        }
    }
}

Btv_TweetQueueManager.prototype.waitMinorInterval = function() {
    var _this = this;
    window.setTimeout(function() {
        _this.onMinorInterval();
    }, this.minorInterval);
}

Btv_TweetQueueManager.prototype.onMajorInterval = function() {
    this.position = 0;
    this.currentSlice = this.tweetArray.afterDate(this.lastEndTime);
    var _l = this.currentSlice.count();
    if (_l) {
        this.lastEndTime = this.currentSlice.tweetAtPos(_l - 1).date_value;
        this.minorInterval = Math.floor(Math.max(this.minimumInterval, this.majorInterval / _l));
        this.onMinorInterval();
    } else {
        var _this = this;
        window.setTimeout(function() {
            _this.onMajorInterval();
        }, this.waitIfNoTweets);
    }
}

Btv_TweetQueueManager.prototype.playPause = function() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
}
