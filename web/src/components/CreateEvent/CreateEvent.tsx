import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

/* UI */
import { InputLocation } from "../Input/InputLocation/InputLocation";
import Dropzone from "react-dropzone";
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

/* Services */
import EventService from "../../services/EventService/event.service";
import S3Service from "../../services/s3.service";

/* Store */
import { addEvent } from "../../store/actions";

/* Styles */
import "./_create-event.scss";

const eventService = new EventService();
const s3Service = new S3Service();
const { TextArea } = Input;

interface State {
  image: any;
  file: any;
  loading: boolean;
  imageHeight: number;
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
      imageHeight: 0
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
    const { account } = this.props;

    this.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      } else if (!file) {
        message.error("Image required");
        return;
      }

      const values = {
        cre_account: account._id,
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
        let key = `${event._id}.png`;
        let path = `users/${account._id}/events/${event._id}`;
        s3Service.uploadPhoto(key, file, path, err => {
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
    const { image, imageHeight } = this.state;
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
          <input {...getInputProps()} />

          {image ? (
            <img
              src={image}
              style={{
                width:
                  this.dropzoneRef.current.getBoundingClientRect().width - 4,
                height:
                  this.dropzoneRef.current.getBoundingClientRect().height - 4,
                objectFit: "cover"
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
            <Form.Item label="Date">
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
            <Form.Item className="location" label="Details">
              {getFieldDecorator("details", {
                rules: [{}]
              })(<TextArea autoSize={{ minRows: 5 }} />)}
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
