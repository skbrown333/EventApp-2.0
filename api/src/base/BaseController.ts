export default class BaseController {
    model: any;

    constructor(options) {
      if (!options || !options.model) throw new Error("Must Pass Options");
      this.model = options.model;
    }
  
    create = async (req, res) => {
      let body = req.body;
      try {
        let model = await this.model.create(body);
        return res.status(200).json({ model: model });
      } catch (err) {
        throw err;
      }
    }
  }
  
  module.exports = BaseController;
  