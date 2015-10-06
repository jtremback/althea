// let React = require('react')

function replacer (key, value) {
  if (value === Infinity) {
    return 'Infinity';
  }

  if (key === 'ports') {
    return undefined
  }

  return value;
}

exports.updateNetwork = function (network) {
  let container = document.getElementById('container')
  container.textContent = JSON.stringify(network, replacer, 2)
}

exports.log = function (stuff) {
  console.log(stuff)
}
