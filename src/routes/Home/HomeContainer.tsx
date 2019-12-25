import React from 'react';
import { Query } from 'react-apollo';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import { userProfile } from '../../types/api'
import HomePresenter from './HomePresenter';

interface IProps extends RouteComponentProps<any> {
  google: any;
}
interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | null = null;
  public userMarker: google.maps.Marker | null = null;

  public state = {
    isMenuOpen: false,
    lat: 0,
    lng: 0
  }

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    navigator.geolocation.watchPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    )
  }

  public render() {
    const { isMenuOpen } = this.state;
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
      zoom: 11
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
  };

  public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
    console.log(position);
    return;
  }

  public handleGeoWatchError: PositionErrorCallback = (error) => {
    toast.error(`HandleGeoWatchError is occured! ${error.code}: ${error.message}`);
  }
}

export default HomeContainer;