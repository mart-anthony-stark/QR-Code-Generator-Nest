import * as mongoose from 'mongoose';

export const QRSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    value: {
      type: String,
      required: [true, 'Value is required'],
    },
  },
  { timestamps: true },
);
