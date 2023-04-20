import React from "react";

import UserHeader from "./UserHeader.tsx";
import GameButtons from "./GameButtons.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader />
            <GameButtons />
        </div> 
    );
}

export default UserPage;