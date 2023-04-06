import React from "react";

const UserDisplay=({login, email})=> {
    return(
        <div className="displayInfos">
            <div className="infoTitle">
                <label className="title" htmlFor="title">User informations</label>
            </div>
            <div>
                <label className="infos" htmlFor="loginLabel">User's login : {login}</label>
            </div>
            <div>
                <label className="infos" htmlFor="emailLabel">User's email : {email}</label>
            </div>
        </div>
    );
}

export default UserDisplay;