import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    default: 'anonymous',
  },
});

export default mongoose.model('user', UserSchema);
