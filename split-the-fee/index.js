// let cytoscape = require('cytoscape')

let cy = cytoscape({
  container: document.getElementById('cy'),
  motionBlur: false,
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)'
      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 4,
        'control-point-step-size': 30,
        'curve-style': 'bezier',
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
      })
    .selector('.highlighted')
      .css({
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }),

  elements: {
    nodes: [
      { data: { id: 'A' } },
      { data: { id: 'B' } },
      { data: { id: 'C' } },
      { data: { id: 'D' } },
      { data: { id: 'E' } },
      { data: { id: 'F' } },
      { data: { id: 'G' } },
    ],

    edges: [
      { data: { id: 'AC', weight: 20, source: 'A', target: 'C' } },
      { data: { id: 'BD', weight: 14, source: 'B', target: 'D' } },
      { data: { id: 'CA', weight: 20, source: 'C', target: 'A' } },
      { data: { id: 'CD', weight: 15, source: 'C', target: 'D' } },
      { data: { id: 'DB', weight: 14, source: 'D', target: 'B' } },
      { data: { id: 'DC', weight: 15, source: 'D', target: 'C' } },
      { data: { id: 'DE', weight: 13, source: 'D', target: 'E' } },
      { data: { id: 'DF', weight: 18, source: 'D', target: 'F' } },
      { data: { id: 'ED', weight: 13, source: 'E', target: 'D' } },
      { data: { id: 'EF', weight: 20, source: 'E', target: 'F' } },
      { data: { id: 'EG', weight: 20, source: 'E', target: 'G' } },
      { data: { id: 'FD', weight: 18, source: 'F', target: 'D' } },
      { data: { id: 'FE', weight: 20, source: 'F', target: 'E' } },
      { data: { id: 'FG', weight: 30, source: 'F', target: 'G' } },
      { data: { id: 'GE', weight: 20, source: 'G', target: 'E' } },
      { data: { id: 'GF', weight: 30, source: 'G', target: 'F' } },
    ],

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
  }
})

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
  ready: function(){}, // on layoutready
  stop: function(){}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  nodeSpacing: function( node ){ return 10; }, // extra spacing around nodes
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: function( edge ){
    return edge.data().weight * 8;
  }, // sets edge length directly in simulation
  edgeSymDiffLength: function( edge ){
    return edge.data().weight * 8;
  }, // symmetric diff edge length in simulation
  edgeJaccardLength: function( edge ){
    return edge.data().weight * 8;
  }, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

  // infinite layout options
  infinite: false // overrides all other options for a forces-all-the-time mode
};

cy.layout( options );

var bfs = cy.elements().bfs('#A', function(){}, true)

async function foo (start, end) {
  var aStar = cy.elements().aStar({ root: `#${start}`, goal: `#${end}` })

  var highlightNextEle = function(i){
    let element = aStar.path[i]
    if(element){
      element.addClass('highlighted');

      setTimeout(function () {
        highlightNextEle(i + 1)
      }, 500);
      setTimeout(function () {
        element.removeClass('highlighted')
      }, 1100);
    } else {

    }
  }
}

// kick off first highlight
// highlightNextEle(0);
