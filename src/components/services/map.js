import React, { PropTypes, Component } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from 'components/services/marker'

class ResultMap extends Component {
  render() {
    const { apiIsLoaded, zoom, center, markers } = this.props
    const options = {
      fullscreenControl: false // need to disable until https://github.com/istarkov/google-map-react/pull/452 is merged
    }

    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: GOOGLE_API_KEY,
          libraries: 'places' // so we can use the script for the location autocomplete too
        }}
        onGoogleApiLoaded={apiIsLoaded}
        yesIWantToUseGoogleMapApiInternals={true}
        center={center}
        zoom={zoom}
        options={options}
      >
      {markers && markers.map((marker, index) => {
        return <Marker
            key={index}
            lat={marker.LATITUDE}
            lng={marker.LONGITUDE}
            title={marker.SERVICE_NAME}
          />
      })}

      </GoogleMapReact>
    )
  }
}

ResultMap.propTypes = {
  apiIsLoaded: PropTypes.func.isRequired,
  center: PropTypes.object,
  zoom: PropTypes.number,
  markers: PropTypes.array
}

export default ResultMap
