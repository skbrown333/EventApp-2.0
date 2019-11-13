import { BaseService } from "../BaseService";
import axios from "../axios.instance";

export default class AccountService extends BaseService {
  route:any;
  
  constructor() {
    let route = "/accounts";
    super(route);
    this.route = route;
    this.authenticateByToken = this.authenticateByToken.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  async authenticate(options: any) {
    let res = await axios.post(this.route + "/login", options);
    return res.data;
  }

  async authenticateByToken(token: any) {
    let res = await axios.post(this.route + "/token", { token: token });
    return res.data;
  }
}
