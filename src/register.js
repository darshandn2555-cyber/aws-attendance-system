require('dotenv').config();
const { RekognitionClient, IndexFacesCommand } = require("@aws-sdk/client-rekognition");
const fs = require('fs');

const client = new RekognitionClient({ region: process.env.AWS_REGION });

async function registerFace(imagePath, personName) {
    try {
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ File not found: ${imagePath}`);
            process.exit(1);
        }

        const imageBytes = fs.readFileSync(imagePath);
        
        console.log(`Processing image for ${personName}...`);
        const command = new IndexFacesCommand({
            CollectionId: process.env.REKOGNITION_COLLECTION_ID,
            Image: { Bytes: imageBytes },
            ExternalImageId: personName.replace(/[^a-zA-Z0-9_.\-:]/g, '_'), // AWS requires specific characters
            DetectionAttributes: ["DEFAULT"]
        });
        
        const response = await client.send(command);
        
        if (response.FaceRecords && response.FaceRecords.length > 0) {
            console.log(`✅ Successfully registered: ${personName}`);
            console.log(`FaceId: ${response.FaceRecords[0].Face.FaceId}`);
        } else {
            console.log("⚠️ No faces detected in the image. Please try a clearer photo.");
        }
    } catch (error) {
        console.error("❌ Error registering face:", error.message);
    }
}

const imageFile = process.argv[2];
const personName = process.argv[3];

if (!imageFile || !personName) {
    console.log("Usage: npm run register <path_to_image> <person_name>");
    console.log("Example: npm run register ./photos/john_doe.jpg John_Doe");
    process.exit(1);
}

registerFace(imageFile, personName);
