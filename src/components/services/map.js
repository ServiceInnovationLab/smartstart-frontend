import React, { PropTypes, Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from 'components/services/marker'

class ResultMap extends Component {

  render() {
    const { zoom, center, markers, showList } = this.props
    const options = {
      fullscreenControl: false // lack of inline styles makes this look broken
    }
    const googleMapLoader = () => {
      // custom loader as we loaded the api via react-async-script-loader in parent
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps)
        } else {
          reject('google maps object not found')
        }
      })
    }

    return (
      <GoogleMapReact
        center={center}
        zoom={zoom}
        options={options}
        googleMapLoader={googleMapLoader}
      >
      {markers && markers.map((marker, index) => {
        return <Marker
            key={index}
            lat={marker.LATITUDE}
            lng={marker.LONGITUDE}
            title={marker.PROVIDER_NAME}
            id={marker.FSD_ID}
            showList={showList}
          />
      })}

      </GoogleMapReact>
    )
  }
}

ResultMap.propTypes = {
  showList: PropTypes.func.isRequired,
  center: PropTypes.object,
  zoom: PropTypes.number,
  markers: PropTypes.array
}

export default ResultMap
