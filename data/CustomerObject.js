// data/CustomerObject.js
import validator from 'validator';

//example data
/*
{
    customerId: 'cust_12345',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    phone: '555-1234',
    newsletter: true,
    addresses: [
        { type: 'shipping', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' }
    ],
    tags: ['lead', 'vip'],
    status: 'lead',
    engagements: [],
    notes: 'Interested in bulk orders.',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-02T12:00:00Z'

}
*/

const CustomerObject = {
  firstName: { type: 'string', default: '' },
  lastName: { type: 'string', default: '' },
  email: {
    type: 'string',
    required: true,
    validate: (val) => validator.isEmail(val),
  },
phone: {
  type: 'string',
  validate: (val) => !val || validator.isMobilePhone(val.replace(/[^0-9+]/g, ''), 'any'),
},
  newsletter: { type: 'boolean', default: false },
  addresses: {
    type: 'array',
    default: [], // [{ type: 'shipping', street: '', city: '', state: '', zip: '' }]
  },
  tags: {
    type: 'array',
    default: [],
  },
  status: {
    type: 'string',
    enum: ['lead', 'customer', 'inactive', 'membership', 'vip'],
    default: 'lead',
  },
  engagements: {
    type: 'array',
    default: [],
  },
  notes: {
    type: 'array',
    default: [],
  },
  createdAt: { type: 'date', default: () => new Date() },
  updatedAt: { type: 'date', default: () => new Date() },
};

export default CustomerObject;

