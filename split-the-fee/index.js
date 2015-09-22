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
    ]
  }
})

cy.layout({
  name: 'cola',

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
})

var aStar = cy.elements().aStar({ root: `#A`, goal: `#G` })

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

// kick off first highlight
highlightNextEle(0);
