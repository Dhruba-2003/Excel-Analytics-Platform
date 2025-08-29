import mongoose from 'mongoose';

const analysisSchema = mongoose.Schema({
  name: { type: String, required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
}, { timestamps: true });

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: { type: String, required: true },
    data: [ { type: Object } ],
    headers: [ { type: String } ],
    savedAnalyses: [analysisSchema], 
  },
  {
    timestamps: true,
  }
);

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;