import { gql } from 'apollo-boost';

export const EDIT_PLACE = gql`
  mutation editPlace($PlaceId: Int!, $isFav: Boolean) {
    EditPlace(placeId: $PlaceId, isFav: $isFav) {
      ok
      error
    }
  }
`;