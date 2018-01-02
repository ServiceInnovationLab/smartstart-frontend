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
      year: '2017'
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
          <h2 className='baby-names-header-title'><span className='visuallyhidden'>New Zealand baby names 2017</span></h2>
          <div className='feature-page-content bubble-chart-container-wrapper'>
            <BubbleChart data={this.state.data} category={this.state.category} year={this.state.year} />
          </div>
        </div>
        <div className='feature-page-content'>
          <p className='bubble-chart-caption'><b>{currentTopName.name}</b> is the most popular {this.state.category} name for <b>{this.state.year}</b> with <b>{currentTopName.amount}</b> babies given that name.</p>

          <span className='visuallyhidden'>Select boys or girls names</span>
          <div className='bubble-chart-category'>
            <button onClick={() => this.setCategory('girls')} className={this.categorySelected('girls')}>Girls</button>
            <button onClick={() => this.setCategory('boys')} className={this.categorySelected('boys')}>Boys</button>
          </div>

          <label>
            <span className='visuallyhidden'>Select which year to see the top 10 for</span>
            <select ref={(ref) => { this.yearPicker = ref }} className='bubble-chart-year' onChange={this.setYear}>
              {yearOptions}
            </select>
          </label>

          <p className='bubble-chart-controls-help'>Use the controls above to switch between girls and boys names, and see the top ten for a previous year.</p>

          <h3>Top baby names</h3>

          <h4 className='introtext'>The top baby names of 2017 have been released with Charlotte and Oliver topping the list.</h4>

          <p>Oliver has remained the most popular boys name for the fifth year running, with Charlotte bumping Olivia down from the top spot to return as the most popular girls name for 2017.</p>

          <p>Each year, the Department of Internal Affairs releases a list of the most popular baby names for boys and girls registered in New Zealand.</p>

          <p>Registering your baby is free, and it’s an important step for all parents. Registration gives children their legal identity and the rights, responsibilities and access to support services associated with being a New Zealander.</p>

          <blockquote>The top 100 names make up only a small proportion of all names given to babies, with nearly 13,000 unique first names registered for children born in 2017.</blockquote>

          <p>Having a baby can be a busy time for new and expectant parents, and it can be hard to keep track of everything you need to do - that’s where SmartStart can help.</p>

          <p><IndexLink to={'/'}>Find step-by-step information and use services on SmartStart</IndexLink></p>

          <h5>New Zealand top baby names</h5>
          <ul>
            <li><a href='/assets/files/Top-100-girls-names.pdf'>Top 100 girls’ names (pdf 134kb)</a></li>
            <li><a href='/assets/files/Top-100-boys-names.pdf'>Top 100 boys’ names (pdf 133kb)</a></li>
            <li><a href='/assets/files/Top-100-girls-and-boys-names-since-1954.xlsx'>Top 100 girls’ and boys’ names since 1954 (xlsx 266kb)</a></li>
            <li><a href='https://www.dia.govt.nz/press.nsf/d77da9b523f12931cc256ac5000d19b6/98fbaca367aaef57cc25819a00791da3'>Most popular Māori baby names for 2016</a></li>
          </ul>

          <h5>Share this with your friends</h5>
          <p className='social-media'>
            <a className='facebook' href='https://www.facebook.com/dialog/share?app_id=749135385236444&href=https%3A%2F%2Fsmartstart.services.govt.nz&redirect_uri=https%3A%2F%2Fsmartstart.services.govt.nz' target='_blank' rel='noreferrer noopener'><span className='visuallyhidden'>Share on Facebook</span></a>
            <a className='twitter' href='https://twitter.com/intent/tweet?text=Find%20out%20the%20top%20baby%20names%20for%202017%20and%20the%20easiest%20way%20to%20get%20your%20baby%20off%20to%20the%20best%20possible%20start%20https%3A%2F%2Fsmartstart.services.govt.nz' target='_blank' rel='noreferrer noopener'><span className='visuallyhidden'>Share on Twitter</span></a>
          </p>
        </div>
      </div>
    )
  }
}

BabyNames.propTypes = {}

export default BabyNames
