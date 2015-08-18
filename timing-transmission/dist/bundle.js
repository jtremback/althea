(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// import * as ABC from './ABC.js'
// import EventEmitter from 'EventEmitter'

// Nodes can transmit data over frequencies (simulated by events)
// One mode of transmission uses 1s and 0s that are encoded and decoded into a value
// Another encodes data into a time interval and then decodes it

// let end = '11000000'.split().map(x => Number(x))

// let airwaves = new EventEmitter()

// let buffer = []

// airwaves.on('550', addToBuffer)
// airwaves.on('550', new SequenceRecognizer().checkBit)

var SequenceRecognizer = (function () {
  function SequenceRecognizer(sequence) {
    _classCallCheck(this, SequenceRecognizer);

    this.counter = 0;
    this.sequence = sequence;
  }

  _createClass(SequenceRecognizer, {
    checkBit: {
      value: function checkBit(bit) {
        if (bit !== this.sequence[this.counter]) {
          // The bit received is not what it should be for the sequence. Reset the
          // counter.
          this.counter = 0;
        } else {
          // The bit matches the sequence, increment counter.
          this.counter = this.counter + 1;
          if (this.counter === this.sequence.length) {
            // The sequence has been successfully recognized. Do something.
            console.log("recognized " + this.sequence + "!");
            return true;
          }
        }
      }
    }
  });

  return SequenceRecognizer;
})();

var end = "11000000".split("").map(function (x) {
  return Number(x);
});
var stream = "00001110100010010100010101100000001001000101010010101010110000000".split("").map(function (x) {
  return Number(x);
});

var sequenceRecognizer = new SequenceRecognizer(end);

stream.forEach(function (bit) {
  sequenceRecognizer.checkBit(bit);
});

// function addToBuffer (bit) {
//   buffer.push(bit)
// }

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2plaGFuL2FsdGhlYS90aW1pbmctdHJhbnNtaXNzaW9uL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxrQkFBa0I7QUFDVixXQURSLGtCQUFrQixDQUNULFFBQVEsRUFBRTswQkFEbkIsa0JBQWtCOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtBQUNoQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtHQUN6Qjs7ZUFKRyxrQkFBa0I7QUFLdEIsWUFBUTthQUFDLGtCQUFDLEdBQUcsRUFBRTtBQUNiLFlBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFOzs7QUFHdkMsY0FBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7U0FDakIsTUFBTTs7QUFFTCxjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQy9CLGNBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTs7QUFFekMsbUJBQU8sQ0FBQyxHQUFHLGlCQUFlLElBQUksQ0FBQyxRQUFRLE9BQUksQ0FBQTtBQUMzQyxtQkFBTyxJQUFJLENBQUE7V0FDWjtTQUNGO09BQ0Y7Ozs7U0FuQkcsa0JBQWtCOzs7QUFzQnhCLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztTQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Q0FBQSxDQUFDLENBQUE7QUFDbEQsSUFBSSxNQUFNLEdBQUcsbUVBQW1FLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7U0FBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO0NBQUEsQ0FBQyxDQUFBOztBQUU5RyxJQUFJLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXBELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDcEIsb0JBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0NBQ2pDLENBQUMsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBpbXBvcnQgKiBhcyBBQkMgZnJvbSAnLi9BQkMuanMnXG4vLyBpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ0V2ZW50RW1pdHRlcidcblxuLy8gTm9kZXMgY2FuIHRyYW5zbWl0IGRhdGEgb3ZlciBmcmVxdWVuY2llcyAoc2ltdWxhdGVkIGJ5IGV2ZW50cylcbi8vIE9uZSBtb2RlIG9mIHRyYW5zbWlzc2lvbiB1c2VzIDFzIGFuZCAwcyB0aGF0IGFyZSBlbmNvZGVkIGFuZCBkZWNvZGVkIGludG8gYSB2YWx1ZVxuLy8gQW5vdGhlciBlbmNvZGVzIGRhdGEgaW50byBhIHRpbWUgaW50ZXJ2YWwgYW5kIHRoZW4gZGVjb2RlcyBpdFxuXG4vLyBsZXQgZW5kID0gJzExMDAwMDAwJy5zcGxpdCgpLm1hcCh4ID0+IE51bWJlcih4KSlcblxuLy8gbGV0IGFpcndhdmVzID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbi8vIGxldCBidWZmZXIgPSBbXVxuXG4vLyBhaXJ3YXZlcy5vbignNTUwJywgYWRkVG9CdWZmZXIpXG4vLyBhaXJ3YXZlcy5vbignNTUwJywgbmV3IFNlcXVlbmNlUmVjb2duaXplcigpLmNoZWNrQml0KVxuXG5jbGFzcyBTZXF1ZW5jZVJlY29nbml6ZXIge1xuICBjb25zdHJ1Y3RvciAoc2VxdWVuY2UpIHtcbiAgICB0aGlzLmNvdW50ZXIgPSAwXG4gICAgdGhpcy5zZXF1ZW5jZSA9IHNlcXVlbmNlXG4gIH1cbiAgY2hlY2tCaXQgKGJpdCkge1xuICAgIGlmIChiaXQgIT09IHRoaXMuc2VxdWVuY2VbdGhpcy5jb3VudGVyXSkge1xuICAgICAgLy8gVGhlIGJpdCByZWNlaXZlZCBpcyBub3Qgd2hhdCBpdCBzaG91bGQgYmUgZm9yIHRoZSBzZXF1ZW5jZS4gUmVzZXQgdGhlXG4gICAgICAvLyBjb3VudGVyLlxuICAgICAgdGhpcy5jb3VudGVyID0gMFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYml0IG1hdGNoZXMgdGhlIHNlcXVlbmNlLCBpbmNyZW1lbnQgY291bnRlci5cbiAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciArIDFcbiAgICAgIGlmICh0aGlzLmNvdW50ZXIgPT09IHRoaXMuc2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgIC8vIFRoZSBzZXF1ZW5jZSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgcmVjb2duaXplZC4gRG8gc29tZXRoaW5nLlxuICAgICAgICBjb25zb2xlLmxvZyhgcmVjb2duaXplZCAke3RoaXMuc2VxdWVuY2V9IWApXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmxldCBlbmQgPSAnMTEwMDAwMDAnLnNwbGl0KCcnKS5tYXAoeCA9PiBOdW1iZXIoeCkpXG5sZXQgc3RyZWFtID0gJzAwMDAxMTEwMTAwMDEwMDEwMTAwMDEwMTAxMTAwMDAwMDAxMDAxMDAwMTAxMDEwMDEwMTAxMDEwMTEwMDAwMDAwJy5zcGxpdCgnJykubWFwKHggPT4gTnVtYmVyKHgpKVxuXG5sZXQgc2VxdWVuY2VSZWNvZ25pemVyID0gbmV3IFNlcXVlbmNlUmVjb2duaXplcihlbmQpXG5cbnN0cmVhbS5mb3JFYWNoKGJpdCA9PiB7XG4gIHNlcXVlbmNlUmVjb2duaXplci5jaGVja0JpdChiaXQpXG59KVxuXG4vLyBmdW5jdGlvbiBhZGRUb0J1ZmZlciAoYml0KSB7XG4vLyAgIGJ1ZmZlci5wdXNoKGJpdClcbi8vIH1cbiJdfQ==
