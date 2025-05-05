import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-indigo-50 via-white to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Build beautiful experiences with&nbsp;
            <span className="text-indigo-600">speed</span> and&nbsp;
            <span className="text-indigo-600">precision</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Create stunning, responsive web applications with our modern toolset. Start building your next great idea today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
          <div className="aspect-[16/9] bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 w-full h-full flex items-center justify-center">
              <p className="text-gray-400 text-lg">Application Preview</p>
            </div>
          </div>
          
          {/* Abstract shapes */}
          <div className="absolute -z-10 -right-16 -top-16 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -z-10 -left-16 -bottom-16 w-72 h-72 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;