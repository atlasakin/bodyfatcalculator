import React from 'react';
import { Zap, Layout, Code, Shield, RefreshCw, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance ensures your application runs smoothly with minimal load times.',
  },
  {
    icon: Layout,
    title: 'Responsive Design',
    description: 'Layouts that adapt perfectly to any device size from mobile to desktop.',
  },
  {
    icon: Code,
    title: 'Clean Code',
    description: 'Well-structured codebase that follows best practices for maintainability.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Built with security in mind to protect your data and user information.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Updates',
    description: 'Simple update process to keep your application current with the latest features.',
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Designed with users in mind, creating intuitive and enjoyable experiences.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Powerful Features
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to build modern web applications
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;