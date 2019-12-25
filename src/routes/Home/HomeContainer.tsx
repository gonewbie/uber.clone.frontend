import React from 'react';
import { Query } from 'react-apollo';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { getCode } from 'src/lib/mapHelpers';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import { userProfile } from '../../types/api'
import HomePresenter from './HomePresenter';

interface IProps extends RouteComponentProps<any> {
  google: any;
}
interface IState {
  isMenuOpen: boolean;
  toAddress: string;
  toLat: number;
  toLng: number;
  lat: number;
  lng: number;
  distance: string;
  duration: string;
  price: string;
}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | null = null;
  public userMarker: google.maps.Marker | null = null;
  public toMarker: google.maps.Marker | null = null;
  public directions: google.maps.DirectionsRenderer | null = null;

  public state = {
    distance: '',
    duration: '',
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: '',
    toAddress: '',
    toLat: 0,
    toLng: 0
  }

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    )
  }

  public render() {
    const { isMenuOpen, toAddress, price } = this.state;
    return (
      <Query<userProfile>
        query={USER_PROFILE}
      >
        {({ loading }) => (
          <HomePresenter
            loading={loading}
            isMenuOpen={isMenuOpen}
            toggleMenu={this.toggleMenu}
            mapRef={this.mapRef}
            toAddress={toAddress}
            onInputChange={this.onInputChange}
            onAddressSubmit={this.onAddressSubmit}
            price={price}
          />
        )}
      </Query>
    );
  }

  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      }
    })
  };

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
      zoom: 13
    }
    this.map = new maps.Map(mapNode, mapConfig);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
    const userMarkerOption: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOption);
    this.userMarker!.setMap(this.map);
  };

  public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
    const {
      coords: { latitude: lat, longitude: lng }
    } = position;
    this.userMarker!.setPosition({ lat, lng });
    this.map!.panTo({ lat, lng });
  }

  public handleGeoWatchError: PositionErrorCallback = (error) => {
    toast.error(`HandleGeoWatchError is occured! ${error.code}: ${error.message}`);
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  }

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await getCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formattedAddress } = result;
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker!.setMap(this.map);

      this.setState({
        toAddress: formattedAddress,
        toLat: lat,
        toLng: lng
      }, () => {
        this.setBounds();
        this.createPath();
      });
    }
  }

  public setBounds = () => {
    const { lat, lng, toLat, toLng } = this.state;
    const { google: {maps} } = this.props;
    const bounds = new maps.LatLngBounds();
    bounds.extend({ lat, lng });
    bounds.extend({ lat: toLat, lng: toLng });
    this.map!.fitBounds(bounds);
  }

  public createPath = () => {
    const { lat, lng, toLat, toLng } = this.state;
    const { google } = this.props;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: '#000'
      },
      suppressMarkers: true
    }

    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const from = new google.maps.LatLng(lat, lng);
    const to = new google.maps.LatLng(toLat, toLng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(directionsOptions, this.handleRouteRequest);
  }

  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    const { google } = this.props;
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];
      console.log(distance, duration);
      this.setState({
        distance,
        duration,
        price: this.carculatePrice(distance)
      });
      this.directions!.setDirections(result);
      this.directions!.setMap(this.map);
    } else {
      toast.error('There is no route there.');
    }
  }

  public carculatePrice = (distance: string) => {
    return distance ? Number.parseFloat((Number.parseFloat(distance) * 3).toFixed(2)).toString(): '0'
  }
};

export default HomeContainer;