import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Worky.</Link>
      </div>
      <div className="navbar-buttons">
        <button className="navbar-button sign-up">Sign-Up</button>
        <button className="navbar-button log-in">Log-in</button>
      </div>
    </nav>
  );
};

export default Navbar;
