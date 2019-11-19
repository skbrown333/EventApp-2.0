import * as React from "react";
import { connect } from "react-redux";

/* UI */
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { InputLocation } from "../Input/InputLocation/InputLocation";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import Dropzone from "react-dropzone";
/* Services */
/* Store */
/* Styles */
import "./_create-event.scss";


interface State {
  readonly email: string;
  readonly password: string;
  readonly image: any;
}

export class CreateEventComponent extends React.Component<any, State> {
  readonly state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: "",
      image: null
    };
  }

  //@ts-ignore
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {

  };

  render() {
    const { email, password, image } = this.state;
    return (
        <div className="create-event">
            <Dropzone
              onDrop={acceptedFiles => {
                const reader = new FileReader();

                reader.onabort = () => console.log("file reading was aborted");
                reader.onerror = () => console.log("file reading has failed");
                reader.onload = () => {
                  // Do whatever you want with the file contents
                  let image = reader.result;
                  this.setState({ image });
                };
                reader.readAsDataURL(acceptedFiles[0]);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone-container">
                  <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!image ? (
                      <Icon
                        size="massive"
                        style={{ color: "#d8d8d8" }}
                        name="image outline"
                      />
                    ) : null}
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: 'cover' }}
                      />
                    ) : null}
                  </div>
                </section>
              )}
            </Dropzone>
            <Form className="event-form">
              <Form.Field className="container">
                <label>Title</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container">
                <label>Date</label>
                <SemanticDatepicker />
              </Form.Field>
              <Form.Field className="container">
                <label>Start Time</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container">
                <label>End Time</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container location">
                <label>Location</label>
                <InputLocation onChange={() => {}} />
              </Form.Field>
              <Form.Field className="container location">
                <label>Description</label>
                <textarea />
              </Form.Field>
              <Button className="submit-event" type="submit" fluid primary>
                Submit
              </Button>
            </Form>
        </div>
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
});

export const CreateEvent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEventComponent);

export default CreateEvent;
