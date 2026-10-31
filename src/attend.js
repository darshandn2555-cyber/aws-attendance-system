require('dotenv').config();
const { RekognitionClient, SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const client = new RekognitionClient({ region: process.env.AWS_REGION });

// Setup CSV Logging
const csvWriter = createObjectCsvWriter({
    path: 'attendance_log.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'time', title: 'TIMESTAMP'},
        {id: 'confidence', title: 'CONFIDENCE (%)'}
    ],
    append: true // Append to existing file instead of overwriting
});

async function markAttendance(imagePath) {
    try {
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ File not found: ${imagePath}`);
            process.exit(1);
        }

        const imageBytes = fs.readFileSync(imagePath);
        
        console.log("Analyzing face against the database...");
        const command = new SearchFacesByImageCommand({
            CollectionId: process.env.REKOGNITION_COLLECTION_ID,
            Image: { Bytes: imageBytes },
            FaceMatchThreshold: 90, // Minimum 90% confidence required
            MaxFaces: 1
        });
        
        const response = await client.send(command);
        
        if (response.FaceMatches && response.FaceMatches.length > 0) {
            const match = response.FaceMatches[0];
            const name = match.Face.ExternalImageId;
            const confidence = match.Similarity.toFixed(2);
            const timestamp = new Date().toLocaleString();
            
            console.log(`\n🎉 Match Found!`);
            console.log(`Person: ${name}`);
            console.log(`Confidence: ${confidence}%`);
            
            // Log to CSV
            await csvWriter.writeRecords([{ name, time: timestamp, confidence }]);
            console.log(`✅ Attendance successfully logged to attendance_log.csv at ${timestamp}\n`);
        } else {
            console.log("\n❌ No match found in the database. Unknown person.\n");
        }
    } catch (error) {
        console.error("❌ Error checking attendance:", error.message);
    }
}

const imageFile = process.argv[2];

if (!imageFile) {
    console.log("Usage: npm run attend <path_to_image>");
    console.log("Example: npm run attend ./photos/today_class.jpg");
    process.exit(1);
}

markAttendance(imageFile);
