import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setTouchingMess } from '../slices/touchingMessSlice';

function useComponentVisible() {
    const dispatch = useDispatch();
    const touchingMess = useSelector(state => state.touchingMess);

    const panelRef = useRef(null);

    const handleClickOutside = event => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            let action = setTouchingMess({...touchingMess, showEditPanel: false});
            dispatch(action);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { panelRef };
}

export default useComponentVisible;