import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import chart from 'components/baby-names/bubble-chart/chart'

class BubbleChart extends Component {
  constructor (props) {
    super(props)

    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  componentDidMount () {
    const { data, category, year } = this.props

    if (data && data[category] && data[category][year]) {
      let container = findDOMNode(this)
      chart.create(container, {'name': category + year, 'children': data[category][year]})
    }
  }

  componentDidUpdate () {
    const { data, category, year } = this.props

    if (data && data[category] && data[category][year]) {
      chart.draw({'name': category + year, 'children': data[category][year]})
    }
  }

  componentWillUnmount () {
    chart.destroy()
  }

  render () {
    return (
      <div className="bubble-chart"></div>
    )
  }
}

BubbleChart.propTypes = {
  data: React.PropTypes.object.isRequired,
  category: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired
}

export default BubbleChart
