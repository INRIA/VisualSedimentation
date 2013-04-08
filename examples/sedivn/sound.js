// AUDIO PRE-LOADING 
var _mySnd = ["150hz.wav","250hz.wav","500hz.wav","750hz.wav","1000hz.wav","1250hz.wav","1500hz.wav"];
var _sndCollection = [], _sndSrc = [];

var sound_scale = d3.scale.linear()
.rangeRound([0, _mySnd.length-1])
.domain([1, 80]);

for (var i = 0; i < _mySnd.length; i++) {
	_sndCollection[i] = new Audio();
	_sndSrc[i] = document.createElement("source");
	_sndSrc[i].type = "audio/mpeg";
	_sndSrc[i].src  = "sounds/"+_mySnd[i];
	_sndCollection[i].appendChild(_sndSrc[i]);
}