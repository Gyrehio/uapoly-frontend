import React from "react";

import UserHeader from "./UserHeader.tsx";
import GameButtons from "./GameButtons.tsx";
import Footer from "./Footer.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader />
            <GameButtons />
            <Footer />
        </div> 
    );
}

export default UserPage;