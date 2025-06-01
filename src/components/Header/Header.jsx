import React from 'react';
import logo from '../../imgs/logo.png';

function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-32 w-auto object-contain"
            />
           

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
