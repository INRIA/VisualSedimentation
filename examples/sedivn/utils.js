  function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
      return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z'
  }

function toModel(arr) {
  var rv = [];
  for (var i = 0; i < arr.length; ++i)
    rv[i] = {label:arr[i],value:0};
  return rv;
}    
	    
function toStrata(arr) {
  var rv = [];
  for (var i = 0; i < arr.length; ++i)
    rv[i] = [{value: 1, label: "Strata 1"}]; 
  return rv;
}      
	
function truncate(string, size){
 if (string.length > size)
		return string.substring(0,size)+'...';
 else
		return string;
};

function init_array(size) {
  return new Array(size).join('0').split('').map(function(e) {return parseInt(e, 10);})  
}



