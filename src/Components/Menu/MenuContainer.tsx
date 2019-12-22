import React from 'react';
import { Query } from 'react-apollo';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import { userProfile } from 'src/types/api';
import MenuPresenter from './MenuPresenter';

class MenuContainer extends React.Component {
  public render() {
    return (
      <Query<userProfile> query={USER_PROFILE}>
        {({ data, loading }) => <MenuPresenter data={data} loading={loading}/>}
      </Query>
    )
  }
}

export default MenuContainer;