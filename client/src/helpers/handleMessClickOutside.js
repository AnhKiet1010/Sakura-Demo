import { useEffect, useState, useRef } from "react";

function useComponentVisible(initialIsVisible) {
    const [showReact, setShowReact] = useState(
        initialIsVisible
    );
    const messRef = useRef(null);

    const handleClickOutside = event => {
        if (messRef.current && !messRef.current.contains(event.target)) {
            setShowReact(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { messRef, showReact, setShowReact };
}

export default useComponentVisible;