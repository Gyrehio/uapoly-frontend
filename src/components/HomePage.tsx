import React from 'react';
import SignIn from './SignIn.tsx';
import { Link } from 'react-router-dom';

const HomePage=()=> {
    return (
        <div className='homepage'>
            <SignIn />
        </div>
    );
}

export default HomePage;