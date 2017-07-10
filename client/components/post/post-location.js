import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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
