# AWS Rekognition Attendance System

This is a simple, file-based Node.js application that uses AWS Rekognition to implement a Face Recognition Attendance System.

## 🛠️ Prerequisites
1. **Node.js** installed on your computer.
2. **AWS Account** with Rekognition access.
3. Access Keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).

## 🚀 Setup Instructions

1. **Install Dependencies:**
   Open your terminal in this folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy the `.env.example` file and rename it to `.env`.
   - Open `.env` and fill in your AWS Keys and preferred AWS Region (e.g., `us-east-1`).

3. **Initialize the Database (Collection):**
   Run this command once to create a secure folder on AWS to store the facial features:
   ```bash
   npm run setup
   ```

## 📸 How to Use

### 1. Register a Person (One-time)
Take a clear picture of a person and save it locally. Then run the register script, providing the image path and the person's name (avoid spaces in names, use underscores).

```bash
npm run register "path/to/clear_photo.jpg" "John_Doe"
```

### 2. Mark Attendance (Daily)
Take a picture of the person trying to log their attendance. Run the attend script:

```bash
npm run attend "path/to/daily_photo.jpg"
```

If a match is found, their name and the exact time will be automatically appended to `attendance_log.csv` in this folder!

## 📂 File Structure
- `src/setup.js` - Creates the AWS Rekognition Collection.
- `src/register.js` - Uploads a face to AWS for future matching.
- `src/attend.js` - Checks an image against stored faces and logs attendance.
- `attendance_log.csv` - Auto-generated file where attendance is recorded.
