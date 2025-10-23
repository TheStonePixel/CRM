import express from 'express';
import { CustomerService } from '../src/CustomerService.js';
import CustomerObject  from '../data/CustomerObject.js';
import mongoose from 'mongoose';


// Clear test database before running tests


const app = express();
app.use(express.json());

const db = mongoose.createConnection('mongodb://localhost:27017/crm_test');


const CustomerSchema = new mongoose.Schema(CustomerObject);
const CustomerModel = db.model('Customer', CustomerSchema);
const customerService = new CustomerService(db, CustomerModel);

app.use('/customers', customerService.getRouter());

const leadRouter = express.Router();

app.use('/leads', leadRouter);
leadRouter.get('/', (req, res) => {
  const query = { ...req.query, status: 'lead' }; // enforce lead status
  customerService.filter({ ...req, query }, res);
});


function test(name, fn) {
  process.stdout.write(`${name.slice(0,32).padEnd(40)} `);
  return fn()
    .then(() => console.log('\x1b[32m✓ Passed\x1b[0m'))
    .catch(err => console.log('\x1b[31m✗ Failed\x1b[0m', err.message));
}


function divider(label = '', char = '=') {
  const width = 50;
  const amount = label.length ? Math.max((width - label.length - 2) / 2, 0) : width / 2;
  const blue = '\x1b[34m';
  const reset = '\x1b[0m';

  console.log(`\n${blue}${char.repeat(amount)} ${label} ${char.repeat(amount)}${reset}\n`);
}



async function contactFormTest() {
    const testCustomer = {
        firstName: 'Jack',
        lastName: 'Black',
        email: 'jackblack@email.com',
        phone: '123-555-9999',
        newsletter: true,
        status: 'lead',
        notes: ['This is a test customer created during testing.', 
                'Interested in embroidery services.'
        ]
    };

    try {
        const response = await fetch('http://localhost:3001/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCustomer)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error creating test customer:', error);

    }
}

async function newsletterSignupTest() {
    const testCustomer = {
        email: 'newsletter@email.com',
        newsletter: true,
        status: 'lead',
    };
    
    try {  
        const response = await fetch('http://localhost:3001/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCustomer)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error creating newsletter signup customer:', error);

    }
}

async function insertAddressesTest() {
    // find a customer with email
    const email = 'jackblack@email.com';
    try {
        const response = await fetch(`http://localhost:3001/customers/${email}`);
        const customer = await response.json();
        if (!customer || !customer._id) {
            console.log('\x1b[31m%s\x1b[0m', 'Insert Addresses Test Failed - Customer not found'); // Red text
            return;
        }
        const customerId = customer._id;
        
        // update customer with addresses
        const addresses = [
            { type: 'shipping', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
            { type: 'billing', street: '456 Oak St', city: 'Othertown', state: 'NY', zip: '67890' }
        ];
        
        const updateResponse = await fetch(`http://localhost:3001/customers/${customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses })
        });
        const updatedCustomer = await updateResponse.json();
    } catch (error) {
        console.error('Error during Insert Addresses Test:', error);
    }
}

//Create Customer Test
async function createTestCustomer() {
    const testCustomer = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@email.com',
        phone: '555-0000',
        newsletter: true,
        addresses: [
            { type: 'shipping', street: '456 Test St', city: 'Testville', state: 'TX', zip: '67890' }
        ],
        tags: ['test', 'automation'],
        status: 'lead',
        notes: 'This is a test customer created during testing.'
    };

    try {
        const response = await fetch('http://localhost:3001/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCustomer)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error creating test customer:', error);

    }
}


async function runTests() {
    await db.dropDatabase();
    divider('Starting Tests - Clearing Test Database', '-');
    await test('Contact Form Submission Test', contactFormTest);
    await test('Newsletter Signup Test', newsletterSignupTest);
    await test('Insert Addresses Test', insertAddressesTest);
    await test('Create Test Customer', createTestCustomer);
    divider('All Tests Completed', '=');

}

runTests();


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});