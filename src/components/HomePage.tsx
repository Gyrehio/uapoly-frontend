import React from 'react';
import Template from './Template.tsx';
import SignIn from './SignIn.tsx';
import { Link } from 'react-router-dom';

const HomePage=()=> {
    return (
        <div className='homepage'>
            {/*<Template />*/}
            <SignIn />
        </div>
    );
}

export default HomePage;