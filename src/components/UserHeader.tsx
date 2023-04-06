import React from "react";

const UserHeader=({login})=> {
    return (
        <div className="userheader">
            <h1>Welcome {login}</h1>
        </div>
    );
}

export default UserHeader;