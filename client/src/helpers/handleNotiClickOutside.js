import { useEffect, useRef, useState } from "react";

function useComponentVisible(initialIsVisible) {
    const [showNoti, setShowNoti] = useState(
        initialIsVisible
    );
    const notiRef = useRef(null);

    const handleClickOutside = event => {
        if (notiRef.current && !notiRef.current.contains(event.target)) {
            setShowNoti(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { notiRef, showNoti, setShowNoti };
}

export default useComponentVisible;