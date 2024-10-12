import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface User {
  name: string;
  descriptor: Float32Array;
}

const FaceRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState('');
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);  // Loader state
  const [error, setError] = useState<string | null>(null);  // Validation state

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
      loadUsersFromLocalStorage(); // Load users from local storage on mount
    }
  }, [modelsLoaded]);

  const loadUsersFromLocalStorage = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      
      // Convert descriptors back to Float32Array
      const formattedUsers = parsedUsers.map((user: any) => ({
        name: user.name,
        descriptor: new Float32Array(Object.values(user.descriptor))
      }));

      setUsers(formattedUsers);
    }
  };

  const handleRegister = async () => {
    if (!videoRef.current) return;

    // Validation: Check if a name is provided
    if (userName.trim() === '') {
      setError('Name is required to register a face.');
      return;
    }
    
    setLoading(true);  // Show loader
    setError(null);  // Reset errors

    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection && detection.descriptor) {
      const newUser: User = { name: userName, descriptor: detection.descriptor };
      const updatedUsers = [...users, newUser];

      // Save to local storage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setUserName(''); // Clear input after registration
    }

    setLoading(false);  // Hide loader
  };

  const handleFindName = async () => {
    if (!videoRef.current || users.length === 0) return;

    setLoading(true);  // Show loader
    setDetectedName(null);  // Reset detected name

    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection && detection.descriptor) {
      const labeledDescriptors = users.map(user => new faceapi.LabeledFaceDescriptors(user.name, [user.descriptor]));
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
      const match = faceMatcher.findBestMatch(detection.descriptor);

      setDetectedName(match.toString() === 'unknown' ? null : match.toString());
    }

    setLoading(false);  // Hide loader
  };

  return (
    <div>
      <h1>Face Recognition App</h1>
      <video ref={videoRef} width="720" height="560" autoPlay muted />
      
      <div>
        <input 
          type="text" 
          value={userName} 
          onChange={e => setUserName(e.target.value)} 
          placeholder="Enter your name" 
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register Face'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show validation error */}
      </div>
      
      <button onClick={handleFindName} disabled={loading}>
        {loading ? 'Detecting...' : 'Find My Name'}
      </button>
      
      {loading && <p>Loading...</p>} {/* Loader while processing */}
      
      {detectedName && <h2>Detected Name: {detectedName}</h2>}
      {detectedName === null && !loading && <h2>No match found.</h2>}
    </div>
  );
};

export default FaceRecognition;
