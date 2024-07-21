require('dotenv').config(); 
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const XLSX = require("xlsx");
const { Readable } = require("stream");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//download image
const downloadImage = async (url, savePath) => {
  try {
    const response = await axios({ url, responseType: 'stream' });
    await pipeline(response.data, fs.createWriteStream(savePath));
    console.log(`Image successfully downloaded and saved to ${savePath}`);
  } catch (error) {
    console.error(`Failed to download image. URL: ${url}, Path: ${savePath}, Error: ${error.message}`);
    throw error;
  }
};

//upload and transform image
const uploadAndTransformImage = async (filePath, quantity) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      transformation: [
        { background: "#FFFFFF", gravity: "center", height: 700, width: 1370, crop: "pad" },
        { color: "#FFFFFF", overlay: { font_family: "georgia", font_size: 71, font_weight: "bold", text_align: "left", text: `X${quantity}` } },
        { background: "#00350C" },
        { flags: "layer_apply", gravity: "east", x: "0.2" }
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload and transform image. Error: ${error.message}`);
    throw error;
  }
};

//generate Excel file to download
const generateExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Processed Images");
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  return buffer;
};

// Endpoint to process images
exports.processImages = async (req, res) => {
  console.log('Request body:', req.body);

  const { images } = req.body;

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  try {
    const results = [];

    for (const image of images) {
      const imageName = image['Image Name'];
      const imageUrl = image['Image Url'];

      console.log(`Processing image: ${imageName}, URL: ${imageUrl}`);
      if (!imageName || !imageUrl) {
        console.error(`Invalid image data: ${JSON.stringify(image)}`);
        continue; 
      }

      const filePath = path.join(__dirname, 'temp', `${imageName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`);
      await downloadImage(imageUrl, filePath);

      const quantity = 56; 
      const transformedUrl = await uploadAndTransformImage(filePath, quantity);

      results.push({ imageName, transformedUrl });
      fs.unlinkSync(filePath); 
    }

    // Log results to verify
    console.log('Results:', results);

    res.status(200).json({ results });
  } catch (error) {
    console.error(`Failed to process images: ${error.message}`);
    res.status(500).json({ message: "Failed to process images", error: error.message });
  }
};
