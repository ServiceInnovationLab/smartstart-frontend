import * as d3 from 'd3'

let chart = {
  'config': {
    'diameter': 690,
    'spacing': 40,
    'colors': ['#ed9159', '#afd6ff', '#f28982', '#ceaee6', '#bcd37c', '#93cacc', '#fcc977', '#f8c4c0', '#fcf691', '#d9ed96'],
    'duration': 3000,
    'bottomPadding': 50 // note: if this is adjusted, aspect ratio must be changed in bubble-chart.scss
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
    .attr('viewBox', `0 0 ${chart.config.diameter} ${chart.config.diameter + chart.config.bottomPadding}`)

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
    return `translate(${d.x}, ${d.y + chart.config.diameter + chart.config.bottomPadding})`
  })

  nodeEnter.append('path')
    .attr('class', 'balloon')
    .attr('transform', function(d) { return chart.balloonScale(d) })
    .attr('d', 'M78.6,42.1C78.6,14.6,61.2,0,39.5,0C18,0.1,0.5,14.6,0.5,42.1c0,19,18.1,46.2,35.6,49.5l-4.3,8.4h15.6l-4.3-8.4C59.2,87.9,78.6,60,78.6,42.1z')
    .attr('fill', function(d) {
      return chart.colorPalette(d.data.name)
    })

  nodeEnter.append('path')
    .attr('class', 'string')
    .attr('transform', function(d) { return chart.stringPosition(d) })
    .attr('d', 'M0,0c0,0-1.8,24.2,5.1,42c8,20.7-5,35.1-5,43.7')
    .attr('stroke', '#6B5F3F')
    .attr('stroke-width', '1')
    .attr('opacity', '0.8')
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

  // move the balloon in the 'breeze'
  nodeEnter.each(function() {
    let element = this

    d3.interval(function() {

      if (d3.active(element) === null) { // if it's not already transitioning

        d3.select(element)
          .transition()
          .attr('transform', function(d) {
            d.x += Math.random() * 3 * Math.sin(Math.random() * 3 * d.x + Math.random() * 10)
            d.y += Math.random() * 3 * Math.sin(Math.random() * 3 * d.y + Math.random() * 10)

            // stop things going over the edge
            if (d.x > chart.config.diameter) {
              d.x -= chart.config.diameter
            } else if (d.x < 0) {
              d.x += chart.config.diameter
            }

            if (d.y > chart.config.diameter) {
              d.y -= chart.config.diameter
            } else if (d.y < 0) {
              d.y += chart.config.diameter
            }

            return `translate(${d.x},${d.y})`
          })
          .duration(900)
      }
    }, 1000)
  })

  // update nodes - only position, balloon size, and amount text are updated
  svg.selectAll('.node')
    .interrupt()
    .transition()
    .attr('transform', function(d) {
      return `translate(${d.x}, ${d.y})`
    })
    .duration(function(d) {
      return chart.config.duration - (d.data.amount) // bigger balloons rise faster
    })

  node.select('.balloon').transition()
    .attr('transform', function(d) { return chart.balloonScale(d) })
    .duration(chart.config.duration)

  node.select('.string').transition()
    .attr('transform', function(d) { return chart.stringPosition(d) })
    .duration(chart.config.duration)

  node.select('.amount-text')
    .text(function(d) {
      return d.data.amount
    })

  // remove nodes
  node.exit()
    .selectAll('.string')
    .remove()

  node.exit()
    .selectAll('.amount-text')
    .remove()

  node.exit()
    .selectAll('.name-text')
    .remove()

  node.exit()
    .selectAll('.balloon')
    .transition()
    .attr('transform', 'scale(0,0)')
    .duration(250)
    .on('end', function() {
      d3.select(this.parentNode).remove()
    })
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
