import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import styleUtils from 'services/style-utils';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
L.Icon.Default.imagePath = foi.url;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').split(foi.url)[1],
    iconUrl: require('leaflet/dist/images/marker-icon.png').split(foi.url)[1],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').split(foi.url)[1],
});

const MapContainer = styled.div`
  margin: 0 0 .5rem;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    margin-bottom: ${styleUtils.margins[i]}rem;
  `)}
  .leaflet-container {
    width: 100%;
    height: 300px;
  }
`;

const VenueBox = styled.div`
  padding: 0 .5rem .5rem;
  font-size: .8em;
  color: #666;
  ${styleUtils.sizes.map((size, i) => styleUtils.media[size.device]`
    padding-right: ${styleUtils.margins[i]}rem;
    padding-left: ${styleUtils.margins[i]}rem;
    padding-bottom: ${styleUtils.margins[i]}rem;
  `)}
  h3 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;

class PostLocation extends Component {

  render() {
    const { data } = this.props;
    const position = data.location ? [data.location.latitude, data.location.longitude] : [data.latitude, data.longitude];
    return <div className="location-container">
      <MapContainer>
        <Map center={position} zoom={17} scrollWheelZoom={false} dragging={false}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
        </Map>
      </MapContainer>
      {data.title &&
        <VenueBox>
          <h3>{data.title}</h3>
          <p>{data.address}</p>
        </VenueBox>
      }
    </div>;
  }

}

export default PostLocation;
