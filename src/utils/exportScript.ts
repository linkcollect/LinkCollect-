const mongoose = require('mongoose');
const fs = require('fs');

// // Connect to your MongoDB database
// mongoose.connect('mongodb://localhost/your-database-name', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Load your Mongoose models
import { Collection, User, Timeline } from "../models/index";
console.log('Exporting data...');

// Function to export data to JSON file
// const exportDataToJson = async (model, filename) => {
//   try {
//     const options = { bufferTimeoutMS: 30000 }; // 30 seconds timeout
//     const data = await model.find().lean().setOptions(options);
//     fs.writeFileSync(filename, JSON.stringify(data, null, 2));
//     console.log(`Data exported to ${filename}`);
//   } catch (error) {
//     console.error(`Error exporting data: ${error}`);
//   }
// };

const exportDataToJson = async (model, filename) => {
  try {
    const batchSize = 100; // Adjust the batch size as needed
    let skip = 0;
    let allData = [];

    while (true) {
      const data = await model.find().skip(skip).limit(batchSize).lean();
      console.log(`Exported ${data.length} documents`);
      if (data.length === 0) break;

      allData = allData.concat(data);

      skip += batchSize;
    }

    fs.writeFileSync(filename, JSON.stringify(allData, null, 2));
    console.log(`Data exported to ${filename}`);
  } catch (error) {
    console.error(`Error exporting data: ${error}`);
  }
};


// Export users data to users.json
exportDataToJson(User, 'users.json');

// Export collections data to collections.json
exportDataToJson(Collection, 'collections.json');

// Export timelines data to timelines.json
exportDataToJson(Timeline, 'timelines.json');
