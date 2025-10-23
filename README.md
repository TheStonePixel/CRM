# CRM
Got it — here’s a README section that focuses entirely on **how to use your code**, exactly as you described:

---

## 💡 You Should Have This

Make sure your Express app already looks something like this:

```js
const express = require('express');
const app = express();
app.use(express.json());

// ... your other middleware and routes

app.listen(3000, () => console.log('Server running'));
```

---

## ➕ Then All You Have To Do Is Add This

Add these few lines **before your `app.listen()`** call:

```js
import mongoose from 'mongoose';
import { CustomerService } from '@thestonepixel/crm';
import CustomerObject from './data/CustomerObject.js';

// Connect to your database
const db = mongoose.createConnection('mongodb://localhost:27017/crm');

// Create the model
const CustomerSchema = new mongoose.Schema(CustomerObject);
const CustomerModel = db.model('Customer', CustomerSchema);

// Initialize and mount the CRM router
const customerService = new CustomerService(db, CustomerModel);
app.use('/customers', customerService.getRouter());
```

That’s it — your app now has a working CRM backend instantly.

---

## ⚙️ Exposed Endpoints

| Method   | Route               | Description                       |
| :------- | :------------------ | :-------------------------------- |
| `POST`   | `/customers`        | Create a new customer             |
| `GET`    | `/customers`        | Test if the service is live       |
| `GET`    | `/customers/:id`    | Get a customer by email           |
| `PUT`    | `/customers/:id`    | Update a customer by ID           |
| `DELETE` | `/customers/:id`    | Delete a customer by ID           |
| `GET`    | `/customers/filter` | Filter customers by tag or status |

---

## 🧠 Extend It

You can easily build custom routes using the same service logic.
For example, to create a **Leads** route:

```js
const leadRouter = express.Router();
app.use('/leads', leadRouter);

leadRouter.get('/', (req, res) => {
  const query = { ...req.query, status: 'lead' };
  customerService.filter({ ...req, query }, res);
});
```

Now `/leads` automatically filters customers with `status=lead`.

This gives you total flexibility — you can combine the CRM router with your own logic, filters, or even attach it to different models.
