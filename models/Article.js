import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  user: {
    type: String,
    default: 'anonymous',
  },
  name: {
    type: String,
  },
  content: [
    {
      type: String,
    },
  ],
  title: {
    type: String,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  comments: [
    { user: { type: String, default: 'anonymous' }, text: { type: String } },
  ],
});

ArticleSchema.index({ name: 1 });
export default mongoose.model('article', ArticleSchema);
