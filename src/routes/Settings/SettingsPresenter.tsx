import React from 'react';
import { MutationFunction } from 'react-apollo';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Place from '../../Components/Place';
import styled from '../../typed-components';
import { getPlaces, userProfile } from '../../types/api';

const Container = styled.div`
  padding: 0px 40px;
`;

const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
`;

const GridLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 10px;
  margin-bottom: 10px;
`;

const Keys = styled.div``;

const Key = styled.span`
  display: block;
  cursor: pointer;
`;

const FakeLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 20px 0;
`;

interface IProps {
  logUserOut: MutationFunction;
  userData?: userProfile;
  userDataLoading: boolean;
  placesData?: getPlaces;
  placesLoading: boolean;
}

const SettingsPresenter: React.SFC<IProps> = ({
  logUserOut,
  userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: {} },
  userDataLoading,
  placesData: { GetMyPlaces: { places = null } = {} } = { GetMyPlaces: {} },
  placesLoading,
}) => (
  <>
    <Helmet>
      <title>Settings | Uber</title>
    </Helmet>
    <Header title='Account Settings' backTo='/' />
    <Container>
      <GridLink to='/edit-account'>
        {!userDataLoading &&
          user &&
          user.profilePhoto &&
          user.email &&
          user.fullName && (
            <>
              <Image src={user.profilePhoto}/>
              <Keys>
                <Key>{user.fullName}</Key>
                <Key>{user.email}</Key>
              </Keys>
            </>
          )
        }
      </GridLink>
      {!placesLoading &&
        places &&
        places.map(place => (
          <Place
            key={place!.id}
            name={place!.name}
            address={place!.address}
            fav={place!.isFav}
            id={place!.id}
          />
        ))
      }
      <StyledLink to='/places'>Go to Places</StyledLink>
      <FakeLink onClick={() => logUserOut}>Log Out</FakeLink>
    </Container>
  </>
);

export default SettingsPresenter;