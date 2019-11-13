import React from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.scss";
import { Input } from "semantic-ui-react";
import {
  Card,
  Dropdown,
  Icon,
  Menu,
  Modal,
  Button,
  Form
} from "semantic-ui-react";
import AccountService from "./services/AccountService/account.service";
import { connect } from "react-redux";
import { withCookies } from "react-cookie";
import { COOKIES, ENV } from "./constants/constants";
import { updateAccount } from "./store/actions";
import { Map } from "./components/Map";
import { DateTimeInput } from "semantic-ui-calendar-react";
import Header from "./components/Header/header";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

const accountService = new AccountService();

export class AppComponent extends React.Component<any> {
  readonly state: any;

  constructor(props) {
    super(props);

    this.state = {
      loadingAccount: true,
      email: null,
      password: null,
      date: null
    };
  }

  componentDidMount = () => {
    this.getAccount();
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

  getContent = () => {
    const { loadingAccount } = this.state;
    const { cookies, account } = this.props;

    if (!loadingAccount) {
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
  updateAccount: (account: any) => dispatch(updateAccount(account))
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default withCookies(App);
