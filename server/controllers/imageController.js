
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// Cloudinary configuration
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

// Function to download image
const downloadImage = async (url, savePath) => {
  try {
    const response = await axios({ url, responseType: 'stream' });
    await pipeline(response.data, fs.createWriteStream(savePath));
    console.log(`Image successfully downloaded and saved to ${savePath}`);
  } catch (error) {
    console.error(`Failed to download image. Error: ${error.message}`);
    throw error;
  }
};

// Function to upload and transform image
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

// Endpoint to process images
exports.processImages = async (req, res) => {
  const { images } = req.body; // Expecting an array of { imageName, imageUrl }

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  try {
    const results = [];

    for (const { imageName, imageUrl } of images) {
      const filePath = path.join(__dirname, 'temp', `${imageName}.jpg`);
      await downloadImage(imageUrl, filePath);

      const quantity = 56; // Modify as needed or get from request
      const transformedUrl = await uploadAndTransformImage(filePath, quantity);

      results.push({ imageName, transformedUrl });
      fs.unlinkSync(filePath); // Clean up temp file
    }

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: "Failed to process images", error: error.message });
  }
};
