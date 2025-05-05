import React from 'react';
import { Heart } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Creating beautiful digital experiences with modern technology and thoughtful design.
            </p>
            <div className="mt-6 flex space-x-4">
              {['twitter', 'github', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href={`#${social}`}
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  aria-label={`${social} link`}
                >
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors duration-200">
                    <span className="text-xs font-medium">{social[0].toUpperCase()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Testimonials', 'FAQ'],
              },
              {
                title: 'Company',
                links: ['About', 'Team', 'Careers', 'Press'],
              },
              {
                title: 'Resources',
                links: ['Blog', 'Documentation', 'Support', 'Contact'],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a 
                        href={`#${link.toLowerCase()}`}
                        className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Bolt Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-500">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" /> by the Bolt team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;