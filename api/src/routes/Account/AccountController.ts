import BaseController from '../../base/BaseController';
import Account from '../../models/Account';

class AccountController extends BaseController {
  constructor() {
      let model = Account;
      super({ model });
  }
}

export default new AccountController();