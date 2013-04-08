
//http://www.realtimestatistics.net/rts/RTSp.js

//http://www.realtimestatistics.net/rts/init.php?host=worldometers&time=1361004724635

var truc     = require("./truc.js")
//console.log(truc.truc)

  function c(G, E) {
    function C(L, M) {
      s = new Array();
      for (var K = 0; K < 256; K++) {
        s[K] = K
      }
      var I = 0;
      var H;
      for (K = 0; K < 256; K++) {
        I = (I + s[K] + L.charCodeAt(K % L.length)) % 256;
        H = s[K];
        s[K] = s[I];
        s[I] = H
      }
      K = 0;
      I = 0;
      var J = "";
      for (var N = 0; N < M.length; N++) {
        K = (K + 1) % 256;
        I = (I + s[K]) % 256;
        H = s[K];
        s[K] = s[I];
        s[I] = H;
        J += String.fromCharCode(M.charCodeAt(N) ^ s[(s[K] + s[I]) % 256])
      }
      return J
    }
    function D(M) {
      var I = "0123456789abcdef";
      var J = new Array();
      for (var L = 0; L < 256; L++) {
        J[I.charAt(L >> 4) + I.charAt(L & 15)] = String.fromCharCode(L)
      }
      if (!M.match(/^[a-f0-9]*$/i)) {
        return false
      }
      if (M.length % 2) {
        M = "0" + M
      }
      var H = new Array();
      var K = 0;
      for (var L = 0; L < M.length; L += 2) {
        H[K++] = J[M.substr(L, 2)]
      }
      return H.join("")
    }
    function F(I, H) {
      return C(I, H)
    }
    console.log(escape(F(E, D(G))))
    return decodeURIComponent(escape(F(E, D(G))))
  }

  function w(D) {
    var C = D.split(".");
    if (C.length > j.RTS_keylen) {
      C.splice(0, C.length - j.RTS_keylen)
    }
    console.log(C)
    return C.join(".")
  }
j = {}
j.RTS_keylen = 2//'worldometers'
// "http://www.worldometers.info/"
F = c(truc.truc, w("www.worldometers.info"));
var E = JSON.parse(F);
console.log(E)
console.log(JSON.stringify(E))

