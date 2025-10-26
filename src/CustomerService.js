import { Router } from 'express';
import validator from 'validator';

export class CustomerService {
  constructor(db, model) {
    this.db = db;
    this.model = model;
    this.router = Router();
    this._setupRoutes();
  }

  _setupRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/filter', this.filter.bind(this));
    this.router.get('/:id', this.getOne.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.remove.bind(this));
  }

    
    async create(req, res) {
      const data = req.body;
      const email = data.email;

      try {
        const existing = await this.model.findOne({ email });
        if (existing) {
          return res.status(400).json({ error: 'Customer with this email already exists' });
        }

        const customer = await this.model.create(data);
        res.status(201).json(customer);
      } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Failed to create customer' });
      }
    }


      async getAll(req, res) {

        try {
          const customers = await this.model.find({});
          res.json(customers);
        } catch (err) {
          res.status(500).json({ error: 'Failed to retrieve customers' });
        }    
         
    }


    async getOne(req, res) {
    const id = req.params.id;
    try {
        if (!validator.isEmail(id)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        const customer = await this.model.findOne({ email: id });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
            res.json(customer);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve customer' });
        }
    }

    async filter(req, res) {
      const { tag, status } = req.query;
      const query = {};

      if (tag) query.tags = { $in: [tag] }; // handles array fields correctly
      if (status) query.status = status;

      try {
        const results = await this.model.find(query);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Failed to filter customers' });
      }
    }





  async update(req, res) {
    const id = req.params.id;
    const updates = req.body;
    try {
        
        const customer = await this.model.findByIdAndUpdate(id, updates, { new: true });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({customer, updated: true});
    } catch (err) {
        res.status(500).json({ error: 'Failed to update customer' });
    }

  }

  async remove(req, res) {
      const id = req.params.id;
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  }
    

  

  getRouter() {
    return this.router;
  }
}
