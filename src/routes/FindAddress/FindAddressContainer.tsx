import React from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { getCode, reverseGeoCode } from '../../lib/mapHelpers';
import FindAddressPresenter from './FindAddressPresenter';

interface IProps extends RouteComponentProps<any> {
  google: any;
}

interface IState {
  address: string;
  lat: number;
  lng: number;
}

class FindAddressContainer extends React.Component<IProps, IState> {
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
        onPickPlace={this.onPickPlace}
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
    this.reverseGeocodeAddress(latitude, longitude);
  }

  public handleGeoError: PositionErrorCallback = (error) => {
    toast.error(`HandleGeoError is occured! ${error.code}: ${error.message}`);
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
    this.setState({
      lat,
      lng
    })
    this.reverseGeocodeAddress(lat, lng);
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = async () => {
    if (!this.map) { return };
    const { address } = this.state;
    const result = await getCode(address);
    if (result !== false) {
      const { lat, lng, formatted_address } = result;
      this.setState({
        address: formatted_address,
        lat,
        lng
      });
      this.map.panTo({ lat, lng })
    }
  }

  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    const { history } = this.props;
    history.push({
      pathname: '/add-place',
      state: {
        address,
        lat,
        lng
      }
    })
  }

  public reverseGeocodeAddress = async (lat: number, lng: number) => {
    const reversedAddress = await reverseGeoCode(lat, lng);
    if (reversedAddress !== false) {
      this.setState({
        address: reversedAddress
      })
    }
  }
}

export default FindAddressContainer;