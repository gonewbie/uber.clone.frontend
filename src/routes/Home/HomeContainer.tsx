import React from 'react';
import { graphql, Mutation, MutationFunction, Query } from 'react-apollo';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import {getCode, reverseGeoCode} from 'src/lib/mapHelpers';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import {
  accecptRide, accecptRideVariables,
  getDrivers, getRides,
  reportMovement,
  reportMovementVariables, requestRide, requestRideVariables,
  userProfile
} from '../../types/api'
import {ACCEPT_RIDE, GET_NEARBY_DRIVERS, GET_NEARBY_RIDE, REPORT_LOCATION, REQUEST_RIDE} from './Home.queries';
import HomePresenter from './HomePresenter';

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFunction;
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
  fromAddress: string;
  isDriving: boolean;
}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | null = null;
  public userMarker: google.maps.Marker | null = null;
  public toMarker: google.maps.Marker | null = null;
  public directions: google.maps.DirectionsRenderer | null = null;
  public drivers: google.maps.Marker[];

  public state = {
    distance: '',
    duration: '',
    fromAddress: '',
    isDriving: true,
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: '',
    toAddress: '',
    toLat: 0,
    toLng: 0
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    )
  }

  public render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      distance,
      fromAddress,
      lat,
      lng,
      toLat,
      toLng,
      duration,
      isDriving
    } = this.state;
    return (
      <Query<userProfile>
        query={USER_PROFILE}
        onCompleted={this.handleProfileQuery}
      >
        {({ data, loading: profileLoading }) => (
          <Query<getDrivers>
            query={GET_NEARBY_DRIVERS}  
            pollInterval={1000}
            skip={isDriving}
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <Mutation<requestRide, requestRideVariables>
                mutation={REQUEST_RIDE}
                variables={{
                  distance,
                  dropOffAddress: toAddress,
                  dropOffLat: toLat,
                  dropOffLng: toLng,
                  duration,
                  pickUpAddress: fromAddress,
                  pickUpLat: lat,
                  pickUpLng: lng,
                  price: Number(price) || 0
                }}
              >
                {requestRideMutation => (
                  <Query<getRides> query={GET_NEARBY_RIDE} skip={!isDriving}>
                    {({ data: nearbyRide }) => (
                      <Mutation<accecptRide, accecptRideVariables>
                        mutation={ACCEPT_RIDE}
                      >
                        {acceptRideMutation => (
                          <HomePresenter
                            loading={profileLoading}
                            isMenuOpen={isMenuOpen}
                            toggleMenu={this.toggleMenu}
                            mapRef={this.mapRef}
                            toAddress={toAddress}
                            onInputChange={this.onInputChange}
                            onAddressSubmit={this.onAddressSubmit}
                            price={price}
                            data={data}
                            requestRideMutation={requestRideMutation}
                            nearbyRide={nearbyRide}
                            acceptRideMutation={acceptRideMutation}
                          />
                        )}
                      </Mutation>
                    )}
                  </Query>
                )}
              </Mutation>
            )}
          </Query>
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
    this.getFromAddress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };

  public handleGeoError: PositionErrorCallback = (error) => {
    toast.error(`HandleGeoError is occurred! ${error.code}: ${error.message}`);
  };

  public getFromAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      this.setState({
        fromAddress: address
      });
    }
  };

  public handleRideRequest = (data: requestRide) => {
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success('Drive requested, finding a driver');
    } else {
      toast.error(RequestRide.error);
    }
  };

  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile) {
      const {
        user
      } = GetMyProfile || { user: {} };
      this.setState({
        isDriving: user!.isDriving
      });
    }
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    if (!mapNode) {
      this.loadMap(lat, lng);
      return;
    }
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 13
    };
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
    const { reportLocation } = this.props;
    const {
      coords: { latitude: lat, longitude: lng }
    } = position;
    this.userMarker!.setPosition({ lat, lng });
    this.map!.panTo({ lat, lng });
    reportLocation({
      variables: {
        lat,
        lng
      }
    })
  };

  public handleGeoWatchError: PositionErrorCallback = (error) => {
    toast.error(`HandleGeoWatchError is occured! ${error.code}: ${error.message}`);
  };

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

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
  };

  public setBounds = () => {
    const { lat, lng, toLat, toLng } = this.state;
    const { google: {maps} } = this.props;
    const bounds = new maps.LatLngBounds();
    bounds.extend({ lat, lng });
    bounds.extend({ lat: toLat, lng: toLng });
    this.map!.fitBounds(bounds);
  };

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
    };

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
  };

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
  };

  public carculatePrice = (distance: string) => {
    return distance ? Number.parseFloat((Number.parseFloat(distance) * 3).toFixed(2)).toString(): '0'
  };

  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ('GetNearbyDrivers' in data) {
      const {
        GetNearbyDrivers: { drivers, ok }
      } = data;
      if(ok && drivers) {
        for (const driver of drivers) {
          const existingDriverMarker: google.maps.Marker | undefined = this.drivers.find((driverMarker: google.maps.Marker) => {
            const markerID = driverMarker.get('ID');
            return markerID === driver!.id;
          });
          if (existingDriverMarker) {
            this.updateDriverMarker(existingDriverMarker, driver);
          } else {
            this.createDriverMarker(driver);
          }
        }
      }
    }
  };

  public createDriverMarker = (driver) => {
    if (driver && driver.lastLat && driver.lastLng) {
      const { google } = this.props;
      const markerOptions: google.maps.MarkerOptions = {
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5
        },
        position: {
          lat: driver.lastLat,
          lng: driver.lastLng
        }
      };
      const newMarker: google.maps.Marker = new google.maps.Marker(markerOptions);
      if (newMarker) {
        this.drivers.push(newMarker);
        newMarker.set('ID', driver.id);
        newMarker.setMap(this.map);
      }
    }
    return;
  };

  public updateDriverMarker = (marker: google.maps.Marker, driver) => {
    if (driver && driver.lastLat && driver.lastLng) {
      marker.setPosition({
        lat: driver.lastLat,
        lng: driver.lastLng
      })
      marker.setMap(this.map);
    }
    return;
  }
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: 'reportLocation'
  }
)(HomeContainer);