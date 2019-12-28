import React from 'react';
import { Mutation } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { GET_PLACES } from 'src/sharedQueries.queries';
import { addPlace, addPlaceVariables } from 'src/types/api';
import { ADD_PLACE } from './AddPlace.queries';
import AddPlacePresenter from './AddPlacePresenter';

interface IState {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

interface IProps extends RouteComponentProps <any> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { location: { state = {} } = {} } = props;
    this.state = {
      address: state.address || '',
      lat: state.lat || 0,
      lng: state.lng || 0,
      name: ''
    };
  }

  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;
    return (
      <Mutation<addPlace, addPlaceVariables>
        mutation={ADD_PLACE}
        variables={{
          address,
          isFav: false,
          lat,
          lng,
          name
        }}
        onCompleted={ data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success('Place added');
            setTimeout(() => {
              history.push('/places');
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{query: GET_PLACES}]}
      >
        {(addPlacesMutation, { loading }) => (
          <AddPlacePresenter
            onInputChange={this.onInputChange}
            address={address}
            name={name}
            loading={loading}
            onSubmit={() => this.validatePlace(addPlacesMutation)}
          />
        )}
      </Mutation>
    )
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  }

  public validatePlace(mutation) {
    const { lat, lng } = this.state;
    if (lat === 0 && lng === 0) {
      toast.error('Invalid Position Info');
      return;
    }
    mutation();
  }
}

export default AddPlaceContainer;