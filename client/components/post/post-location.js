import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
L.Icon.Default.imagePath = foi.url;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapContainer = styled.div`
  overflow: hidden;
  border-radius: 3px 3px 0 0;
  .leaflet-container {
    width: 100%;
    height: 300px;
  }
`;

class PostLocation extends Component {

  render() {
    const { data } = this.props;
    const position = [data.latitude, data.longitude];
    return <MapContainer>
      <Map center={position} zoom={17}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    </MapContainer>;
  }

}

export default PostLocation;
