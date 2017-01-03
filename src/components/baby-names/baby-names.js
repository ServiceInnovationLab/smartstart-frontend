import './baby-names.scss'

import React, { Component } from 'react'
import { IndexLink } from 'react-router'
import BubbleChart from 'components/baby-names/bubble-chart/bubble-chart'
import nameData from 'components/baby-names/baby-name-data'

class BabyNames extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: nameData,
      category: 'girls',
      year: '2015'// TODO default to 2016
    }

    this.setCategory = this.setCategory.bind(this)
    this.setYear = this.setYear.bind(this)
    this.categorySelected = this.categorySelected.bind(this)
  }

  setCategory (value) {
    this.setState({
      category: value
    })
  }

  setYear () {
    this.setState({
      year: this.yearPicker.value
    })
  }

  categorySelected (value) {
    return this.state.category === value ? 'selected' : ''
  }

  render () {
    let currentTopName = this.state.data[this.state.category][this.state.year][0]
    let yearOptions = []

    for (let year in this.state.data[this.state.category]) {
      yearOptions.unshift(<option key={year} value={year}>{year}</option>)
    }

    return (
      <div>
        <div className='baby-names-header'>
          <h2 className='baby-names-header-title'><span className='visuallyhidden'>New Zealand baby names 2016</span></h2>
          <div className='feature-page-content bubble-chart-container-wrapper'>
            <BubbleChart data={this.state.data} category={this.state.category} year={this.state.year} />
          </div>
        </div>
        <div className='feature-page-content'>
          <p className='bubble-chart-caption'><b>{currentTopName.name}</b> is the most popular {this.state.category} name for <b>{this.state.year}</b> with <b>{currentTopName.amount}</b> babies given that name.</p>

          <div className='bubble-chart-category'>
            <button onClick={() => this.setCategory('girls')} className={this.categorySelected('girls')}>Girls</button>
            <button onClick={() => this.setCategory('boys')} className={this.categorySelected('boys')}>Boys</button>
          </div>

          <select ref={(ref) => { this.yearPicker = ref }} className='bubble-chart-year' onChange={this.setYear}>
            {yearOptions}
          </select>

          <p className='bubble-chart-controls-help'>Use the controls above to switch between girls and boys names, and see the top ten for a previous year.</p>
          <h3>Top baby names 2016</h3>

          <h4 className='introtext'>The top baby names of 2016 have now been released with Oliver and Olivia topping the list for a second year in a row.</h4>

          <h5>Top 10 names of 2016</h5>

          <p>In 2016, Olivia and Oliver remained the most popular baby names with Jack and William staying in second place for boys, and Charlotte for girls.</p>

          <p>Each year, the Department of Internal Affairs releases a list of the most popular baby names for boys and girls registered in New Zealand.  Registering your baby is free, and it’s an important step for all parents. Registration gives children their legal identity and the rights, responsibilities and access to support services associated with being a New Zealander.</p>

          <blockquote>Did you know, the top 100 names make up only a small proportion of all names given to babies, with over [TODO NUMBER HERE] first names registered for children born last year?</blockquote>

          <p>Having a baby can be a busy time for new and expectant parents, and it can be hard to keep track of everything you need to do - that’s where SmartStart can help. SmartStart is the one place to go for step-by-step information to get parents and babies off to the best start. Make sure you take the time to <IndexLink to={'/'}>have a look</IndexLink>.</p>

          <h5>Full top 100 lists</h5>
          <ul>
            <li><a href='#'>Top 100 Male and Female Baby Names (xls 93kb)</a></li>
            <li><a href='#'>Top 100 Male Baby Names (pdf 49kb)</a></li>
            <li><a href='#'>Top 100 Female Baby Names (pdf 48kb)</a></li>
          </ul>

          <h5>Share this with your friends</h5>
          <p className='social-media'>
            <a className='facebook' href='https://www.facebook.com/dialog/share?app_id=749135385236444&display=popup&href=https%3A%2F%2Fsmartstart.services.govt.nz' target='_blank'rel='noreferrer noopener'><span className='visuallyhidden'>Share on Facebook</span></a>
            <a className='twitter' href='https://twitter.com/intent/tweet?text=What%20were%20New%20Zealand%27s%20most%20popular%20baby%20names%20for%202016%3F%20Find%20out%20at%20https%3A%2F%2Fsmartstart.services.govt.nz' target='_blank' rel='noreferrer noopener'><span className='visuallyhidden'>Share on Twitter</span></a>
          </p>
        </div>
      </div>
    )
  }
}

BabyNames.propTypes = {}

export default BabyNames
