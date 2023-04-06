import React from "react";

const UserDisplay=({login, email})=> {
    return(
        <div className="displayInfos">
            <div>
                <label htmlFor="loginLabel">User's login :&nbsp;</label>
                <label htmlFor="login">{login}</label>
            </div>
            <div>
                <label htmlFor="emailLabel">User's email :&nbsp;</label>
                <label htmlFor="email">{email}</label>
            </div>
        </div>
    );
}

export default UserDisplay;