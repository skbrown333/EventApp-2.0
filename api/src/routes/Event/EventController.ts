import BaseController from '../../base/BaseController';
import Event from '../../models/Event';

class EventController extends BaseController {
  constructor() {
      let model = Event;
      super({ model });
  }
}

export default new EventController();