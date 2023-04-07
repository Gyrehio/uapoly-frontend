import React from "react";

import UserHeader from "./UserHeader.tsx";
import UserDisplay from "./UserDisplay.tsx";

const UserPage=()=> {
    return(
        <div className="userpage">
            <UserHeader login={"Gyrehio"}/>
            <UserDisplay login={"Gyrehio"} email={"test@oui.org"} friends={["tchm","Tijack1","Kurobaka"]} sent={["49Leo","CycyGonzales"]} received={["Tiralex1","Gykren"]} />
        </div> 
    );
}

export default UserPage;