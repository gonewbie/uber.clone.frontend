import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { LOG_USER_OUT } from 'src/innerQueries';
import { GET_PLACES, USER_PROFILE } from 'src/sharedQueries.queries';
import { getPlaces, userProfile } from 'src/types/api';
import SettingsPresenter from './SettingsPresenter';

class SettingsContainer extends React.Component {
  public render() {
    return (
      <Mutation mutation={LOG_USER_OUT}>
        {logUserOut => (
          <Query<userProfile> query={USER_PROFILE}>
            {({ data, loading: userDataLoading }) => (
              <Query<getPlaces> query={GET_PLACES}>
                {({ data: placesData, loading: placesLoading }) => (
                  <SettingsPresenter
                    userDataLoading={userDataLoading}
                    userData={data}
                    placesLoading={placesLoading}
                    placesData={placesData}
                    logUserOut={logUserOut}
                  />
                )}
              </Query>
            )}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default SettingsContainer;