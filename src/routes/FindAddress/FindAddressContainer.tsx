import React from 'react';
import ReactDOM from 'react-dom';
import FindAddressPresenter from './FindAddressPresenter';

interface IState {
  lat: number;
  lng: number;
}

class FindAddressContainer extends React.Component<any, IState> {
  public mapRef: any;
  public map: google.maps.Map | null;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    )
  }

  public render() {
    return (
      <FindAddressPresenter mapRef={this.mapRef} />
    );
  }

  public handleGeoSuccess: PositionCallback = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.loadMap(latitude, longitude);
  }

  public handleGeoError: PositionErrorCallback = (error) => {
    console.error(`Error ${error.code}: ${error.message}`);
  }

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 11
    }
    this.map = new maps.Map(mapNode, mapConfig);
    this.map!.addListener('dragend', this.handleDragEnd);
  }

  public handleDragEnd = () => {
    if (!this.map) { return; };
    const newCenter = this.map!.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    console.log(lat, lng);
    this.setState({
      lat,
      lng
    })
  }
}

export default FindAddressContainer;