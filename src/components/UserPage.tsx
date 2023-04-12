import React from "react";

import UserHeader from "./UserHeader.tsx";
import UserDisplay from "./UserDisplay.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader />
            <UserDisplay />
        </div> 
    );
}

export default UserPage;