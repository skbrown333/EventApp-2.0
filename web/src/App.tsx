import React from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.scss";
import AccountService from "./services/AccountService/account.service";
import EventService from "./services/EventService/event.service";
import { connect } from "react-redux";
import { withCookies } from "react-cookie";
import { COOKIES, ENV } from "./constants/constants";
import { updateAccount, updateEvents, updateCenter } from "./store/actions";
import { Map } from "./components/Map/Map";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

const accountService = new AccountService();
const eventService = new EventService();

export class AppComponent extends React.Component<any> {
  readonly state: any;

  constructor(props) {
    super(props);

    let values = queryString.parse(this.props.location.search);
    console.log("values: ", values);
    //@ts-ignore
    let lat: any = parseFloat(values.lat);
    //@ts-ignore
    let lng: any = parseFloat(values.lng);

    if (lat && lng) {
      this.props.updateCenter({ lat, lng });
    }

    this.state = {
      loadingAccount: true,
      loadingEvents: true,
      email: null,
      password: null,
      date: null
    };
  }

  componentDidMount = () => {
    this.getAccount();
    this.getEvents();
  };

  getAccount = async () => {
    let cookies = this.props.cookies;
    let token = cookies.get(COOKIES.token);
    if (!token) {
      this.setState({ loadingAccount: false });
      return;
    }
    try {
      let data = await accountService.authenticateByToken(token);
      if (!data.token) {
        this.setState({ loadingAccount: false });
        return;
      }
      cookies.set(COOKIES.token, data.token, { secure: !ENV.isLocal });
      this.props.updateAccount(data.account);
      this.setState({ loadingAccount: false });
    } catch {
      this.setState({ loadingAccount: false });
    }
  };

  getEvents = async () => {
    try {
      let events = await eventService.get(null);
      this.props.updateEvents(events);
      this.setState({ loadingEvents: false });
    } catch (err) {
      this.setState({ loadingEvents: false });
    }
  };

  getContent = () => {
    const { loadingAccount, loadingEvents } = this.state;
    const { cookies, account } = this.props;

    if (!loadingAccount && !loadingEvents) {
      return (
        <div className="app">
          <Route path="/" render={() => <Header cookies={cookies} />} />
          <div className="content">
            <Route exact path="/" render={() => <Map />} />
            <Route
              exact
              path="/"
              render={() => <Sidebar cookies={cookies} />}
            />
            <Route
              exact
              path="/login"
              render={() => {
                return Object.keys(account).length > 0 ? (
                  <Redirect to="/" />
                ) : (
                  <Login cookies={cookies} />
                );
              }}
            />
            <Route
              exact
              path="/logout"
              render={() => {
                {
                  cookies.set(COOKIES.token, null, { secure: !ENV.isLocal });
                }
                return <Redirect to="/" />;
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    return this.getContent();
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateAccount: (account: any) => dispatch(updateAccount(account)),
  updateEvents: (events: any) => dispatch(updateEvents(events)),
  updateCenter: (center: any) => dispatch(updateCenter(center))
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AppComponent));

export default withCookies(App);
