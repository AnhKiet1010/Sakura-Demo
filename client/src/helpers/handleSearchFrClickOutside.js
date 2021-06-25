import { useEffect, useRef, useState } from "react";

function useComponentVisible(initialIsVisible) {
    const [searchingFriend, setSearchingFriend] = useState(
        initialIsVisible
    );
    const searchFrRef = useRef(null);

    const handleClickOutside = event => {
        if (searchFrRef.current && !searchFrRef.current.contains(event.target)) {
            setSearchingFriend(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { searchFrRef, searchingFriend, setSearchingFriend };
}

export default useComponentVisible;