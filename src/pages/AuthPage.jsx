// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useNotification } from '../contexts/NotificationContext';

const AuthPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { notifyError } = useNotification();

  const handleAuthAction = async () => {
    setError('');
    if (isRegisterMode) {
      if (!name) {
        notifyError("Please enter your name.");
        return setError("Please enter your name.");
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const profileData = { name, age: 0, height: 0, weight: 0, createdAt: new Date(), subscription: { status: 'free' } };
        await setDoc(doc(db, `users/${userCredential.user.uid}/profile`, "data"), profileData);

        // Create public profile
        await setDoc(doc(db, "publicProfiles", userCredential.user.uid), {
          name: name,
          userId: userCredential.user.uid
        });
      } catch (err) {
        notifyError(err.message);
        setError(err.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        notifyError(err.message);
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegisterMode ? 'Register' : 'Login'}
        </h2>
        <div className="space-y-4">
          {isRegisterMode && (
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="pt-2">
            <Button onClick={handleAuthAction}>
              {isRegisterMode ? 'Register' : 'Login'}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 pt-4">
            <span>
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              {isRegisterMode ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;