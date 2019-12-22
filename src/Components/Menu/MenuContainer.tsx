import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { toast } from 'react-toastify';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import { toggleDriving, userProfile } from 'src/types/api';
import { TOGGLE_DRIVING } from './Menu.queries';
import MenuPresenter from './MenuPresenter';



class MenuContainer extends React.Component {
  public render() {
    return (
      <Mutation<toggleDriving>
        mutation={ TOGGLE_DRIVING }
        update={(cache, { data }) => {
          if (!data) {
            return;
          }
          const { ToggleDrivingMode } = data;
          if (!ToggleDrivingMode.ok) {
            toast.error(ToggleDrivingMode.error);
            return;
          }
          const query: userProfile | null = cache.readQuery({
            query: USER_PROFILE
          });
          if (!query) {
            return;
          }
          const {
            GetMyProfile: { user }
          } = query;

          if (user) {
            user.isDriving = !user.isDriving;
            cache.writeQuery({ query: USER_PROFILE, data: query });
          }
        }}
      >
        {toggleDrivingMutation => (
          <Query<userProfile> query={USER_PROFILE}>
            {({ data, loading }) => (
            <MenuPresenter
              data={data}
              loading={loading}
              ToggleDrivingMutation={toggleDrivingMutation}
            />)}
          </Query>
        )}
      </Mutation>
    )
  }
}

export default MenuContainer;