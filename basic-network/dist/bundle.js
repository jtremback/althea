(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Graph = (function (undefined) {

  var extractKeys = function extractKeys(obj) {
    var keys = [],
        key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
    }
    return keys;
  };

  var sorter = function sorter(a, b) {
    return parseFloat(a) - parseFloat(b);
  };

  var findPaths = function findPaths(map, start, end, infinity) {
    infinity = infinity || Infinity;

    var costs = {},
        open = { "0": [start] },
        predecessors = {},
        keys;

    var addToOpen = function addToOpen(cost, vertex) {
      var key = "" + cost;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    };

    costs[start] = 0;

    while (open) {
      if (!(keys = extractKeys(open)).length) break;

      keys.sort(sorter);

      var key = keys[0],
          bucket = open[key],
          node = bucket.shift(),
          currentCost = parseFloat(key),
          adjacentNodes = map[node] || {};

      if (!bucket.length) delete open[key];

      for (var vertex in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          var cost = adjacentNodes[vertex],
              totalCost = cost + currentCost,
              vertexCost = costs[vertex];

          if (vertexCost === undefined || vertexCost > totalCost) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    } else {
      return predecessors;
    }
  };

  var extractShortest = function extractShortest(predecessors, end) {
    var nodes = [],
        u = end;

    while (u) {
      nodes.push(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  };

  var findShortestPath = function findShortestPath(map, nodes) {
    var start = nodes.shift(),
        end,
        predecessors,
        path = [],
        shortest;

    while (nodes.length) {
      end = nodes.shift();
      predecessors = findPaths(map, start, end);

      if (predecessors) {
        shortest = extractShortest(predecessors, end);
        if (nodes.length) {
          path.push.apply(path, shortest.slice(0, -1));
        } else {
          return path.concat(shortest);
        }
      } else {
        return null;
      }

      start = end;
    }
  };

  var toArray = function toArray(list, offset) {
    try {
      return Array.prototype.slice.call(list, offset);
    } catch (e) {
      var a = [];
      for (var i = offset || 0, l = list.length; i < l; ++i) {
        a.push(list[i]);
      }
      return a;
    }
  };

  var Graph = function Graph(map) {
    this.map = map;
  };

  Graph.prototype.findShortestPath = function (start, end) {
    if (Object.prototype.toString.call(start) === "[object Array]") {
      return findShortestPath(this.map, start);
    } else if (arguments.length === 2) {
      return findShortestPath(this.map, [start, end]);
    } else {
      return findShortestPath(this.map, toArray(arguments));
    }
  };

  Graph.findShortestPath = function (map, start, end) {
    if (Object.prototype.toString.call(start) === "[object Array]") {
      return findShortestPath(map, start);
    } else if (arguments.length === 3) {
      return findShortestPath(map, [start, end]);
    } else {
      return findShortestPath(map, toArray(arguments, 1));
    }
  };

  return Graph;
})();

module.exports = Graph;

},{}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Graph = _interopRequire(require("./djikstra.js"));

var nodes = {
  A: {
    peers: {
      C: { distance: 20 }
    },
    pings: {
      E: 3,
      F: 7
    }
  },
  B: {
    peers: {
      E: { distance: 25 },
      D: { distance: 8 } },
    pings: {
      A: 4,
      G: 2
    }
  },
  C: {
    peers: {
      A: { distance: 20 },
      D: { distance: 15 } },
    pings: {
      D: 8,
      B: 4
    }
  },
  D: {
    peers: {
      B: { distance: 8 },
      C: { distance: 15 },
      E: { distance: 13 },
      F: { distance: 11 } },
    pings: {
      C: 4,
      G: 9
    }
  },
  E: {
    peers: {
      B: { distance: 25 },
      D: { distance: 13 },
      F: { distance: 20 },
      G: { distance: 10 } },
    pings: {
      F: 5,
      A: 12
    }
  },
  F: {
    peers: {
      D: { distance: 11 },
      E: { distance: 20 },
      G: { distance: 6 } },
    pings: {
      B: 3,
      D: 9
    }
  },
  G: {
    peers: {
      E: { distance: 10 },
      F: { distance: 6 } },
    pings: {
      B: 4,
      C: 5
    }
  }
};

function prepMap(nodes) {
  var newNodes = {};
  for (var nodeName in nodes) {
    var node = nodes[nodeName];
    var newNode = newNodes[nodeName] = {};
    for (var peerName in node.peers) {
      newNode[peerName] = node.peers[peerName].distance;
    }
  }

  return newNodes;
}

function checkDistances(map) {
  for (var nodeName in map) {
    var node = map[nodeName];
    for (var peerName in node) {
      var distance = node[peerName];
      if (distance !== map[peerName][nodeName]) {
        throw new Error("mismatched node distances " + peerName + ", " + nodeName);
      }
    }
  }

  return map;
}

var graph = new Graph(checkDistances(prepMap(nodes)));

var Node = (function () {
  function Node(id, opts) {
    _classCallCheck(this, Node);

    this.id = id;
    this.peers = opts.peers;
    this.routes = opts.routes;
    this.pings = opts.pings;
    this.baseRate = opts.baseRate;

    this.stats = {
      forwardedTo: {}
    };
  }

  _createClass(Node, {
    recieve: {
      value: function recieve(message, peerFrom) {
        if (message.header.destinationAddress === this.id) {
          console.log(this.id, "recieved", message, "via", peerFrom);
        } else {
          // Forward along
          this._send(message, peerFrom);
        }
      }
    },
    _send: {
      value: function _send(message, peerFrom) {
        // Get peer for destinationAddress
        var peerTo = graph.findShortestPath(this.id, message.header.destinationAddress)[1];

        if (peerFrom) {
          // Then this is being forwarded for another node.
          console.log("forwarding message from " + peerFrom + " to " + peerTo);
          this._logForward(peerFrom, peerTo);
        }

        // Send to peer
        nodes[peerTo].recieve(message, this.id);
      }
    },
    _logForward: {
      value: function _logForward(peerFrom, peerTo) {
        // Log forwarding stats
        if (!this.stats.forwardedTo[peerTo]) {
          this.stats.forwardedTo[peerTo] = {};
        }
        if (!this.stats.forwardedTo[peerTo][peerFrom]) {
          this.stats.forwardedTo[peerTo][peerFrom] = 0;
        }
        this.stats.forwardedTo[peerTo][peerFrom] = this.stats.forwardedTo[peerTo][peerFrom] + 1;
      }
    },
    pingPeers: {
      value: function pingPeers() {
        for (var id in this.pings) {
          for (var i = 0; i < this.pings[id]; i++) {
            this._send({
              header: {
                destinationAddress: id,
                sourceAddress: this.id
              },
              body: "ping"
            });
          }
        }
      }
    },
    getStats: {
      value: function getStats() {
        return this.stats;
      }
    }
  });

  return Node;
})();

function makeNodes(nodes) {
  for (var id in nodes) {
    nodes[id] = new Node(id, nodes[id]);
  }
}

makeNodes(nodes);

for (var key in nodes) {
  nodes[key].pingPeers();
}

for (var key in nodes) {
  console.log(nodes[key].getStats());
}

//   A: {
//     B: 10
//   }

},{"./djikstra.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2plaGFuL2FsdGhlYS9zcGxpdC10aGUtZmVlL2RqaWtzdHJhLmpzIiwiL1VzZXJzL2plaGFuL2FsdGhlYS9zcGxpdC10aGUtZmVlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLEtBQUssR0FBRyxDQUFDLFVBQVUsU0FBUyxFQUFFOztBQUVoQyxNQUFJLFdBQVcsR0FBRyxxQkFBVSxHQUFHLEVBQUU7QUFDL0IsUUFBSSxJQUFJLEdBQUcsRUFBRTtRQUFFLEdBQUcsQ0FBQztBQUNuQixTQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDYixZQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbkU7QUFDRCxXQUFPLElBQUksQ0FBQztHQUNiLENBQUE7O0FBRUQsTUFBSSxNQUFNLEdBQUcsZ0JBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMzQixXQUFPLFVBQVUsQ0FBRSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUUsQ0FBQyxDQUFDLENBQUM7R0FDeEMsQ0FBQTs7QUFFRCxNQUFJLFNBQVMsR0FBRyxtQkFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDbkQsWUFBUSxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUM7O0FBRWhDLFFBQUksS0FBSyxHQUFHLEVBQUU7UUFDVixJQUFJLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBQztRQUNyQixZQUFZLEdBQUcsRUFBRTtRQUNqQixJQUFJLENBQUM7O0FBRVQsUUFBSSxTQUFTLEdBQUcsbUJBQVUsSUFBSSxFQUFFLE1B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QUFDSixPQUFDLEVBQUUsQ0FBQztLQUNMO0dBQ0Y7QUFDRCxHQUFDLEVBQUU7QUFDRCxTQUFLLEVBQUU7QUFDTCxPQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ25CLE9BQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFDbkI7QUFDRCxTQUFLLEVBQUU7QUFDTCxPQUFDLEVBQUUsQ0FBQztBQUNKLE9BQUMsRUFBRSxDQUFDO0tBQ0w7R0FDRjtBQUNELEdBQUMsRUFBRTtBQUNELFNBQUssRUFBRTtBQUNMLE9BQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDbkIsT0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUNwQjtBQUNELFNBQUssRUFBRTtBQUNMLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FBQyxFQUFFLENBQUM7S0FDTDtHQUNGO0FBQ0QsR0FBQyxFQUFFO0FBQ0QsU0FBSyxFQUFFO0FBQ0wsT0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTtBQUNsQixPQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ25CLE9BQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDbkIsT0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUNwQjtBQUNELFNBQUssRUFBRTtBQUNMLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FBQyxFQUFFLENBQUM7S0FDTDtHQUNGO0FBQ0QsR0FBQyxFQUFFO0FBQ0QsU0FBSyxFQUFFO0FBQ0wsT0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNuQixPQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ25CLE9BQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDbkIsT0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUNwQjtBQUNELFNBQUssRUFBRTtBQUNMLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FB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RyxDQUFDLENBQUE7T0FDeEY7O0FBRUQsYUFBUzthQUFDLHFCQUFHO0FBQ1gsYUFBSyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3pCLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLGdCQUFJLENBQUMsS0FBSyxDQUFDO0FBQ1Qsb0JBQU0sRUFBRTtBQUNOLGtDQUFrQixFQUFFLEVBQUU7QUFDdEIsNkJBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtlQUN2QjtBQUNELGtCQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQTtXQUNIO1NBQ0Y7T0FDRjs7QUFFRCxZQUFRO2FBQUMsb0JBQUc7QUFDVixlQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7T0FDbEI7Ozs7U0FsRUcsSUFBSTs7O0FBc0VWLFNBQVMsU0FBUyxDQUFFLEtBQUssRUFBRTtBQUN6QixPQUFLLElBQUksRUFBRSxJQUFJLEtBQUssRUFBRTtBQUNwQixTQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0dBQ3BDO0NBQ0Y7O0FBRUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUVoQixLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtBQUNyQixPQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7Q0FDdkI7O0FBRUQsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDckIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtDQUNuQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgR3JhcGggPSAoZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuXG4gIHZhciBleHRyYWN0S2V5cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIga2V5cyA9IFtdLCBrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosa2V5KSAmJiBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICB2YXIgc29ydGVyID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCAoYSkgLSBwYXJzZUZsb2F0IChiKTtcbiAgfVxuXG4gIHZhciBmaW5kUGF0aHMgPSBmdW5jdGlvbiAobWFwLCBzdGFydCwgZW5kLCBpbmZpbml0eSkge1xuICAgIGluZmluaXR5ID0gaW5maW5pdHkgfHwgSW5maW5pdHk7XG5cbiAgICB2YXIgY29zdHMgPSB7fSxcbiAgICAgICAgb3BlbiA9IHsnMCc6IFtzdGFydF19LFxuICAgICAgICBwcmVkZWNlc3NvcnMgPSB7fSxcbiAgICAgICAga2V5cztcblxuICAgIHZhciBhZGRUb09wZW4gPSBmdW5jdGlvbiAoY29zdCwgdmVydGV4KSB7XG4gICAgICB2YXIga2V5ID0gXCJcIiArIGNvc3Q7XG4gICAgICBpZiAoIW9wZW5ba2V5XSkgb3BlbltrZXldID0gW107XG4gICAgICBvcGVuW2tleV0ucHVzaCh2ZXJ0ZXgpO1xuICAgIH1cblxuICAgIGNvc3RzW3N0YXJ0XSA9IDA7XG5cbiAgICB3aGlsZSAob3Blbikge1xuICAgICAgaWYoIShrZXlzID0gZXh0cmFjdEtleXMob3BlbikpLmxlbmd0aCkgYnJlYWs7XG5cbiAgICAgIGtleXMuc29ydChzb3J0ZXIpO1xuXG4gICAgICB2YXIga2V5ID0ga2V5c1swXSxcbiAgICAgICAgICBidWNrZXQgPSBvcGVuW2tleV0sXG4gICAgICAgICAgbm9kZSA9IGJ1Y2tldC5zaGlmdCgpLFxuICAgICAgICAgIGN1cnJlbnRDb3N0ID0gcGFyc2VGbG9hdChrZXkpLFxuICAgICAgICAgIGFkamFjZW50Tm9kZXMgPSBtYXBbbm9kZV0gfHwge307XG5cbiAgICAgIGlmICghYnVja2V0Lmxlbmd0aCkgZGVsZXRlIG9wZW5ba2V5XTtcblxuICAgICAgZm9yICh2YXIgdmVydGV4IGluIGFkamFjZW50Tm9kZXMpIHtcbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFkamFjZW50Tm9kZXMsIHZlcnRleCkpIHtcbiAgICAgICAgICB2YXIgY29zdCA9IGFkamFjZW50Tm9kZXNbdmVydGV4XSxcbiAgICAgICAgICAgICAgdG90YWxDb3N0ID0gY29zdCArIGN1cnJlbnRDb3N0LFxuICAgICAgICAgICAgICB2ZXJ0ZXhDb3N0ID0gY29zdHNbdmVydGV4XTtcblxuICAgICAgICAgIGlmICgodmVydGV4Q29zdCA9PT0gdW5kZWZpbmVkKSB8fCAodmVydGV4Q29zdCA+IHRvdGFsQ29zdCkpIHtcbiAgICAgICAgICAgIGNvc3RzW3ZlcnRleF0gPSB0b3RhbENvc3Q7XG4gICAgICAgICAgICBhZGRUb09wZW4odG90YWxDb3N0LCB2ZXJ0ZXgpO1xuICAgICAgICAgICAgcHJlZGVjZXNzb3JzW3ZlcnRleF0gPSBub2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb3N0c1tlbmRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJlZGVjZXNzb3JzO1xuICAgIH1cblxuICB9XG5cbiAgdmFyIGV4dHJhY3RTaG9ydGVzdCA9IGZ1bmN0aW9uIChwcmVkZWNlc3NvcnMsIGVuZCkge1xuICAgIHZhciBub2RlcyA9IFtdLFxuICAgICAgICB1ID0gZW5kO1xuXG4gICAgd2hpbGUgKHUpIHtcbiAgICAgIG5vZGVzLnB1c2godSk7XG4gICAgICB1ID0gcHJlZGVjZXNzb3JzW3VdO1xuICAgIH1cblxuICAgIG5vZGVzLnJldmVyc2UoKTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICB2YXIgZmluZFNob3J0ZXN0UGF0aCA9IGZ1bmN0aW9uIChtYXAsIG5vZGVzKSB7XG4gICAgdmFyIHN0YXJ0ID0gbm9kZXMuc2hpZnQoKSxcbiAgICAgICAgZW5kLFxuICAgICAgICBwcmVkZWNlc3NvcnMsXG4gICAgICAgIHBhdGggPSBbXSxcbiAgICAgICAgc2hvcnRlc3Q7XG5cbiAgICB3aGlsZSAobm9kZXMubGVuZ3RoKSB7XG4gICAgICBlbmQgPSBub2Rlcy5zaGlmdCgpO1xuICAgICAgcHJlZGVjZXNzb3JzID0gZmluZFBhdGhzKG1hcCwgc3RhcnQsIGVuZCk7XG5cbiAgICAgIGlmIChwcmVkZWNlc3NvcnMpIHtcbiAgICAgICAgc2hvcnRlc3QgPSBleHRyYWN0U2hvcnRlc3QocHJlZGVjZXNzb3JzLCBlbmQpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcGF0aC5wdXNoLmFwcGx5KHBhdGgsIHNob3J0ZXN0LnNsaWNlKDAsIC0xKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhdGguY29uY2F0KHNob3J0ZXN0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHN0YXJ0ID0gZW5kO1xuICAgIH1cbiAgfVxuXG4gIHZhciB0b0FycmF5ID0gZnVuY3Rpb24gKGxpc3QsIG9mZnNldCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdCwgb2Zmc2V0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IG9mZnNldCB8fCAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgYS5wdXNoKGxpc3RbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICB9XG5cbiAgdmFyIEdyYXBoID0gZnVuY3Rpb24gKG1hcCkge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICB9XG5cbiAgR3JhcGgucHJvdG90eXBlLmZpbmRTaG9ydGVzdFBhdGggPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RhcnQpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm4gZmluZFNob3J0ZXN0UGF0aCh0aGlzLm1hcCwgc3RhcnQpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIGZpbmRTaG9ydGVzdFBhdGgodGhpcy5tYXAsIFtzdGFydCwgZW5kXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaW5kU2hvcnRlc3RQYXRoKHRoaXMubWFwLCB0b0FycmF5KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgfVxuXG4gIEdyYXBoLmZpbmRTaG9ydGVzdFBhdGggPSBmdW5jdGlvbiAobWFwLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdGFydCkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybiBmaW5kU2hvcnRlc3RQYXRoKG1hcCwgc3RhcnQpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgcmV0dXJuIGZpbmRTaG9ydGVzdFBhdGgobWFwLCBbc3RhcnQsIGVuZF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmluZFNob3J0ZXN0UGF0aChtYXAsIHRvQXJyYXkoYXJndW1lbnRzLCAxKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEdyYXBoO1xuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBHcmFwaFxuIiwiaW1wb3J0IEdyYXBoIGZyb20gJy4vZGppa3N0cmEuanMnXG5cbmxldCBub2RlcyA9IHtcbiAgQToge1xuICAgIHBlZXJzOiB7XG4gICAgICBDOiB7IGRpc3RhbmNlOiAyMCB9XG4gICAgfSxcbiAgICBwaW5nczoge1xuICAgICAgRTogMyxcbiAgICAgIEY6IDdcbiAgICB9XG4gIH0sXG4gIEI6IHtcbiAgICBwZWVyczoge1xuICAgICAgRTogeyBkaXN0YW5jZTogMjUgfSxcbiAgICAgIEQ6IHsgZGlzdGFuY2U6IDggfSxcbiAgICB9LFxuICAgIHBpbmdzOiB7XG4gICAgICBBOiA0LFxuICAgICAgRzogMlxuICAgIH1cbiAgfSxcbiAgQzoge1xuICAgIHBlZXJzOiB7XG4gICAgICBBOiB7IGRpc3RhbmNlOiAyMCB9LFxuICAgICAgRDogeyBkaXN0YW5jZTogMTUgfSxcbiAgICB9LFxuICAgIHBpbmdzOiB7XG4gICAgICBEOiA4LFxuICAgICAgQjogNFxuICAgIH1cbiAgfSxcbiAgRDoge1xuICAgIHBlZXJzOiB7XG4gICAgICBCOiB7IGRpc3RhbmNlOiA4IH0sXG4gICAgICBDOiB7IGRpc3RhbmNlOiAxNSB9LFxuICAgICAgRTogeyBkaXN0YW5jZTogMTMgfSxcbiAgICAgIEY6IHsgZGlzdGFuY2U6IDExIH0sXG4gICAgfSxcbiAgICBwaW5nczoge1xuICAgICAgQzogNCxcbiAgICAgIEc6IDlcbiAgICB9XG4gIH0sXG4gIEU6IHtcbiAgICBwZWVyczoge1xuICAgICAgQjogeyBkaXN0YW5jZTogMjUgfSxcbiAgICAgIEQ6IHsgZGlzdGFuY2U6IDEzIH0sXG4gICAgICBGOiB7IGRpc3RhbmNlOiAyMCB9LFxuICAgICAgRzogeyBkaXN0YW5jZTogMTAgfSxcbiAgICB9LFxuICAgIHBpbmdzOiB7XG4gICAgICBGOiA1LFxuICAgICAgQTogMTJcbiAgICB9XG4gIH0sXG4gIEY6IHtcbiAgICBwZWVyczoge1xuICAgICAgRDogeyBkaXN0YW5jZTogMTEgfSxcbiAgICAgIEU6IHsgZGlzdGFuY2U6IDIwIH0sXG4gICAgICBHOiB7IGRpc3RhbmNlOiA2IH0sXG4gICAgfSxcbiAgICBwaW5nczoge1xuICAgICAgQjogMyxcbiAgICAgIEQ6IDlcbiAgICB9XG4gIH0sXG4gIEc6IHtcbiAgICBwZWVyczoge1xuICAgICAgRTogeyBkaXN0YW5jZTogMTAgfSxcbiAgICAgIEY6IHsgZGlzdGFuY2U6IDYgfSxcbiAgICB9LFxuICAgIHBpbmdzOiB7XG4gICAgICBCOiA0LFxuICAgICAgQzogNVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcmVwTWFwIChub2Rlcykge1xuICBsZXQgbmV3Tm9kZXMgPSB7fVxuICBmb3IgKGxldCBub2RlTmFtZSBpbiBub2Rlcyl7XG4gICAgbGV0IG5vZGUgPSBub2Rlc1tub2RlTmFtZV1cbiAgICBsZXQgbmV3Tm9kZSA9IG5ld05vZGVzW25vZGVOYW1lXSA9IHt9XG4gICAgZm9yIChsZXQgcGVlck5hbWUgaW4gbm9kZS5wZWVycykge1xuICAgICAgbmV3Tm9kZVtwZWVyTmFtZV0gPSBub2RlLnBlZXJzW3BlZXJOYW1lXS5kaXN0YW5jZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdOb2Rlc1xufVxuXG5mdW5jdGlvbiBjaGVja0Rpc3RhbmNlcyAobWFwKSB7XG4gIGZvciAobGV0IG5vZGVOYW1lIGluIG1hcCkge1xuICAgIGxldCBub2RlID0gbWFwW25vZGVOYW1lXVxuICAgIGZvciAobGV0IHBlZXJOYW1lIGluIG5vZGUpIHtcbiAgICAgIGxldCBkaXN0YW5jZSA9IG5vZGVbcGVlck5hbWVdXG4gICAgICBpZiAoZGlzdGFuY2UgIT09IG1hcFtwZWVyTmFtZV1bbm9kZU5hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbWlzbWF0Y2hlZCBub2RlIGRpc3RhbmNlcyAke3BlZXJOYW1lfSwgJHtub2RlTmFtZX1gKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXBcbn1cblxubGV0IGdyYXBoID0gbmV3IEdyYXBoKGNoZWNrRGlzdGFuY2VzKHByZXBNYXAobm9kZXMpKSlcblxuY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yIChpZCwgb3B0cykge1xuICAgIHRoaXMuaWQgPSBpZFxuICAgIHRoaXMucGVlcnMgPSBvcHRzLnBlZXJzXG4gICAgdGhpcy5yb3V0ZXMgPSBvcHRzLnJvdXRlc1xuICAgIHRoaXMucGluZ3MgPSBvcHRzLnBpbmdzXG4gICAgdGhpcy5iYXNlUmF0ZSA9IG9wdHMuYmFzZVJhdGVcblxuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICBmb3J3YXJkZWRUbzoge1xuICAgICAgLy8gICBBOiB7XG4gICAgICAvLyAgICAgQjogMTBcbiAgICAgIC8vICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlY2lldmUgKG1lc3NhZ2UsIHBlZXJGcm9tKSB7XG4gICAgaWYgKG1lc3NhZ2UuaGVhZGVyLmRlc3RpbmF0aW9uQWRkcmVzcyA9PT0gdGhpcy5pZCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5pZCwgJ3JlY2lldmVkJywgbWVzc2FnZSwgJ3ZpYScsIHBlZXJGcm9tKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3J3YXJkIGFsb25nXG4gICAgICB0aGlzLl9zZW5kKG1lc3NhZ2UsIHBlZXJGcm9tKVxuICAgIH1cbiAgfVxuXG4gIF9zZW5kIChtZXNzYWdlLCBwZWVyRnJvbSkge1xuICAgIC8vIEdldCBwZWVyIGZvciBkZXN0aW5hdGlvbkFkZHJlc3NcbiAgICBsZXQgcGVlclRvID0gZ3JhcGguZmluZFNob3J0ZXN0UGF0aCh0aGlzLmlkLCBtZXNzYWdlLmhlYWRlci5kZXN0aW5hdGlvbkFkZHJlc3MpWzFdXG5cbiAgICBpZiAocGVlckZyb20pIHsgLy8gVGhlbiB0aGlzIGlzIGJlaW5nIGZvcndhcmRlZCBmb3IgYW5vdGhlciBub2RlLlxuICAgICAgY29uc29sZS5sb2coJ2ZvcndhcmRpbmcgbWVzc2FnZSBmcm9tICcgKyBwZWVyRnJvbSArICcgdG8gJyArIHBlZXJUbylcbiAgICAgIHRoaXMuX2xvZ0ZvcndhcmQocGVlckZyb20sIHBlZXJUbylcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRvIHBlZXJcbiAgICBub2Rlc1twZWVyVG9dLnJlY2lldmUobWVzc2FnZSwgdGhpcy5pZClcbiAgfVxuXG4gIF9sb2dGb3J3YXJkIChwZWVyRnJvbSwgcGVlclRvKSB7XG4gICAgLy8gTG9nIGZvcndhcmRpbmcgc3RhdHNcbiAgICBpZiAoIXRoaXMuc3RhdHMuZm9yd2FyZGVkVG9bcGVlclRvXSkge1xuICAgICAgdGhpcy5zdGF0cy5mb3J3YXJkZWRUb1twZWVyVG9dID0ge31cbiAgICB9XG4gICAgaWYgKCF0aGlzLnN0YXRzLmZvcndhcmRlZFRvW3BlZXJUb11bcGVlckZyb21dKSB7XG4gICAgICB0aGlzLnN0YXRzLmZvcndhcmRlZFRvW3BlZXJUb11bcGVlckZyb21dID0gMFxuICAgIH1cbiAgICB0aGlzLnN0YXRzLmZvcndhcmRlZFRvW3BlZXJUb11bcGVlckZyb21dID0gdGhpcy5zdGF0cy5mb3J3YXJkZWRUb1twZWVyVG9dW3BlZXJGcm9tXSArIDFcbiAgfVxuXG4gIHBpbmdQZWVycyAoKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5waW5ncykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBpbmdzW2lkXTsgaSsrKSB7XG4gICAgICAgIHRoaXMuX3NlbmQoe1xuICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgZGVzdGluYXRpb25BZGRyZXNzOiBpZCxcbiAgICAgICAgICAgIHNvdXJjZUFkZHJlc3M6IHRoaXMuaWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6ICdwaW5nJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFN0YXRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0c1xuICB9XG59XG5cblxuZnVuY3Rpb24gbWFrZU5vZGVzIChub2Rlcykge1xuICBmb3IgKGxldCBpZCBpbiBub2Rlcykge1xuICAgIG5vZGVzW2lkXSA9IG5ldyBOb2RlKGlkLCBub2Rlc1tpZF0pXG4gIH1cbn1cblxubWFrZU5vZGVzKG5vZGVzKVxuXG5mb3IgKGxldCBrZXkgaW4gbm9kZXMpIHtcbiAgbm9kZXNba2V5XS5waW5nUGVlcnMoKVxufVxuXG5mb3IgKGxldCBrZXkgaW4gbm9kZXMpIHtcbiAgY29uc29sZS5sb2cobm9kZXNba2V5XS5nZXRTdGF0cygpKVxufVxuIl19
