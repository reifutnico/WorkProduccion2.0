import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setDropdown(menu);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">worky.</Link>
      </div>
      <ul className="navbar-menu">
        <li
          className="navbar-item"
          onMouseEnter={() => handleMouseEnter('hogar')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/">hogar</Link>
          {dropdown === 'hogar' && (
            <div className="dropdown">
              <Link to="/option1">Option 1</Link>
              <Link to="/option2">Option 2</Link>
            </div>
          )}
        </li>
        <li
          className="navbar-item"
          onMouseEnter={() => handleMouseEnter('educacion')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/educacion">educacion</Link>
          {dropdown === 'educacion' && (
            <div className="dropdown">
              <Link to="/option1">Option 1</Link>
              <Link to="/option2">Option 2</Link>
            </div>
          )}
        </li>
        <li
          className="navbar-item"
          onMouseEnter={() => handleMouseEnter('consultoria')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/consultoria">consultoria</Link>
          {dropdown === 'consultoria' && (
            <div className="dropdown">
              <Link to="/option1">Option 1</Link>
              <Link to="/option2">Option 2</Link>
            </div>
          )}
        </li>
        <li
          className="navbar-item"
          onMouseEnter={() => handleMouseEnter('diseño')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/diseño">diseño</Link>
          {dropdown === 'diseño' && (
            <div className="dropdown">
              <Link to="/option1">Option 1</Link>
              <Link to="/option2">Option 2</Link>
            </div>
          )}
        </li>
        <li
          className="navbar-item"
          onMouseEnter={() => handleMouseEnter('desarrollo personal')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/desarrollo-personal">desarrollo personal</Link>
          {dropdown === 'desarrollo personal' && (
            <div className="dropdown">
              <Link to="/option1">Option 1</Link>
              <Link to="/option2">Option 2</Link>
            </div>
          )}
        </li>
      </ul>
      <div className="navbar-buttons">
        <button className="navbar-button sign-up">Sign-Up</button>
        <button className="navbar-button log-in">Log-in</button>
      </div>
    </nav>
  );
};

export default Navbar;
