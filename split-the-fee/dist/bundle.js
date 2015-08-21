(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// let cytoscape = require('cytoscape')

var cy = cytoscape({
  container: document.getElementById('cy'),
  motionBlur: false,
  style: cytoscape.stylesheet().selector('node').css({
    'content': 'data(id)'
  }).selector('edge').css({
    'target-arrow-shape': 'triangle',
    'width': 4,
    'control-point-step-size': 30,
    'curve-style': 'bezier',
    'line-color': '#ddd',
    'target-arrow-color': '#ddd'
  }).selector('.highlighted').css({
    'background-color': '#61bffc',
    'line-color': '#61bffc',
    'target-arrow-color': '#61bffc',
    'transition-property': 'background-color, line-color, target-arrow-color',
    'transition-duration': '0.5s'
  }),

  elements: {
    nodes: [{ data: { id: 'A' } }, { data: { id: 'B' } }, { data: { id: 'C' } }, { data: { id: 'D' } }, { data: { id: 'E' } }, { data: { id: 'F' } }, { data: { id: 'G' } }],

    edges: [{ data: { id: 'AC', weight: 20, source: 'A', target: 'C' } }, { data: { id: 'BD', weight: 14, source: 'B', target: 'D' } }, { data: { id: 'CA', weight: 20, source: 'C', target: 'A' } }, { data: { id: 'CD', weight: 15, source: 'C', target: 'D' } }, { data: { id: 'DB', weight: 14, source: 'D', target: 'B' } }, { data: { id: 'DC', weight: 15, source: 'D', target: 'C' } }, { data: { id: 'DE', weight: 13, source: 'D', target: 'E' } }, { data: { id: 'DF', weight: 18, source: 'D', target: 'F' } }, { data: { id: 'ED', weight: 13, source: 'E', target: 'D' } }, { data: { id: 'EF', weight: 20, source: 'E', target: 'F' } }, { data: { id: 'EG', weight: 20, source: 'E', target: 'G' } }, { data: { id: 'FD', weight: 18, source: 'F', target: 'D' } }, { data: { id: 'FE', weight: 20, source: 'F', target: 'E' } }, { data: { id: 'FG', weight: 30, source: 'F', target: 'G' } }, { data: { id: 'GE', weight: 20, source: 'G', target: 'E' } }, { data: { id: 'GF', weight: 30, source: 'G', target: 'F' } }]

  }
});

//     layout: {
//   name: 'cola',

//   animate: true, // whether to show the layout as it's running
//   refresh: 1, // number of ticks per frame; higher is faster but more jerky
//   maxSimulationTime: 4000, // max length in ms to run the layout
//   ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
//   fit: true, // on every layout reposition of nodes, fit the viewport
//   padding: 30, // padding around the simulation
//   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

//   // layout event callbacks
//   ready: function(){}, // on layoutready
//   stop: function(){}, // on layoutstop

//   // positioning options
//   randomize: false, // use random node positions at beginning of layout
//   avoidOverlap: true, // if true, prevents overlap of node bounding boxes
//   handleDisconnected: true, // if true, avoids disconnected components from overlapping
//   nodeSpacing: function( node ){ return 10; }, // extra spacing around nodes
//   flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
//   alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

//   // different methods of specifying edge length
//   // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
//   edgeLength: undefined, // sets edge length directly in simulation
//   edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
//   edgeJaccardLength: undefined, // jaccard edge length in simulation

//   // iterations of cola algorithm; uses default values on undefined
//   unconstrIter: undefined, // unconstrained initial layout iterations
//   userConstIter: undefined, // initial layout iterations with user-specified constraints
//   allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

//   // infinite layout options
//   infinite: false // overrides all other options for a forces-all-the-time mode
// }
var options = {
  name: 'cola',

  animate: true, // whether to show the layout as it's running
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 500, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

  // layout event callbacks
  ready: function () {}, // on layoutready
  stop: function () {}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  nodeSpacing: function (node) {
    return 10;
  }, // extra spacing around nodes
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: function (edge) {
    return edge.data().weight * 8;
  }, // sets edge length directly in simulation
  edgeSymDiffLength: function (edge) {
    return edge.data().weight * 8;
  }, // symmetric diff edge length in simulation
  edgeJaccardLength: function (edge) {
    return edge.data().weight * 8;
  }, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

  // infinite layout options
  infinite: false // overrides all other options for a forces-all-the-time mode
};

cy.layout(options);

var bfs = cy.elements().bfs('#A', function () {}, true);

function foo(start, end) {
  var aStar, highlightNextEle;
  return regeneratorRuntime.async(function foo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        aStar = cy.elements().aStar({ root: '#' + start, goal: '#' + end });

        highlightNextEle = function (i) {
          var element = aStar.path[i];
          if (element) {
            element.addClass('highlighted');

            setTimeout(function () {
              highlightNextEle(i + 1);
            }, 500);
            setTimeout(function () {
              element.removeClass('highlighted');
            }, 1100);
          } else {}
        };

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

// kick off first highlight
// highlightNextEle(0);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2plaGFuL2FsdGhlYS9zcGxpdC10aGUtZmVlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQSxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7QUFDakIsV0FBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO0FBQ3hDLFlBQVUsRUFBRSxLQUFLO0FBQ2pCLE9BQUssRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLENBQzFCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FDZCxHQUFHLENBQUM7QUFDSCxhQUFTLEVBQUUsVUFBVTtHQUN0QixDQUFDLENBQ0gsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUNkLEdBQUcsQ0FBQztBQUNILHdCQUFvQixFQUFFLFVBQVU7QUFDaEMsV0FBTyxFQUFFLENBQUM7QUFDViw2QkFBeUIsRUFBRSxFQUFFO0FBQzdCLGlCQUFhLEVBQUUsUUFBUTtBQUN2QixnQkFBWSxFQUFFLE1BQU07QUFDcEIsd0JBQW9CLEVBQUUsTUFBTTtHQUM3QixDQUFDLENBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUN0QixHQUFHLENBQUM7QUFDSCxzQkFBa0IsRUFBRSxTQUFTO0FBQzdCLGdCQUFZLEVBQUUsU0FBUztBQUN2Qix3QkFBb0IsRUFBRSxTQUFTO0FBQy9CLHlCQUFxQixFQUFFLGtEQUFrRDtBQUN6RSx5QkFBcUIsRUFBRSxNQUFNO0dBQzlCLENBQUM7O0FBRU4sVUFBUSxFQUFFO0FBQ1IsU0FBSyxFQUFFLENBQ0wsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDckIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FDdEI7O0FBRUQsU0FBSyxFQUFFLENBQ0wsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFDNUQsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVB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QUNSLHNCQUFVLENBQUMsWUFBWTtBQUNyQixxQkFBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTthQUNuQyxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQ1YsTUFBTSxFQUVOO1NBQ0YsQ0FBQTs7QUF6QkcsQUF5QkgsV0F6QlEsQ0FBQyxDQUFDO0FBQ1AsV0FBSyxLQUFLO0FBQ1IsZUFBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7QUFBQSxLQUM3QjtHQUNGLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBc0JoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBsZXQgY3l0b3NjYXBlID0gcmVxdWlyZSgnY3l0b3NjYXBlJylcblxubGV0IGN5ID0gY3l0b3NjYXBlKHtcbiAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3knKSxcbiAgbW90aW9uQmx1cjogZmFsc2UsXG4gIHN0eWxlOiBjeXRvc2NhcGUuc3R5bGVzaGVldCgpXG4gICAgLnNlbGVjdG9yKCdub2RlJylcbiAgICAgIC5jc3Moe1xuICAgICAgICAnY29udGVudCc6ICdkYXRhKGlkKSdcbiAgICAgIH0pXG4gICAgLnNlbGVjdG9yKCdlZGdlJylcbiAgICAgIC5jc3Moe1xuICAgICAgICAndGFyZ2V0LWFycm93LXNoYXBlJzogJ3RyaWFuZ2xlJyxcbiAgICAgICAgJ3dpZHRoJzogNCxcbiAgICAgICAgJ2NvbnRyb2wtcG9pbnQtc3RlcC1zaXplJzogMzAsXG4gICAgICAgICdjdXJ2ZS1zdHlsZSc6ICdiZXppZXInLFxuICAgICAgICAnbGluZS1jb2xvcic6ICcjZGRkJyxcbiAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZGRkJ1xuICAgICAgfSlcbiAgICAuc2VsZWN0b3IoJy5oaWdobGlnaHRlZCcpXG4gICAgICAuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnIzYxYmZmYycsXG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM2MWJmZmMnLFxuICAgICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyM2MWJmZmMnLFxuICAgICAgICAndHJhbnNpdGlvbi1wcm9wZXJ0eSc6ICdiYWNrZ3JvdW5kLWNvbG9yLCBsaW5lLWNvbG9yLCB0YXJnZXQtYXJyb3ctY29sb3InLFxuICAgICAgICAndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcwLjVzJ1xuICAgICAgfSksXG5cbiAgZWxlbWVudHM6IHtcbiAgICBub2RlczogW1xuICAgICAgeyBkYXRhOiB7IGlkOiAnQScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnQicgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnQycgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRCcgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRicgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRycgfSB9LFxuICAgIF0sXG5cbiAgICBlZGdlczogW1xuICAgICAgeyBkYXRhOiB7IGlkOiAnQUMnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdBJywgdGFyZ2V0OiAnQycgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnQkQnLCB3ZWlnaHQ6IDE0LCBzb3VyY2U6ICdCJywgdGFyZ2V0OiAnRCcgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnQ0EnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdDJywgdGFyZ2V0OiAnQScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnQ0QnLCB3ZWlnaHQ6IDE1LCBzb3VyY2U6ICdDJywgdGFyZ2V0OiAnRCcgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnREInLCB3ZWlnaHQ6IDE0LCBzb3VyY2U6ICdEJywgdGFyZ2V0OiAnQicgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnREMnLCB3ZWlnaHQ6IDE1LCBzb3VyY2U6ICdEJywgdGFyZ2V0OiAnQycgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnREUnLCB3ZWlnaHQ6IDEzLCBzb3VyY2U6ICdEJywgdGFyZ2V0OiAnRScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnREYnLCB3ZWlnaHQ6IDE4LCBzb3VyY2U6ICdEJywgdGFyZ2V0OiAnRicgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRUQnLCB3ZWlnaHQ6IDEzLCBzb3VyY2U6ICdFJywgdGFyZ2V0OiAnRCcgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRUYnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdFJywgdGFyZ2V0OiAnRicgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRUcnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdFJywgdGFyZ2V0OiAnRycgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRkQnLCB3ZWlnaHQ6IDE4LCBzb3VyY2U6ICdGJywgdGFyZ2V0OiAnRCcgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRkUnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdGJywgdGFyZ2V0OiAnRScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnRkcnLCB3ZWlnaHQ6IDMwLCBzb3VyY2U6ICdGJywgdGFyZ2V0OiAnRycgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnR0UnLCB3ZWlnaHQ6IDIwLCBzb3VyY2U6ICdHJywgdGFyZ2V0OiAnRScgfSB9LFxuICAgICAgeyBkYXRhOiB7IGlkOiAnR0YnLCB3ZWlnaHQ6IDMwLCBzb3VyY2U6ICdHJywgdGFyZ2V0OiAnRicgfSB9LFxuICAgIF0sXG5cbi8vICAgICBsYXlvdXQ6IHtcbi8vICAgbmFtZTogJ2NvbGEnLFxuXG4vLyAgIGFuaW1hdGU6IHRydWUsIC8vIHdoZXRoZXIgdG8gc2hvdyB0aGUgbGF5b3V0IGFzIGl0J3MgcnVubmluZ1xuLy8gICByZWZyZXNoOiAxLCAvLyBudW1iZXIgb2YgdGlja3MgcGVyIGZyYW1lOyBoaWdoZXIgaXMgZmFzdGVyIGJ1dCBtb3JlIGplcmt5XG4vLyAgIG1heFNpbXVsYXRpb25UaW1lOiA0MDAwLCAvLyBtYXggbGVuZ3RoIGluIG1zIHRvIHJ1biB0aGUgbGF5b3V0XG4vLyAgIHVuZ3JhYmlmeVdoaWxlU2ltdWxhdGluZzogZmFsc2UsIC8vIHNvIHlvdSBjYW4ndCBkcmFnIG5vZGVzIGR1cmluZyBsYXlvdXRcbi8vICAgZml0OiB0cnVlLCAvLyBvbiBldmVyeSBsYXlvdXQgcmVwb3NpdGlvbiBvZiBub2RlcywgZml0IHRoZSB2aWV3cG9ydFxuLy8gICBwYWRkaW5nOiAzMCwgLy8gcGFkZGluZyBhcm91bmQgdGhlIHNpbXVsYXRpb25cbi8vICAgYm91bmRpbmdCb3g6IHVuZGVmaW5lZCwgLy8gY29uc3RyYWluIGxheW91dCBib3VuZHM7IHsgeDEsIHkxLCB4MiwgeTIgfSBvciB7IHgxLCB5MSwgdywgaCB9XG5cbi8vICAgLy8gbGF5b3V0IGV2ZW50IGNhbGxiYWNrc1xuLy8gICByZWFkeTogZnVuY3Rpb24oKXt9LCAvLyBvbiBsYXlvdXRyZWFkeVxuLy8gICBzdG9wOiBmdW5jdGlvbigpe30sIC8vIG9uIGxheW91dHN0b3BcblxuLy8gICAvLyBwb3NpdGlvbmluZyBvcHRpb25zXG4vLyAgIHJhbmRvbWl6ZTogZmFsc2UsIC8vIHVzZSByYW5kb20gbm9kZSBwb3NpdGlvbnMgYXQgYmVnaW5uaW5nIG9mIGxheW91dFxuLy8gICBhdm9pZE92ZXJsYXA6IHRydWUsIC8vIGlmIHRydWUsIHByZXZlbnRzIG92ZXJsYXAgb2Ygbm9kZSBib3VuZGluZyBib3hlc1xuLy8gICBoYW5kbGVEaXNjb25uZWN0ZWQ6IHRydWUsIC8vIGlmIHRydWUsIGF2b2lkcyBkaXNjb25uZWN0ZWQgY29tcG9uZW50cyBmcm9tIG92ZXJsYXBwaW5nXG4vLyAgIG5vZGVTcGFjaW5nOiBmdW5jdGlvbiggbm9kZSApeyByZXR1cm4gMTA7IH0sIC8vIGV4dHJhIHNwYWNpbmcgYXJvdW5kIG5vZGVzXG4vLyAgIGZsb3c6IHVuZGVmaW5lZCwgLy8gdXNlIERBRy90cmVlIGZsb3cgbGF5b3V0IGlmIHNwZWNpZmllZCwgZS5nLiB7IGF4aXM6ICd5JywgbWluU2VwYXJhdGlvbjogMzAgfVxuLy8gICBhbGlnbm1lbnQ6IHVuZGVmaW5lZCwgLy8gcmVsYXRpdmUgYWxpZ25tZW50IGNvbnN0cmFpbnRzIG9uIG5vZGVzLCBlLmcuIGZ1bmN0aW9uKCBub2RlICl7IHJldHVybiB7IHg6IDAsIHk6IDEgfSB9XG5cbi8vICAgLy8gZGlmZmVyZW50IG1ldGhvZHMgb2Ygc3BlY2lmeWluZyBlZGdlIGxlbmd0aFxuLy8gICAvLyBlYWNoIGNhbiBiZSBhIGNvbnN0YW50IG51bWVyaWNhbCB2YWx1ZSBvciBhIGZ1bmN0aW9uIGxpa2UgYGZ1bmN0aW9uKCBlZGdlICl7IHJldHVybiAyOyB9YFxuLy8gICBlZGdlTGVuZ3RoOiB1bmRlZmluZWQsIC8vIHNldHMgZWRnZSBsZW5ndGggZGlyZWN0bHkgaW4gc2ltdWxhdGlvblxuLy8gICBlZGdlU3ltRGlmZkxlbmd0aDogdW5kZWZpbmVkLCAvLyBzeW1tZXRyaWMgZGlmZiBlZGdlIGxlbmd0aCBpbiBzaW11bGF0aW9uXG4vLyAgIGVkZ2VKYWNjYXJkTGVuZ3RoOiB1bmRlZmluZWQsIC8vIGphY2NhcmQgZWRnZSBsZW5ndGggaW4gc2ltdWxhdGlvblxuXG4vLyAgIC8vIGl0ZXJhdGlvbnMgb2YgY29sYSBhbGdvcml0aG07IHVzZXMgZGVmYXVsdCB2YWx1ZXMgb24gdW5kZWZpbmVkXG4vLyAgIHVuY29uc3RySXRlcjogdW5kZWZpbmVkLCAvLyB1bmNvbnN0cmFpbmVkIGluaXRpYWwgbGF5b3V0IGl0ZXJhdGlvbnNcbi8vICAgdXNlckNvbnN0SXRlcjogdW5kZWZpbmVkLCAvLyBpbml0aWFsIGxheW91dCBpdGVyYXRpb25zIHdpdGggdXNlci1zcGVjaWZpZWQgY29uc3RyYWludHNcbi8vICAgYWxsQ29uc3RJdGVyOiB1bmRlZmluZWQsIC8vIGluaXRpYWwgbGF5b3V0IGl0ZXJhdGlvbnMgd2l0aCBhbGwgY29uc3RyYWludHMgaW5jbHVkaW5nIG5vbi1vdmVybGFwXG5cbi8vICAgLy8gaW5maW5pdGUgbGF5b3V0IG9wdGlvbnNcbi8vICAgaW5maW5pdGU6IGZhbHNlIC8vIG92ZXJyaWRlcyBhbGwgb3RoZXIgb3B0aW9ucyBmb3IgYSBmb3JjZXMtYWxsLXRoZS10aW1lIG1vZGVcbi8vIH1cbiAgfVxufSlcblxudmFyIG9wdGlvbnMgPSB7XG4gIG5hbWU6ICdjb2xhJyxcblxuICBhbmltYXRlOiB0cnVlLCAvLyB3aGV0aGVyIHRvIHNob3cgdGhlIGxheW91dCBhcyBpdCdzIHJ1bm5pbmdcbiAgcmVmcmVzaDogMSwgLy8gbnVtYmVyIG9mIHRpY2tzIHBlciBmcmFtZTsgaGlnaGVyIGlzIGZhc3RlciBidXQgbW9yZSBqZXJreVxuICBtYXhTaW11bGF0aW9uVGltZTogNTAwLCAvLyBtYXggbGVuZ3RoIGluIG1zIHRvIHJ1biB0aGUgbGF5b3V0XG4gIHVuZ3JhYmlmeVdoaWxlU2ltdWxhdGluZzogZmFsc2UsIC8vIHNvIHlvdSBjYW4ndCBkcmFnIG5vZGVzIGR1cmluZyBsYXlvdXRcbiAgZml0OiB0cnVlLCAvLyBvbiBldmVyeSBsYXlvdXQgcmVwb3NpdGlvbiBvZiBub2RlcywgZml0IHRoZSB2aWV3cG9ydFxuICBwYWRkaW5nOiAzMCwgLy8gcGFkZGluZyBhcm91bmQgdGhlIHNpbXVsYXRpb25cbiAgYm91bmRpbmdCb3g6IHVuZGVmaW5lZCwgLy8gY29uc3RyYWluIGxheW91dCBib3VuZHM7IHsgeDEsIHkxLCB4MiwgeTIgfSBvciB7IHgxLCB5MSwgdywgaCB9XG5cbiAgLy8gbGF5b3V0IGV2ZW50IGNhbGxiYWNrc1xuICByZWFkeTogZnVuY3Rpb24oKXt9LCAvLyBvbiBsYXlvdXRyZWFkeVxuICBzdG9wOiBmdW5jdGlvbigpe30sIC8vIG9uIGxheW91dHN0b3BcblxuICAvLyBwb3NpdGlvbmluZyBvcHRpb25zXG4gIHJhbmRvbWl6ZTogZmFsc2UsIC8vIHVzZSByYW5kb20gbm9kZSBwb3NpdGlvbnMgYXQgYmVnaW5uaW5nIG9mIGxheW91dFxuICBhdm9pZE92ZXJsYXA6IHRydWUsIC8vIGlmIHRydWUsIHByZXZlbnRzIG92ZXJsYXAgb2Ygbm9kZSBib3VuZGluZyBib3hlc1xuICBoYW5kbGVEaXNjb25uZWN0ZWQ6IHRydWUsIC8vIGlmIHRydWUsIGF2b2lkcyBkaXNjb25uZWN0ZWQgY29tcG9uZW50cyBmcm9tIG92ZXJsYXBwaW5nXG4gIG5vZGVTcGFjaW5nOiBmdW5jdGlvbiggbm9kZSApeyByZXR1cm4gMTA7IH0sIC8vIGV4dHJhIHNwYWNpbmcgYXJvdW5kIG5vZGVzXG4gIGZsb3c6IHVuZGVmaW5lZCwgLy8gdXNlIERBRy90cmVlIGZsb3cgbGF5b3V0IGlmIHNwZWNpZmllZCwgZS5nLiB7IGF4aXM6ICd5JywgbWluU2VwYXJhdGlvbjogMzAgfVxuICBhbGlnbm1lbnQ6IHVuZGVmaW5lZCwgLy8gcmVsYXRpdmUgYWxpZ25tZW50IGNvbnN0cmFpbnRzIG9uIG5vZGVzLCBlLmcuIGZ1bmN0aW9uKCBub2RlICl7IHJldHVybiB7IHg6IDAsIHk6IDEgfSB9XG5cbiAgLy8gZGlmZmVyZW50IG1ldGhvZHMgb2Ygc3BlY2lmeWluZyBlZGdlIGxlbmd0aFxuICAvLyBlYWNoIGNhbiBiZSBhIGNvbnN0YW50IG51bWVyaWNhbCB2YWx1ZSBvciBhIGZ1bmN0aW9uIGxpa2UgYGZ1bmN0aW9uKCBlZGdlICl7IHJldHVybiAyOyB9YFxuICBlZGdlTGVuZ3RoOiBmdW5jdGlvbiggZWRnZSApe1xuICAgIHJldHVybiBlZGdlLmRhdGEoKS53ZWlnaHQgKiA4O1xuICB9LCAvLyBzZXRzIGVkZ2UgbGVuZ3RoIGRpcmVjdGx5IGluIHNpbXVsYXRpb25cbiAgZWRnZVN5bURpZmZMZW5ndGg6IGZ1bmN0aW9uKCBlZGdlICl7XG4gICAgcmV0dXJuIGVkZ2UuZGF0YSgpLndlaWdodCAqIDg7XG4gIH0sIC8vIHN5bW1ldHJpYyBkaWZmIGVkZ2UgbGVuZ3RoIGluIHNpbXVsYXRpb25cbiAgZWRnZUphY2NhcmRMZW5ndGg6IGZ1bmN0aW9uKCBlZGdlICl7XG4gICAgcmV0dXJuIGVkZ2UuZGF0YSgpLndlaWdodCAqIDg7XG4gIH0sIC8vIGphY2NhcmQgZWRnZSBsZW5ndGggaW4gc2ltdWxhdGlvblxuXG4gIC8vIGl0ZXJhdGlvbnMgb2YgY29sYSBhbGdvcml0aG07IHVzZXMgZGVmYXVsdCB2YWx1ZXMgb24gdW5kZWZpbmVkXG4gIHVuY29uc3RySXRlcjogdW5kZWZpbmVkLCAvLyB1bmNvbnN0cmFpbmVkIGluaXRpYWwgbGF5b3V0IGl0ZXJhdGlvbnNcbiAgdXNlckNvbnN0SXRlcjogdW5kZWZpbmVkLCAvLyBpbml0aWFsIGxheW91dCBpdGVyYXRpb25zIHdpdGggdXNlci1zcGVjaWZpZWQgY29uc3RyYWludHNcbiAgYWxsQ29uc3RJdGVyOiB1bmRlZmluZWQsIC8vIGluaXRpYWwgbGF5b3V0IGl0ZXJhdGlvbnMgd2l0aCBhbGwgY29uc3RyYWludHMgaW5jbHVkaW5nIG5vbi1vdmVybGFwXG5cbiAgLy8gaW5maW5pdGUgbGF5b3V0IG9wdGlvbnNcbiAgaW5maW5pdGU6IGZhbHNlIC8vIG92ZXJyaWRlcyBhbGwgb3RoZXIgb3B0aW9ucyBmb3IgYSBmb3JjZXMtYWxsLXRoZS10aW1lIG1vZGVcbn07XG5cbmN5LmxheW91dCggb3B0aW9ucyApO1xuXG52YXIgYmZzID0gY3kuZWxlbWVudHMoKS5iZnMoJyNBJywgZnVuY3Rpb24oKXt9LCB0cnVlKVxuXG5hc3luYyBmdW5jdGlvbiBmb28gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGFTdGFyID0gY3kuZWxlbWVudHMoKS5hU3Rhcih7IHJvb3Q6IGAjJHtzdGFydH1gLCBnb2FsOiBgIyR7ZW5kfWAgfSlcblxuICB2YXIgaGlnaGxpZ2h0TmV4dEVsZSA9IGZ1bmN0aW9uKGkpe1xuICAgIGxldCBlbGVtZW50ID0gYVN0YXIucGF0aFtpXVxuICAgIGlmKGVsZW1lbnQpe1xuICAgICAgZWxlbWVudC5hZGRDbGFzcygnaGlnaGxpZ2h0ZWQnKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGhpZ2hsaWdodE5leHRFbGUoaSArIDEpXG4gICAgICB9LCA1MDApO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodGVkJylcbiAgICAgIH0sIDExMDApO1xuICAgIH0gZWxzZSB7XG5cbiAgICB9XG4gIH1cbn1cblxuLy8ga2ljayBvZmYgZmlyc3QgaGlnaGxpZ2h0XG4vLyBoaWdobGlnaHROZXh0RWxlKDApO1xuIl19
