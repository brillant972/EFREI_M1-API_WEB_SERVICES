import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
}, {
  collection: 'albums',
  minimize: false,
  versionKey: false
});

export default AlbumSchema;
