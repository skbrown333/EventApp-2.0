import * as React from "react";
import { connect } from "react-redux";

/* UI */
import { Button, Form, Input, Icon, Modal } from "semantic-ui-react";
import { InputLocation } from "../Input/InputLocation/InputLocation";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import Dropzone from "react-dropzone";
import Cropper from "react-easy-crop";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
/* Services */
/* Store */
/* Styles */
import "./_create-event.scss";

interface State {
  readonly email: string;
  readonly password: string;
  readonly image: any;
  readonly crop: any;
  readonly imageHeight: number;
}

export class CreateEventComponent extends React.Component<any, State> {
  readonly state: State;
  dropzoneRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: "",
      image: null,
      imageHeight: 0,
      crop: {
        unit: "%",
        aspect: 16 / 9,
        height: "100"
      }
    };

    this.dropzoneRef = React.createRef();
  }

  componentDidMount = () => {
    let node = this.dropzoneRef.current;
    if (node) {
      let height = (node.getBoundingClientRect().width / 16) * 9;
      this.setState({ imageHeight: height });
    }
  };

  //@ts-ignore
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {};

  onCropChange = crop => {
    this.setState({ crop });
  };

  render() {
    const { email, password, image, crop, imageHeight } = this.state;
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
            <section
              className="dropzone-container"
              id="dropzone"
              ref={this.dropzoneRef}
            >
              <div
                className="dropzone"
                {...getRootProps()}
                style={{
                  height: imageHeight
                }}
              >
                <input disabled={!!image} {...getInputProps()} />
                {!image ? (
                  <Icon
                    size="massive"
                    style={{ color: "#d8d8d8" }}
                    name="image outline"
                  />
                ) : null}
                {image ? (
                  // <img
                  //   src={image}
                  //   alt=""
                  //   style={{
                  //     width: "100%",
                  //     height: "100%",
                  //     objectFit: "cover"
                  //   }}
                  // />
                  <ReactCrop
                    src={image}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={() => {}}
                    onComplete={c => {}}
                    onChange={this.onCropChange}
                    imageStyle={{
                      width: this.dropzoneRef.current.getBoundingClientRect()
                        .width,
                      height: this.dropzoneRef.current.getBoundingClientRect()
                        .height,
                      objectFit: "contain"
                    }}
                  />
                ) : null}
              </div>
            </section>
          )}
        </Dropzone>
        {this.dropzoneRef ? (
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
        ) : null}
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

const mapDispatchToProps = (dispatch: any) => ({});

export const CreateEvent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEventComponent);

export default CreateEvent;
