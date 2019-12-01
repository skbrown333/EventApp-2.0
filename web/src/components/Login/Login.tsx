import * as React from "react";
import { connect } from "react-redux";
import { COOKIES, ENV } from "../../constants/constants";

/* UI */
import { Button, Form, Input, Spin, message, Icon } from "antd";
/* Services */
import AccountService from "../../services/AccountService/account.service";
/* Store */
import { updateAccount } from "../../store/actions";
/* Styles */
import "./_login.scss";

const accountService = new AccountService();

interface State {
  loading: boolean;
}

export class LoginComponent extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false
    };
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        email: fieldsValue["email"],
        password: fieldsValue["password"]
      };
      this.setState({ loading: true });

      try {
        this.setState({ loading: true });
        let data = await accountService.authenticate(values);
        if (!data.token) return;
        this.props.cookies.set(COOKIES.token, data.token, {
          secure: !ENV.isLocal
        });
        this.setState({ loading: false }, () => {
          window.location.replace("/");
        });
      } catch (err) {
        this.setState({ loading: false }, () => {
          message.error("Error logging in");
        });
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div className="login">
        <Spin indicator={loadingIcon} spinning={loading}>
          <Form className="event-form" onSubmit={this.handleSubmit}>
            <Form.Item className="email" label="Email">
              {getFieldDecorator("email", {
                rules: [{ type: "string", required: true, message: "Required" }]
              })(<Input size="large" />)}
            </Form.Item>
            <Form.Item className="password" label="Password">
              {getFieldDecorator("password", {
                rules: [{ type: "string", required: true, message: "Required" }]
              })(<Input size="large" type="password" />)}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ fontWeight: "bold", width: "100%" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>

      // <Form className={"login"} onSubmit={this.handleSubmit}>
      //   <Form.Field>
      //     <label>Email</label>
      //     <Input
      //       placeholder="Email"
      //       name="email"
      //       value={email}
      //       onChange={this.handleChange}
      //     />
      //   </Form.Field>
      //   <Form.Field>
      //     <label>Password</label>
      //     <Input
      //       placeholder="Password"
      //       type="password"
      //       name="password"
      //       value={password}
      //       onChange={this.handleChange}
      //     />
      //   </Form.Field>
      //   <Button type="submit" fluid primary>
      //     Login
      //   </Button>
      // </Form>
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

const LoginForm = Form.create({ name: "login" })(LoginComponent);

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default Login;
