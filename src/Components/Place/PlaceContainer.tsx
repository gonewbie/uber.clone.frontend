import React from 'react';
import { Mutation } from 'react-apollo';
import { GET_PLACES } from 'src/sharedQueries.queries';
import { editPlace, editPlaceVariables } from 'src/types/api';
import { EDIT_PLACE } from './Place.queries';
import PlacePresenter from './PlacePresenter';

interface IProps {
  fav: boolean;
  name: string;
  address: string;
  id: number;
}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { id, fav, name, address } = this.props;
    return (
      <Mutation<editPlace, editPlaceVariables>
        mutation={EDIT_PLACE}
        variables={{
          PlaceId: id,
          isFav: !fav
        }}
        refetchQueries={[{ query: GET_PLACES }]}
      >
        {editPlaceMutation => (
          <PlacePresenter
            onToggleStar={editPlaceMutation}
            fav={fav}
            name={name}
            address={address}
          />
        )}
      </Mutation>
    )
  }
}

export default PlaceContainer;