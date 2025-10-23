const EngagementObject = {
  type: { type: 'string', required: true }, 
  // e.g. 'lead', 'inquiry', 'quote', 'followup', 'complaint'
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
  source: { type: 'string' },  // e.g. 'contact_form', 'phone', 'email'
  data: { type: 'object', default: {} }, // flexible payload for any form fields
  status: { type: 'string', default: 'open' },
  createdAt: { type: 'date', default: () => new Date() },
  updatedAt: { type: 'date', default: () => new Date() },
};

export default EngagementObject;