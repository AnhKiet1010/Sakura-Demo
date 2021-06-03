import { useEffect, useState, useRef } from "react";

function useComponentVisible(initialIsVisible) {
    const [showProfile, setShowProfile] = useState(
        initialIsVisible
    );
    const refProfile = useRef(null);

    const handleClickOutside = event => {
        if (refProfile.current && !refProfile.current.contains(event.target)) {
            setShowProfile(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { refProfile, showProfile, setShowProfile };
}

export default useComponentVisible;