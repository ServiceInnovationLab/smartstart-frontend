import './baby-names.scss'

import React, { Component } from 'react'
import BubbleChart from 'components/baby-names/bubble-chart/bubble-chart'
import nameData from 'components/baby-names/baby-name-data'

class BabyNames extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: nameData,
      category: 'girls',
      year: '2016'
    }

    this.setCategory = this.setCategory.bind(this)
    this.setYear = this.setYear.bind(this)
    this.yearSelected = this.yearSelected.bind(this)
    this.categorySelected = this.categorySelected.bind(this)
  }

  setCategory (value) {
    this.setState({
      category: value
    })
  }

  setYear (event, value) {
    event.preventDefault()
    this.setState({
      year: value
    })
  }

  categorySelected (value) {
    return this.state.category === value ? 'selected' : ''
  }

  yearSelected (value) {
    return this.state.year === value ? 'selected' : ''
  }

  render () {
    return (
      <div>
        <h2>Baby names 2016</h2>
        <BubbleChart data={this.state.data} category={this.state.category} year={this.state.year} />
        <div className='bubble-chart-category'>
          <button onClick={() => this.setCategory('girls')} className={this.categorySelected('girls')}>Girls</button>
          <button onClick={() => this.setCategory('boys')} className={this.categorySelected('boys')}>Boys</button>
        </div>
        <div className='bubble-chart-year'>
          <a href='#' onClick={(event) => this.setYear(event, '2016')} className={this.yearSelected('2016')}>2016</a>
          <a href='#' onClick={(event) => this.setYear(event, '2015')} className={this.yearSelected('2015')}>2015</a>
          <a href='#' onClick={(event) => this.setYear(event, '2014')} className={this.yearSelected('2014')}>2014</a>
          <a href='#' onClick={(event) => this.setYear(event, '2013')} className={this.yearSelected('2013')}>2013</a>
          <a href='#' onClick={(event) => this.setYear(event, '2012')} className={this.yearSelected('2012')}>2012</a>
          <a href='#' onClick={(event) => this.setYear(event, '2011')} className={this.yearSelected('2011')}>2011</a>
          <a href='#' onClick={(event) => this.setYear(event, '2010')} className={this.yearSelected('2010')}>2010</a>
          <a href='#' onClick={(event) => this.setYear(event, '2009')} className={this.yearSelected('2009')}>2009</a>
          <a href='#' onClick={(event) => this.setYear(event, '2008')} className={this.yearSelected('2008')}>2008</a>
          <a href='#' onClick={(event) => this.setYear(event, '2007')} className={this.yearSelected('2007')}>2007</a>
        </div>
      </div>
    )
  }
}

BabyNames.propTypes = {}

export default BabyNames
