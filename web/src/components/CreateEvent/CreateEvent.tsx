import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import AWS from "aws-sdk";

/* UI */
import {} from "semantic-ui-react";
import { InputLocation } from "../Input/InputLocation/InputLocation";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Form,
  Icon,
  Button,
  TimePicker,
  Input,
  DatePicker,
  message,
  Spin
} from "antd";

import { Editor, EditorState, RichUtils } from "draft-js";
/* Services */
import EventService from "../../services/EventService/event.service";
/* Store */
import { addEvent } from "../../store/actions";

/* Styles */
import "./_create-event.scss";
import { labeledStatement } from "@babel/types";

const eventService = new EventService();

interface State {
  image: any;
  file: any;
  loading: boolean;
  crop: any;
  imageHeight: number;
  editorState: any;
}

export class CreateEventComponent extends React.Component<any, State> {
  readonly state: State;
  dropzoneRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      image: null,
      file: null,
      loading: false,
      imageHeight: 0,
      crop: {
        unit: "%",
        aspect: 16 / 9,
        height: "100"
      },
      editorState: EditorState.createEmpty()
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

  handleSubmit = e => {
    e.preventDefault();
    const { file } = this.state;

    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }

      if (!file) {
        message.error("Image required");
        return;
      }

      const values = {
        cre_account: "5b59e45526bbe3154f60e53c",
        cre_date: new Date(),
        title: fieldsValue["title"],
        date: fieldsValue["date"],
        start_time: fieldsValue["start_time"],
        end_time: fieldsValue["end_time"],
        lat: fieldsValue["location"].lat,
        lng: fieldsValue["location"].lng,
        address: fieldsValue["location"].address
      };
      this.setState({ loading: true });
      try {
        let event = await eventService.create(values);
        this.props.addEvent(event);

        // Upload to S3
        AWS.config.update({
          region: "us-east-1",
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-east-1:9a6b4509-7fcf-4576-970a-ea1b0b121626"
          })
        });
        const S3 = new AWS.S3();
        const objParams = {
          Bucket: `photos.priestly.app/users/5b59e45526bbe3154f60e53c/events/${event._id}`,
          Key: `${event._id}.png`,
          Body: file,
          ACL: "public-read",
          ContentType: file.type // TODO: You should set content-type because AWS SDK will not automatically set file MIME
        };
        S3.putObject(objParams, err => {
          if (err) {
            message.error(err.message);
            return;
          }
          // Reset fields
          this.props.form.resetFields();
          document.getElementById("location-input").click();
          this.setState({ loading: false, image: null, file: null });

          let url = `/?lat=${event.lat}&lng=${event.lng}&zoom=13`;
          message.success(
            <div>
              <p>
                Event Created: <a href={url}>{event.title}</a>
              </p>
            </div>
          );
        });
      } catch (e) {
        this.setState({ loading: false });
        message.error(`Error Creating Event`);
      }
    });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  onDrop = acceptedFiles => {
    this.setState({ file: acceptedFiles[0] });
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      let image = reader.result;
      this.setState({ image });
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  renderDropZone = ({ getRootProps, getInputProps }) => {
    const { image, crop, imageHeight } = this.state;
    return (
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

          {image ? (
            <ReactCrop
              src={image}
              crop={crop}
              ruleOfThirds
              onImageLoaded={() => {}}
              onComplete={c => {}}
              onChange={this.onCropChange}
              imageStyle={{
                width: this.dropzoneRef.current.getBoundingClientRect().width,
                height: this.dropzoneRef.current.getBoundingClientRect().height,
                objectFit: "contain"
              }}
            />
          ) : (
            <Icon type="picture" className="dropzone__icon" theme="filled" />
          )}
        </div>
      </section>
    );
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const date = moment(new Date());
    const defaultStart = date.add(30 - (date.minute() % 30), "minutes");
    const defaultEnd = moment(date).add(1, "hour");
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div className="create-event">
        <Spin indicator={loadingIcon} spinning={loading}>
          <Form className="event-form" onSubmit={this.handleSubmit}>
            <Dropzone onDrop={this.onDrop}>{this.renderDropZone}</Dropzone>
            <Form.Item className="title" label="Title">
              {getFieldDecorator("title", {
                rules: [
                  { type: "string", required: true, message: "Enter a title" }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="DatePicker">
              {getFieldDecorator("date", {
                initialValue: date,
                rules: [
                  { type: "object", required: true, message: "Select a date" }
                ]
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item className="container" label="Start Time">
              {getFieldDecorator("start_time", {
                initialValue: defaultStart,
                rules: [
                  { type: "object", required: true, message: "Select a time" }
                ]
              })(
                <TimePicker
                  use12Hours={true}
                  minuteStep={15}
                  format={"h:mm A"}
                  inputReadOnly
                />
              )}
            </Form.Item>
            <Form.Item className="container" label="End Time">
              {getFieldDecorator("end_time", {
                initialValue: defaultEnd,
                rules: [
                  { type: "object", required: true, message: "Select a time" }
                ]
              })(
                <TimePicker
                  use12Hours={true}
                  minuteStep={15}
                  format={"h:mm A"}
                  inputReadOnly
                />
              )}
            </Form.Item>
            <Form.Item className="location" label="Location">
              {getFieldDecorator("location", {
                rules: [
                  {
                    required: true,
                    type: "object",
                    message: "Select a location"
                  }
                ]
              })(<InputLocation />)}
            </Form.Item>
            <Form.Item>
              <Button className="submit-event" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    state: state,
    account: state.account,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addEvent: (event: any) => dispatch(addEvent(event))
});

export const CreateEvent = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateEventComponent));

export default Form.create({ name: "create_event" })(CreateEvent);
