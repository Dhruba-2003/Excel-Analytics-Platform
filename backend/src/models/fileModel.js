import mongoose from 'mongoose';

// Schema for an individual, named analysis
const analysisSchema = mongoose.Schema({
  name: { type: String, required: true }, // The custom name for the analysis
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
    // Renamed to 'savedAnalyses' for clarity
    savedAnalyses: [analysisSchema], 
  },
  {
    timestamps: true,
  }
);

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;