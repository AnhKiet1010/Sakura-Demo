import Popup from "reactjs-popup";
import { setTouchingMess } from '../slices/touchingMessSlice';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

function DeleteMessPopup({ handleDeleteMess, showPopupDelete }) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    useEffect(() => {

    });
    console.log("component popup state",showPopupDelete );

    return (
        <Popup modal className="my-delete-popup" onClose={() => {
            let action = setTouchingMess({ messId: "", showEditPanel: false });
            dispatch(action);
        }} open={showPopupDelete}>
            <div className="flex items-center p-4 justify-between rounded-2xl bg-primary">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 rounded-2xl p-3 border border-red-100 text-red-400 bg-red-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex flex-col ml-3">
                        <div className="font-medium leading-none text-primary">Delete This Message ?</div>
                    </div>
                </div>
                <button
                    className="flex-no-shrink bg-red-500 px-5 ml-4 py-2 text-sm shadow-sm hover:opacity-90 focus:outline-none font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
                    onClick={handleDeleteMess}
                >Delete</button>
            </div>
        </Popup>
    )
}

export default DeleteMessPopup;