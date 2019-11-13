import * as React from "react";
import { connect } from "react-redux";
import AccountService from "../../services/AccountService/account.service";
import { COOKIES, ENV } from "../../constants/constants";
import { updateAccount } from "../../store/actions";
import { Button, Form } from "semantic-ui-react";

import "./_login.scss";

const accountService = new AccountService();

interface State {
  readonly email: string;
  readonly password: string;
}
export class LoginComponent extends React.Component<any, State> {
  readonly state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  //@ts-ignore
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  async handleLogin(event: any) {
    event.preventDefault();
    if (this.state.email === "" || this.state.password === "") return;
    let options = {
      email: this.state.email,
      password: this.state.password
    };
    try {
      let data = await accountService.authenticate(options);
      if (!data.token) return;

      this.props.cookies.set(COOKIES.token, data.token, {
        secure: !ENV.isLocal
      });
      this.props.updateAccount(data.account);
      console.log("data: ", data);
      window.location.replace("/");
    } catch (err) {
      console.log("err: ", err);
      console.log("Error Logging in");
    }
  }

  handleSubmit = async () => {
    if (this.state.email === "" || this.state.password === "") return;
    let options = {
      email: this.state.email,
      password: this.state.password
    };
    try {
      let data = await accountService.authenticate(options);
      console.log("data: ", data);
      if (!data.token) return;

      this.props.cookies.set(COOKIES.token, data.token, {
        secure: !ENV.isLocal
      });
      window.location.replace("/");
    } catch (err) {
      console.log("err: ", err);
      console.log("Error Logging in");
    }
  };

  render() {
    const { email, password } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>Email</label>
          <Form.Input
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <Form.Input
            placeholder="Password"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Button type="submit" fluid primary>
          Login
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    state: state,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateAccount: (account: any) => dispatch(updateAccount(account))
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default Login;
