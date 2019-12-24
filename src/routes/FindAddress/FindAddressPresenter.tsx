import React from 'react';
import Helmet from 'react-helmet';
import styled from 'src/typed-components';

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

interface IProps {
  mapRef: any;
}

class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const { mapRef } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Address | Uber</title>
        </Helmet>
        <Map ref={mapRef}/>
      </div>
    );
  }
}

export default FindAddressPresenter;