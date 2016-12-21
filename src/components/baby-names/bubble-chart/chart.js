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

  // set up colours as a d3 scale
  chart.config.colors = d3.scaleOrdinal(chart.config.colors)

  // create svg element
  d3.select(container)
    .append('svg')
    .attr('class', 'bubble-chart')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${chart.config.diameter} ${chart.config.diameter}`)

  chart.draw(dataset)
}

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
    return 'translate(' + d.x + ',' + d.y + ')'
  })

  nodeEnter.append('circle')
    .attr('class', 'circle')
    .attr('r', function(d) {
      return d.r
    })
    .attr('fill', function(d) {
      return chart.config.colors(d.data.name + d.data.amount)
    })

  nodeEnter.append('text')
    .attr('class', 'name-text')
    .attr('dy', '-0.5em')
    .text(function(d) {
      return d.data.name // TODO make sure this font size scales for mobile or wraps
    })

  nodeEnter.append('text')
    .attr('class', 'amount-text')
    .attr('dy', '1em')
    .text(function(d) {
      return d.data.amount
    })

  // update nodes - only position, circle size and color, and amount text are updated
  node.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')'
  })

  node.select('.circle')
    .attr('r', function(d) {
      return d.r
    })
    .attr('fill', function(d) {
      return chart.config.colors(d.data.name + d.data.amount)
    })

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

export default chart
