const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    placesToVisit: { type: [String], default: [] },
    status: { type: String, enum: ['planned', 'ongoing', 'completed'], default: 'planned' },
    coverColor: { type: String, default: '#0ea5e9' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
