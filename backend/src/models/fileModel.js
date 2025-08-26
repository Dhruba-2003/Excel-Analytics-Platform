import mongoose from 'mongoose';

// NEW: Schema for individual analysis settings
const analysisSchema = mongoose.Schema({
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
});

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: {
      type: String,
      required: true,
    },
    data: [ { type: Object } ],
    headers: [ { type: String } ],
    // NEW: Array to store analysis history
    analyses: [analysisSchema],
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model('File', fileSchema);
export default File;