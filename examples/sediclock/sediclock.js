//(function(){

	function fstrata() {
					
		var d = new Date;

		var fsec = d3.time.format("%S s"),
				fmin = d3.time.format("%M m"),
				fhou = d3.time.format("%H h"),
				fwee = d3.time.format("%a"),
				fdat = d3.time.format("%d d"),
				fmon = d3.time.format("%b");  
					
		function days() {
			return 32 - new Date(d.getYear(), d.getMonth(), 32).getDate();
		}					

		var second = (d.getSeconds() + d.getMilliseconds() / 1000) / 60,
			minute = (d.getMinutes() + second) / 60,
			hour = (d.getHours() + minute) / 24,
			weekday = (d.getDay() + hour) / 7,
			date = (d.getDate() - 1 + hour) / days(),
			month = (d.getMonth() + date) / 12;

		var text = Array(fmon, fdat, fwee, fhou, fmin, fsec);

		var gcol = d3.selectAll(".gcol")

		gcol.selectAll("text")
				.attr("x", function(d, i) { return d3.select(".layer_"+i).node().getBBox().width/2; })
				.attr("y", function(d, i) { return d3.select(".layer_"+i).node().getBBox().y; })
				.attr("dx", function(d, i) { return d3.select(".layer_"+i).node().getBBox().x; })
				.attr("dy",  function(d, i) { return d3.select(".layer_"+i).node().getBBox().height/2; })
				.attr("text-anchor", "middle")
				.attr("class", "gtext")
				.attr("fill", "white")
				.text(function(dd, i) {
					return text[i](d);
				});  

		return [
			[{value: function() {return month;}, text: fmon(d)},
			{value: function() {return date;}, text: fdat(d)},
			{value: function() {return weekday;}, text: fwee(d)},
			{value: function() {return hour;}, text: fhou(d)},
			{value: function() {return minute;}, text: fmin(d)},
			{value: function() {return second;}, text: fsec(d)}
		]];
	};

	var mySettings = {};
	mySettings.width=200;
	mySettings.height=400;
	mySettings.chart = {};
	mySettings.chart.x=0;
	mySettings.chart.y=0;			
	mySettings.chart.width=200;
	mySettings.chart.height=400;			
	mySettings.data = {};      
	mySettings.data.model = [];      
	mySettings.data.model.push({label:"Time"});      
	mySettings.data.strata = function() { return fstrata()};
	mySettings.data.stream = {};
	mySettings.data.stream.provider = 'direct';
	mySettings.sedimentation = {};
	mySettings.sedimentation.aggregation = {};
	mySettings.sedimentation.aggregation.strataType = "";
	mySettings.sedimentation.aggregation.height = 200;
	mySettings.sedimentation.token = {};
	mySettings.sedimentation.token.size = {};
	mySettings.sedimentation.token.size.original = 5;
	mySettings.sedimentation.token.size.minimum = 5;
	mySettings.options = {};
	mySettings.options.layout = false;
	
	var colorRange = d3.scale.category10();

	function initSeconds() {
		var _d = new Date;
		var _second = _d.getSeconds();

		for(var i=0; i<_second; i++)
			add_token(0, .5, colorRange(0), _d);

		d3.selectAll(".gpath").append("text")
			.attr("x", function(d, i) { return d3.select(".layer_"+i).node().getBBox().width/2; })
			.attr("y", function(d, i) { return d3.select(".layer_"+i).node().getBBox().y; })
			.attr("dx", function(d, i) { return d3.select(".layer_"+i).node().getBBox().x; })
			.attr("dy",  function(d, i) { return d3.select(".layer_"+i).node().getBBox().height/2; })
			.attr("text-anchor", "middle")
			.attr("class", "gtext")
			.attr("fill", "white")
			.text(function(d, i) {
				return 0;
			});  				


	}		

	nb_updates = 0;

	function update() {
		nb_updates++;
		d = new Date;
		mySettings.data.strata = function() { return fstrata();};
		d3.select("#current_time").text(d);
		var _second = d.getSeconds(), _millisecond = d.getMilliseconds();		
		if(_second==0) {
			var tokens = sediClock.selectAll("category", 0); //select all token from categorie 1
			tokens.flocculate();
			tokens = sediClock.selectAll("category", 1); //select all token from categorie 1
			tokens.flocculate();
		}
			
		if(nb_updates%5==0) { // 1second
			add_token(0, .5, colorRange(0), d);
		} else { // 200ms
			add_token(1, 3, colorRange(0), d);
		}
		
		//d3.selectAll(".gtext").text(function(d, i) { return text[i];});  		
		sediClock.strata.update(sediClock);
	}
	
	function add_token(cat, scale, fs, data) {

		sediClock.addToken({
							category:cat,
							x:mySettings.width/2,
							fillStyle: fs,
							y:0,
							size: mySettings.sedimentation.token.size.original/scale,
							userdata:{nameofmytoken:""},
							callback:{}});
	}
	
	var sediClock = $("#sediclock").vs(mySettings).data('visualSedimentation');
	sediClock.decay.update = function(a) { return; }; // prevent decay 
	setTimeout(initSeconds, 200);
	setInterval(update, 200);
//})();