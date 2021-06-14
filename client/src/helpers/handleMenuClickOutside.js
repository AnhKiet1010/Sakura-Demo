import { useEffect, useRef, useState } from "react";

function useComponentVisible(initialIsVisible) {
    const [showMenu, setShowMenu] = useState(
        initialIsVisible
    );
    const menuRef = useRef(null);

    const handleClickOutside = event => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { menuRef, showMenu, setShowMenu };
}

export default useComponentVisible;