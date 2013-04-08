var utils = {
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
       function clone(obj) {
          if (null == obj || "object" != typeof obj) return obj;
          var copy = obj.constructor();
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
          }
          return copy;
       }
}