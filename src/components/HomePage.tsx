import React from 'react';
import Template from './Template.tsx';
import SignUp from './SignUp.tsx';
import { Link } from 'react-router-dom';

const HomePage=()=> {
    return (
        <div className='homepage'>
            <Template />
            <SignUp />
            <Link to='/user'>Test UserPage</Link>
        </div>
    );
}

export default HomePage;