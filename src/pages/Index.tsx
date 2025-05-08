
import { useState, useEffect } from 'react';
import PasswordGenerator from '../components/PasswordGenerator';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-950 to-black flex items-center justify-center p-4">
      <PasswordGenerator />
    </div>
  );
};

export default Index;
