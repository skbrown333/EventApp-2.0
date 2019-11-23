import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

/* UI */
import { Button, Form, Icon } from "semantic-ui-react";
import { InputLocation } from "../Input/InputLocation/InputLocation";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { TimePicker, Input, DatePicker, message } from "antd";
/* Services */
import EventService from "../../services/EventService/event.service";
/* Store */
import { addEvent } from "../../store/actions";

/* Styles */
import "./_create-event.scss";
import { labeledStatement } from "@babel/types";

const eventService = new EventService();

interface State {
  title: string;
  date: moment.Moment;
  startTime: string;
  endTime: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  image: any;
  crop: any;
  imageHeight: number;
}

export class CreateEventComponent extends React.Component<any, State> {
  readonly state: State;
  dropzoneRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      title: "",
      date: null,
      startTime: "",
      endTime: "",
      address: "",
      lat: null,
      lng: null,
      description: null,
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

  handleChange = (e, { name, value }) => {
    //@ts-ignore
    this.setState({ [name]: value });
  };

  handleLocation = data => {
    if (!data) return;
    const { lat, lng } = data;
    this.setState({ lat, lng });
  };

  handleSubmit = async () => {
    const {
      title,
      description,
      startTime,
      endTime,
      date,
      lat,
      lng
    } = this.state;
    try {
      let body = {
        cre_account: "5b59e45526bbe3154f60e53c",
        cre_date: new Date(),
        title,
        lat,
        lng,
        start_time: startTime,
        end_time: endTime,
        description,
        date
      };

      let event = await eventService.create(body);
      this.props.addEvent(event);
      message.success(`Event Created: ${event.title}`);
    } catch (e) {
      message.error(`Error Creating Event`);
    }
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  onDrop = acceptedFiles => {
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
                width: this.dropzoneRef.current.getBoundingClientRect().width,
                height: this.dropzoneRef.current.getBoundingClientRect().height,
                objectFit: "contain"
              }}
            />
          ) : (
            <Icon
              size="massive"
              style={{ color: "#d8d8d8" }}
              name="image outline"
            />
          )}
        </div>
      </section>
    );
  };

  render() {
    const { title, description, startTime, endTime } = this.state;
    return (
      <div className="create-event">
        <Form className="event-form" onSubmit={this.handleSubmit}>
          <Form.Field className="container">
            <label>Title</label>
            <Input
              data-lpignore="true"
              value={title}
              onChange={e => this.setState({ title: e.target.value })}
            />
          </Form.Field>
          <Dropzone onDrop={this.onDrop}>{this.renderDropZone}</Dropzone>

          <Form.Field className="container">
            <label>Date</label>
            <DatePicker
              onChange={(date: moment.Moment) => {
                this.setState({ date });
              }}
            />
          </Form.Field>
          <Form.Field className="container">
            <label>Start Time</label>
            <TimePicker
              inputReadOnly
              onChange={(e, time) => {
                this.setState({ startTime: time });
              }}
              format={"HH:mm"}
              defaultOpenValue={moment("00:00", "HH:mm")}
            />
          </Form.Field>
          <Form.Field className="container">
            <label>End Time</label>
            <TimePicker
              inputReadOnly
              onChange={(e, time) => {
                this.setState({ endTime: time });
              }}
              format={"HH:mm"}
              defaultOpenValue={moment("00:00", "HH:mm")}
            />
          </Form.Field>
          <Form.Field className="container location">
            <label>Location</label>
            <InputLocation onChange={this.handleLocation} />
          </Form.Field>
          <Form.Field className="container location">
            <label>Description</label>
            <textarea name="description" />
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

export default CreateEvent;
