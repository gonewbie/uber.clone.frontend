import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { USER_PROFILE } from 'src/sharedQueries.queries';
import { updateProfile, updateProfileVariables, userProfile } from '../../types/api';
import { UPDATE_PROFILE } from './EditAccount.queries';
import EditAccountPresenter from './EditAccountPresenter';

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  loading: boolean;
}

interface IProps extends RouteComponentProps<any> {};

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: '',
    firstName: '',
    lastName: '',
    loading: true,
    profilePhoto: ''
  };

  public render() {
    const { email, firstName, lastName, profilePhoto, loading } = this.state;
    return (
      <Query<userProfile> query={USER_PROFILE} onCompleted={this.updateFields}>
        {() => (
          <Mutation<updateProfile, updateProfileVariables>
            mutation={UPDATE_PROFILE}
            variables={{
              email,
              firstName,
              lastName,
              profilePhoto
            }}
            refetchQueries={[{query: USER_PROFILE}]}
            onCompleted={data => {
              const { UpdateMyProfile } = data;
              if (UpdateMyProfile.ok) {
                toast.success('Profile updated!')
              } else if (UpdateMyProfile.error) {
                toast.error(UpdateMyProfile.error);
              }
            }}
          >
            {(updateProfileMutation, { loading: updateLoading }) => (
              <EditAccountPresenter
                email={email}
                lastName={lastName}
                firstName={firstName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={updateLoading || loading}
                onSubmit={() => updateProfileMutation()}
              />
            )}
          </Mutation>
        )}
      </Query>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: {} | userProfile) => {
    if ('GetMyProfile' in data) {
      const {
        GetMyProfile: { user }
      } = data;
      if (user) {
        const { firstName, lastName, email, profilePhoto } = user;
        const loading = false;
        this.setState({
          email,
          firstName,
          lastName,
          loading,
          profilePhoto
        } as any);
      }
    }
  }
}

export default EditAccountContainer;