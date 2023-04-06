import React from "react";

import UserHeader from "./UserHeader.tsx";
import UserDisplay from "./UserDisplay.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader login={"Gyrehio"}/>
            <UserDisplay login={"Gyrehio"} email={"test@oui.org"} />
        </div> 
    );
}

export default UserPage;