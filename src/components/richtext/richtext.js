import './richtext.scss'

import React from 'react'

class Richtext extends React.Component {
  render () {
    const markup = {
      __html: this.props.text
    }

    return (
      <div className='richtext' dangerouslySetInnerHTML={markup} />
    )
  }
}

export default Richtext
