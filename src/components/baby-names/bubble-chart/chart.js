import * as d3 from 'd3'

let chart = {
  'config': {
    'diameter': 690,
    'spacing': 40,
    'colors': ['#ed9159', '#afd6ff', '#f28982', '#ceaee6', '#bcd37c', '#93cacc', '#fcc977', '#f8c4c0', '#fcf691', '#d9ed96']
  }
}

chart.create = function(container, dataset, config) {
  // if config overrides supplied, update defaults
  if (config) {
    for (let value in config) {
      chart.config[value] = config[value]
    }
  }

  // create svg element
  d3.select(container)
    .append('svg')
    .attr('class', 'bubble-chart')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${chart.config.diameter} ${chart.config.diameter}`)

  chart.draw(dataset)
}

chart.colorPalette = d3.scaleOrdinal(chart.config.colors)

chart.draw = function(dataset) {
  let svg = d3.select('.bubble-chart')

  let smallestValue = d3.min(dataset.children, function(d) {
    return d.amount
  })

  let biggestValue = d3.max(dataset.children, function(d) {
    return d.amount
  })

  let bubble = d3.pack(dataset)
    .size([chart.config.diameter, chart.config.diameter])
    .padding(chart.config.spacing)

  let nodes = d3.hierarchy(dataset)
    .sum(function(d) { return (d.amount - (smallestValue - ((biggestValue - smallestValue) / 2 ))) })

  let node = svg.selectAll('.node')
    .data(
      bubble(nodes).descendants().filter(function(d){
        return !d.children // only show nodes that have no descendants
      }),
      function(d) {return d.data.name} // key as per https://github.com/d3/d3-selection/blob/master/README.md#selection_data
    )

  let nodeEnter = node.enter()
    .append('g')
    .attr('class', 'node')

  // create nodes
  nodeEnter.attr('transform', function(d) {
    return `translate(${d.x}, ${d.y})`
  })

  nodeEnter.append('path')
    .attr('class', 'balloon')
    .attr('transform', function(d) { return chart.balloonScale(d) })
    .attr('d', 'M78.6,42.1C78.6,14.6,61.2,0,39.5,0C18,0.1,0.5,14.6,0.5,42.1c0,19,18.1,46.2,35.6,49.5l-4.3,8.4h15.6l-4.3-8.4C59.2,87.9,78.6,60,78.6,42.1z')
    .attr('fill', function(d) {
      return chart.colorPalette(d.data.name + d.data.amount)
    })

  nodeEnter.append('path')
    .attr('class', 'string')
    .attr('transform', function(d) { return chart.stringPosition(d) })
    .attr('d', 'M0,0c0,0-1.8,24.2,5.1,42c8,20.7-5,35.1-5,43.7')
    .attr('stroke', '#000000')
    .attr('stroke-width', '1')
    .attr('fill', 'none')

  nodeEnter.append('text')
    .attr('class', 'name-text')
    .attr('dy', '-0.5em')
    .text(function(d) {
      return d.data.name
    })

  nodeEnter.append('text')
    .attr('class', 'amount-text')
    .attr('dy', '1em')
    .text(function(d) {
      return d.data.amount
    })

  // update nodes - only position, balloon size and color, and amount text are updated
  node.attr('transform', function(d) {
    return `translate(${d.x}, ${d.y})`
  })

  node.select('.balloon')
    .attr('transform', function(d) { return chart.balloonScale(d) })
    .attr('fill', function(d) {
      return chart.colorPalette(d.data.name + d.data.amount)
    })

  node.select('.string')
    .attr('transform', function(d) { return chart.stringPosition(d) })

  node.select('.amount-text')
    .text(function(d) {
      return d.data.amount
    })

  // remove nodes
  node.exit()
    .remove()
}

chart.destroy = function() {
  d3.select('.bubble-chart').remove()
}

chart.balloonScale = function(d) {
  let scale = (d.r * 2) / 100 // height of the balloon path is 100px
  let halfHeight = 100 / 2
  let halfWidth = 78 / 2 // width of the path is 78px
  return `scale(${scale}) translate(-${halfWidth}, -${halfHeight})`
}

chart.stringPosition = function(d) {
  let scale = (d.r * 2) / 100 // height of the balloon path is 100px
  let halfHeight = 100 * scale / 2
  return `translate(0, ${halfHeight})`
}

export default chart
