
# Face Recognition React App


This is a React and TypeScript-based face recognition application using the `face-api.js` library. Users can register their faces with a name and later be identified by face recognition.


## Features

- Face Registration: Register a user's face with a name using `face-api.js`.
- Face Recognition: Detect a user's face and match it with the previously registered faces.
- Loader: Shows a loading state during face detection and registration.
- Form Validation: Validates the user name before registering the face.
- Local Storage: Stores registered users' face descriptors in the browser's local storage.


## Installation

Clone the repository

```bash
git clone https://github.com/your-username/face-recognition-app.git
cd face-recognition-app
```
Install dependencies
```bash
npm install
```
Download face-api.js models
```bash
# Go to the public folder in your project
cd public

# Download the models from face-api.js repository
mkdir models
cd models

# Download models
wget https://github.com/justadudewhohacks/face-api.js-models/raw/master/tiny_face_detector_model-weights_manifest.json
wget https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_landmark_68_model-weights_manifest.json
wget https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_recognition_model-weights_manifest.json
```
Run the app
```bash
npm start
```
The app should now be running on http://localhost:3000.

## Usage

#### Register a Face

1. Enter your name in the input field.
2. Click Register Face while your face is visible on the webcam. The face will be registered with your name and saved in local storage.

#### Detect a Face

1. Click Find My Name. The app will detect your face and try to match it with any previously registered faces.
2. If a match is found, the app will display your name. If no match is found, it will show "No match found."

#### Project Structure

- `src/FaceRecognition.tsx`: The main component handling face registration and recognition.
- `public/models/`: Pre-trained models for face detection and recognition.

#### Dependencies

- `react`: Frontend framework.
- `typescript`: Type checking for the application.
- `face-api.js`: Face detection and recognition library.

#### Validations and Error Handling

- The app ensures that users provide a name before registering their face.
- While face detection or registration is in progress, a loader is displayed, and buttons are disabled to prevent multiple clicks.

