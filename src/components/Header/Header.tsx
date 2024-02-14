import React from 'react';
import { NavLink } from 'react-router-dom';
import Toolbar from '../Toolbar/Toolbar';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className='header'>
            <div className="container">
                <div className="header-inner">
                    <NavLink className={'logo'} to="/" end>
                        <h3>Static Page</h3>
                    </NavLink>
                    <Toolbar />
                </div>
            </div>
        </header>
    );
}

export default Header;
