import React from 'react';
import ReactDOM from 'react-dom';
import FindAddressPresenter from './FindAddressPresenter';

class FindAddressContainer extends React.Component<any> {
  public mapRef: any;
  public map: google.maps.Map | null;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
  }

  public componentDidMount() {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    console.log(google);
    console.log(this.mapRef.current);
    console.log(mapNode);
    console.log(mapNode === this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat: 37.5665,
        lng: 126.9780
      },
      disableDefaultUI: true,
      zoom: 11
    }
    this.map = new maps.Map(mapNode, mapConfig);
  }

  public render() {
    return (
      <FindAddressPresenter mapRef={this.mapRef} />
    );
  }
}

export default FindAddressContainer;