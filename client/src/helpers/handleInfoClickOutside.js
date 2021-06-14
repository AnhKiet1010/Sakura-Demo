import { useEffect, useRef, useState } from "react";

function useComponentVisible(initialIsVisible) {
    const [showInfo, setShowInfo] = useState(
        initialIsVisible
    );
    const infoRef = useRef(null);

    const handleClickOutside = event => {
        if (infoRef.current && !infoRef.current.contains(event.target)) {
            setShowInfo(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { infoRef, showInfo, setShowInfo };
}

export default useComponentVisible;