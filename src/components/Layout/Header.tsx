import React from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import Logo from './Logo';

const Header: React.FC = () => {
  const { isOpen, toggleNav } = useNavigation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <nav className="hidden md:block ml-10">
              <ul className="flex space-x-8">
                {['Home', 'Features', 'Pricing', 'About'].map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 text-sm">
                    Resources
                    <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {['Documentation', 'Tutorials', 'Blog', 'Support'].map((item) => (
                      <a 
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-white text-indigo-600 border border-indigo-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-50 transition-colors duration-200">
              Sign In
            </button>
            <button className="hidden md:block bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
              Get Started
            </button>
            <button 
              onClick={toggleNav}
              className="md:hidden flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {['Home', 'Features', 'Pricing', 'About', 'Resources'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              {item}
            </a>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5 space-x-2">
              <button className="flex-1 text-center bg-white text-indigo-600 border border-indigo-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-50 transition-colors duration-200">
                Sign In
              </button>
              <button className="flex-1 text-center bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;