import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AddPlace from '../../routes/AddPlace';
import EditAccount from '../../routes/EditAccount';
import FindAddress from '../../routes/FindAddress';
import Home from '../../routes/Home';
import PhoneLogin from '../../routes/PhoneLogin';
import Places from '../../routes/Places';
import Ride from '../../routes/Ride';
import Settings from '../../routes/Settings';
import SocialLogin from '../../routes/SocialLogin';
import VerifyPhone from '../../routes/VerifyPhone';

interface IProps {
  isLoggedIn: boolean;
}

const LoggedOutRouter: React.SFC = () => (
  <Switch>
    <Route path={'/'} exact={true} component={Home} />
    <Route path={'/phone-login'} exact={true} component={PhoneLogin} />
    <Route path={'/verify-phone/:number'} exact={true} component={VerifyPhone} />
    <Route path={'/social-login'} exact={true} component={SocialLogin} />
    <Redirect from={'*'} to={'/'} />
  </Switch>
);

const LoggedInRouter: React.SFC = () => (
  <Switch>
    <Route path={'/'} exact={true} component={Home} />
    <Route path={'/ride'} exact={true} component={Ride} />
    <Route path={'/edit-account'} exact={true} component={EditAccount} />
    <Route path={'/settings'} exact={true} component={Settings} />
    <Route path={'/places'} exact={true} component={Places} />
    <Route path={'/add-place'} exact={true} component={AddPlace} />
    <Route path={'/find-address'} exact={true} component={FindAddress} />
    <Redirect from={'*'} to={'/'} />
  </Switch>
);

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    { isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter /> }
  </BrowserRouter>
);

export default AppPresenter;