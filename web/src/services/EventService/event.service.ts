import { BaseService } from "../BaseService";

export default class EventService extends BaseService {
  route:any;
  
  constructor() {
    let route = "/events";
    super(route);
    this.route = route;
  }
}
