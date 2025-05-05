import React from 'react';
import { Zap } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Zap className="h-8 w-8 text-indigo-600" />
      <span className="font-bold text-xl text-gray-900">Bolt</span>
    </div>
  );
};

export default Logo;