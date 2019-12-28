import React from 'react';
import styled from '../../typed-components';
import Button from "../Button";

interface IProps {
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: string;
  passengerName: string;
  passengerPhoto: string;
  acceptRideMutation: any;
  id: number;
}

const Container = styled.div`
  background-color: white;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 30rem;
  height: 40rem;
  z-index: 9;
  padding: 20px;
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
  margin-left: 20px;
  width: 10rem;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const RidePopUp: React.SFC<IProps> = ({
  pickUpAddress,
  dropOffAddress,
  price,
  distance,
  passengerName,
  passengerPhoto,
  acceptRideMutation,
  id
}) => (
  <Container>
    <Title>Pick Up Address</Title>
    <Data>{pickUpAddress}</Data>
    <Title>Drop Off Address</Title>
    <Data>{dropOffAddress}</Data>
    <Title>Price</Title>
    <Data>{`$ ${price}`}</Data>
    <Title>Distance</Title>
    <Data>{distance}</Data>
    <Title>Passenger</Title>
    <Passenger>
      <Data>{passengerName}</Data>
      <Img src={passengerPhoto} />
    </Passenger>
    <Button
      value='Accept Ride'
      onClick={() => acceptRideMutation({ variables: { rideId: id } })}
    />
  </Container>
);

export default RidePopUp;