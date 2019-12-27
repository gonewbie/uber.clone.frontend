import React from 'react';
import { MutationFunction } from 'react-apollo';
import Button from "../../Components/Button";
import styled from '../../typed-components';
import {getRide, updateRide, updateRideVariables, userProfile} from "../../types/api";

const defaultProfile = "https://user-images.githubusercontent.com/11402468/58876263-7ee5fa80-8708-11e9-8eb7-b5ef5f2966d0.jpeg";

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${props => props.theme.blueColor};
`;

const Img = styled.img`
  border-radius: 50%;
  margin-right: 20px;
  max-width: 50px;
  height: 50px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0px;
`;

const ExtendedButton = styled(Button)`
  margin-bottom: 30px;
`;

interface IProps {
  rideData?: getRide;
  userData?: userProfile;
  updateRideMutation: MutationFunction<updateRide, updateRideVariables>;
}

const renderStatusButton = ({ ride, user, updateRideMutation }) => {
  console.log(ride);
  if (ride.driver && user && ride.driver.id === user.id) {
    if (ride.status === 'ACCEPTED') {
      return (
        <ExtendedButton
          value='Picked Up'
          onClick={() => {
            updateRideMutation({
              variables: {
                rideId: ride.id,
                status: 'ONROUTE'
              }
            })
          }}
        />
      )
    } else if (ride.status === 'ONROUTE') {
      return (
        <ExtendedButton
          value='Finished'
          onClick={() => {
            updateRideMutation({
              variables: {
                rideId: ride.id,
                status: 'FINISHED'
              }
            })
          }}
        />
      )
    }
  }
  return false;
};

const RidePresenter: React.SFC<IProps> = ({
  rideData: { GetRide: { ride = null } = {} } = { GetRide: { ride: null } },
  userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: { user: null } },
  updateRideMutation
}) => (
  <Container>
    {ride && (
      <>
        <Title>Passenger</Title>
        {ride.passenger && (
          <Passenger>
            <Img src={ride.passenger.profilePhoto || defaultProfile} />
            <Data>{ride.passenger.fullName}</Data>
          </Passenger>
        )}
        {ride.driver && (
          <>
            <Title>Driver</Title>
            <Passenger>
              <Img src={ride.driver.profilePhoto || defaultProfile} />
              <Data>{ride.driver.fullName}</Data>
            </Passenger>
          </>
        )}
        <Title>From</Title>
        <Data>{ride.pickUpAddress}</Data>
        <Title>To</Title>
        <Data>{ride.dropOffAddress}</Data>
        <Title>Price</Title>
        <Data>{ride.price}</Data>
        <Title>Distance</Title>
        <Data>{ride.distance}</Data>
        <Title>Duration</Title>
        <Data>{ride.duration}</Data>
        <Title>Status</Title>
        <Data>{ride.status}</Data>
        <Buttons>
          {renderStatusButton({ ride, user, updateRideMutation })}
        </Buttons>
      </>
    )}
  </Container>
);

export default RidePresenter;