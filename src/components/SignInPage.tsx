import React from 'react';
import Template from './Template.tsx';
import SignIn from './SignIn.tsx';

const SignInPage=()=> {
    return (
        <div className='homepage'>
            <Template />
            <SignIn />
        </div>
    );
}

export default SignInPage;