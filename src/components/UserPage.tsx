import React from "react";

import UserHeader from "./UserHeader.tsx";
import UserDisplay from "./UserDisplay.tsx";
import GameButtons from "./GameButtons.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader />
            <UserDisplay />
            <GameButtons />
        </div> 
    );
}

export default UserPage;