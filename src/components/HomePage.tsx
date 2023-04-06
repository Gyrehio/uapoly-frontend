import React from 'react';
import Template from './Template.tsx';
import SignUp from './SignUp.tsx';

const HomePage=()=> {
    return (
        <div className='homepage'>
            <Template />
            <SignUp />
        </div>
    );
}

export default HomePage;