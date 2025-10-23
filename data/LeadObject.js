//Example
/*
{
    customerId: mongoose.Schema.Types.ObjectId,
    service: 'dtf', // e.g. 'dtf', 'embroidery', 'screen printing', 'laser engraving'
    notes: 'Customer is interested in bulk orders.',
    createdAt: '2024-01-01T12:00:00Z'

}

*/

const LeadObject = {
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  service: { type: 'string', enum: ['dtf', 'embroidery', 'screen printing', 'laser engraving'] },
  notes: { type: 'string' },
  createdAt: { type: 'date', default: () => new Date() },
};

export default LeadObject;