import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';

function useComponentVisible(initialIsVisible) {
    const user = useSelector(state => state.user);
    const [editUsername, setEditUsername] = useState(
        initialIsVisible
    );


    const [newUsername, setNewUsername] = useState(user ? user.name : "");

    const inputUsernameRef = useRef(null);

    const handleClickOutside = event => {
        if (inputUsernameRef.current && !inputUsernameRef.current.contains(event.target)) {
            setEditUsername(false);
            setNewUsername(user.name);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { inputUsernameRef, editUsername, setEditUsername, newUsername, setNewUsername };
}

export default useComponentVisible;