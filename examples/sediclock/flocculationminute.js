(function(){
	mySettings = {};
	mySettings.width=200;
	mySettings.height=200;
	mySettings.chart = {};
	mySettings.chart.x=0;
	mySettings.chart.y=0;				
	mySettings.data = {};      
	mySettings.data.model = [];      
	mySettings.data.model.push({label:"Time"});      
	mySettings.data.strata = [];//fstrata(); //TOFIX
	mySettings.data.stream = {};
	mySettings.data.stream.provider = 'direct';
	mySettings.sedimentation = {};
	mySettings.sedimentation.aggregation = {};
    mySettings.sedimentation.aggregation.height = 0;
	mySettings.sedimentation.token = {};
	mySettings.sedimentation.token.size = {};
	mySettings.sedimentation.token.size.original = 5;
	mySettings.sedimentation.token.size.minimum = 5;
	mySettings.sedimentation.aggregation.height = 200
	mySettings.options = {};
	mySettings.options.layout = true;

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

		return [
			[{value: month, text: fmon(d)},
			{value: date, text: fdat(d)},
			{value: weekday, text: fwee(d)},
			{value: hour, text: fhou(d)},
			{value: minute, text: fmin(d)},
			{value: second, text: fsec(d)}    
		]];
	};

	function initSeconds() {
		var _d = new Date;
		var _second = _d.getSeconds();
		for(var i=0; i<_second; i++)
			add_token(.5, colorRange(0), _d);
			
		d3.selectAll(".gpath").append("text")
				.attr("x", function(d, i) { return d3.selectAll(".layer_"+i).node().getBBox().width/2; })
				.attr("y", function(d, i) { return d3.selectAll(".layer_"+i).node().getBBox().y; })
				.attr("dx", function(d, i) { return d3.selectAll(".layer_"+i).node().getBBox().x; })
				.attr("dy",  function(d, i) { return d3.selectAll(".layer_"+i).node().getBBox().height/2; })
				.attr("text-anchor", "middle")
				.attr("class", "gtext")
				.attr("fill", "white")
				.text(function(d, i) {
					return mySettings.data.strata[0][i].text;
				});  				
	}		

	nb_updates = 0;

	function update() {

		if(new Date().getSeconds() == 0) {
			var tokens = sediClock.selectAll("category", 0); //select all token from categorie 1
			tokens.flocculate();
		}

		sediClock.addToken({
							category:0,
							x:mySettings.width/2,
							y:0,
							size: 10,
							userdata:{nameofmytoken:""},
							callback:{}});

			setTimeout(update, 1000);
	}

	var sediClock = $("#flocculationminute").vs(mySettings).data('visualSedimentation');
	setTimeout(update, 1000);
})();