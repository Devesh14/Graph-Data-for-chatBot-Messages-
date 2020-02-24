import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  _id: String,
  createdAt: {
    type: Date,
    index: true
  },
  sender: {
    type: String,
    default: '',
    index: true
  }
});

export default mongoose.model('chatLog', schema);