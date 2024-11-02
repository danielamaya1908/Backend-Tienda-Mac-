const fs = require("fs").promises; 
const { ImageProduct, Image } = require("../db"); 

const migrateImagesInBatches = async (batchSize = 100) => {
  try {
    const oldImages = await Image.findAll();
    const totalImages = oldImages.length;
    
    for (let i = 0; i < totalImages; i += batchSize) {
      const imageBatch = oldImages.slice(i, i + batchSize);
      
      await Promise.all(imageBatch.map(async (oldImage) => {
        try {
          const imageData = await fs.readFile(oldImage.path);
          await ImageProduct.create({
            imageData,
            productId: oldImage.productId,
            itemId: oldImage.itemId,
          });
          console.log(`Migrated image with id ${oldImage.id} to ImageProduct`);
        } catch (error) {
          console.error(`Failed to migrate image with id ${oldImage.id}:`, error.message);
        }
      }));

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(totalImages / batchSize)}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

module.exports = migrateImagesInBatches;
