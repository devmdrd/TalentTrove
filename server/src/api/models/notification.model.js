const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['application', 'message', 'other'], default: 'application' },
  referenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
