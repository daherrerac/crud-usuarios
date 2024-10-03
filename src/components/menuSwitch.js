import React from 'react';
import { Link } from 'react-router-dom';

const MenuSwitch = () => {
    return (
        <nav>
            <ul className='nav' style={{display: "flex", columnGap: "10px"}}>
                <li>
                    <Link style={{color: "blue"}} to="/">Productos</Link>
                </li>
                <li>
                    <Link style={{color: "blue"}} to="/users">Usuarios</Link>
                </li>
            </ul>
        </nav>
    );
};

export default MenuSwitch;