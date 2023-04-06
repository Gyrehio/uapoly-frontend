import React from "react";

function addFriend(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='addFriendLogin']").value;

    const obj = JSON.stringify({
        "login": login
    });

    fetch('/friend/add', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

function removeFriend(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='removeFriendLogin']").value;

    const obj = JSON.stringify({
        "login": login,
    });

    fetch('/friend/remove', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

const UserDisplay=({login, email})=> {
    return(
        <>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your informations</label>
                </div>
                <div>
                    <label className="infos" htmlFor="loginLabel">Login : {login}</label>
                </div>
                <div>
                    <label className="infos" htmlFor="emailLabel">Email : {email}</label>
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your friendlist</label>
                </div>
                <div>
                    
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your friend requests</label>
                </div>
                <div>
                    
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Add a friend</label>
                    <input type="text" name="addFriendLogin" /><br/>
                    <input type="button" name="addFriend" value={"Add friend"} onClick={addFriend} /><br/>
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Remove a friend</label>
                    <input type="text" name="removeFriendLogin" /><br/>
                    <input type="button" name="removeFriend" value={"Remove friend"} onClick={removeFriend} /><br/>
                </div>
            </div>
        </>
        
    );
}

export default UserDisplay;