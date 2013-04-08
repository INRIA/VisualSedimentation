var utils = {

      // format a long number in string with "," each 3 digits
	    textFormating:function (value,separator,unit){
        var value = String(value)
        var transform = []
        var result=""

        for (var i = 0; i < value.length ; i+=3) {
          transform.push(value.substring(value.length-(i+3),value.length-i))
        };
        for (var i = transform.length - 1; i >= 0; i--) {
          result  += transform[i]
          if(i!=0)result+=separator
        };
        return result+" "+unit
       },

      // http://stackoverflow.com/questions/4068573/convert-string-to-pascal-case-aka-uppercamelcase-in-javascript
      toUpperCamelCase:function(str){
        str.replace(/(\w)(\w*)/g,function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
        return str
      },

      //http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
      clone:function(obj) {
          if (null == obj || "object" != typeof obj) return obj;
          var copy = obj.constructor();
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
          }
          return copy;
       }
}