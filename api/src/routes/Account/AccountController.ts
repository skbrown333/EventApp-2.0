import BaseController from '../../base/BaseController';
import Account from '../../models/Account';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getCleanAccount, generateToken } from "../../utils/utils";

const JWT_SECRET = process.env.JWT_SECRET;

class AccountController extends BaseController {
  constructor() {
      let model = Account;
      super({ model });
  }

  async create(req, res, next) {
    let body = req.body;
    if (!body.password) {
      let error:any = new Error("Password is required");
      error.httpStatusCode = 400;
      return next(error);
    }

    body.hash = bcrypt.hashSync(body.password.trim(), 10);
    body.cre_date = new Date().getTime();
    let account = await Account.create(body);
    res.status(200).json({
      account: getCleanAccount(account),
      token: generateToken(account)
    });
  }

  async get(req, res, next) {
    let models:any = await Account.find({});
    models = models.map( m => {
      return getCleanAccount(m);
    })
    return res.status(200).send(models);
  }

  async authorize(req, res, next) {
    let body = req.body;
    if (!body.email) {
      let error:any = new Error("Email is required");
      error.httpStatusCode = 400;
      return next(error);
    }

    let options = { email: body.email };
    let account:any = await Account.findOne(options);

    bcrypt.compare(body.password, account.hash, function(err, valid) {
      if (!valid) {
        let error:any = new Error("Username or Password is Wrong");
        error.httpStatusCode = 400;
        return next(error);
      }

      res.json({
        account: getCleanAccount(account),
        token: generateToken(account)
      });
    });
  }

  async getFromToken(req, res, next) {
    let token = req.body.token;
    if (!token) {
      let error:any = new Error("Token is required");
      error.httpStatusCode = 400;
      return next(error);
    }

    let account = await jwt.verify(token, JWT_SECRET);
    account = await Account.findById(account._id);
    res.json({
      account: getCleanAccount(account),
      token: generateToken(account)
    });
  }
}

export default new AccountController();