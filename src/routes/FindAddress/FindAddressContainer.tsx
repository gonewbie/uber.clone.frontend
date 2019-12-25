import React from 'react';
import ReactDOM from 'react-dom';
import { reverseGeoCode } from '../../lib/mapHelpers';
import FindAddressPresenter from './FindAddressPresenter';

interface IState {
  address: string;
  lat: number;
  lng: number;
}

class FindAddressContainer extends React.Component<any, IState> {
  public mapRef: any;
  public map: google.maps.Map | null;
  public state = {
    address: '',
    lat: 0,
    lng: 0
  }

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
    const { address } = this.state;
    return (
      <FindAddressPresenter
        mapRef={this.mapRef}
        address={address}
        onInputChange={this.onInputChange}
        onInputBlur={this.onInputBlur}
      />
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

  public handleDragEnd = async () => {
    if (!this.map) { return; };
    const newCenter = this.map!.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    const address = await reverseGeoCode(lat, lng);
    console.log(lat, lng);
    this.setState({
      address,
      lat,
      lng
    })
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = () => {
    console.log('Address update!');
  }
}

export default FindAddressContainer;