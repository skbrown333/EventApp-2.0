import axios from "./axios.instance";

export class BaseService {
  route: string;

  constructor(route: string) {
    this.route = route;
  }

  async get(params) {
    let res = await axios.get(this.route, params);
    return res.data;
  }

  async getById(accountID) {
    let res = await axios.get(this.route + "/" + accountID);
    return res.data;
  }

  async create(params) {
    let res = await axios.post(this.route + "/create", params);
    return res.data.model;
  }
}
