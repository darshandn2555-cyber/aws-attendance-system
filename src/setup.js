require('dotenv').config();
const { RekognitionClient, CreateCollectionCommand } = require("@aws-sdk/client-rekognition");

const client = new RekognitionClient({ region: process.env.AWS_REGION });

async function createCollection() {
    try {
        const command = new CreateCollectionCommand({
            CollectionId: process.env.REKOGNITION_COLLECTION_ID
        });
        const response = await client.send(command);
        console.log("✅ Collection created successfully!");
        console.log("Collection ARN:", response.CollectionArn);
    } catch (error) {
        if (error.name === 'ResourceAlreadyExistsException') {
            console.log("⚠️ Collection already exists. You are good to go.");
        } else {
            console.error("❌ Error creating collection:", error.message);
        }
    }
}

createCollection();
