import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true }
}, {
  collection: 'photos',
  minimize: false,
  versionKey: false
});

export default PhotoSchema;
