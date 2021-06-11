import React from 'react';
import Popup from "reactjs-popup";
import { useSelector, useDispatch } from 'react-redux';
import 'reactjs-popup/dist/index.css';

import { CancelIcon, ReplyIcon, BackIcon, ZoomIcon } from '../../icons';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import handleEditPanelClickOutside from '../../helpers/handleEditPanelClickOutside';
import ShowImg from '../ShowImg';
import socket from '../../helpers/socketConnect';

function EditPanel({ handleReply, imagesSlide }) {
    const {
        panelRef
    } = handleEditPanelClickOutside();
    const touchingMess = useSelector(state => state.touchingMess);
    const isMobile = useSelector(state => state.isMobile);
    const currentUser = useSelector(state => state.currentUser);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    // function handleRecallMess() {
    //     socket.emit("UserRecallMess", { messId: touchingMess.mess._id, toId: currentUser._id, fromId: user.id });
    // }

    function handleDeleteMess() {
        socket.emit("UserDeleteMess", { messId: touchingMess.mess._id, toId: currentUser._id, fromId: user.id });
    }

    function handleBackButton() {
        let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
        dispatch(action);
    }

    return (
        <div className={`flex justify-between items-center bg-secondary px-6 animate__animated animate__slideInUp animate__faster`} style={{ height: '134px' }} ref={panelRef}>
            <div className="flex flex-col items-center hover:opacity-60 cursor-pointer" onClick={handleReply}>
                <ReplyIcon className="fill-current w-5 h-5 text-secondary" />
                Reply
            </div>

            <div className="flex flex-col items-center hover:opacity-60 cursor-pointer" onClick={handleBackButton}>
                <BackIcon className="fill-current w-5 h-5 text-secondary" />
                Back
            </div>
            {
                touchingMess.mess.type === 'image' &&
                <Popup className="my-slide-popup" onClose={() => {
                    let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
                    dispatch(action);
                }} modal trigger={
                    <div className="flex flex-col items-center hover:opacity-60 cursor-pointer">
                        <ZoomIcon className="fill-current w-5 h-5 text-secondary" />
                        Zoom
                    </div>
                }>
                    {close => {
                        return !isMobile ? <ShowImg onClose={close} currentImg={touchingMess.mess} panelRef={panelRef} imagesSlide={imagesSlide} />
                            : <img src={touchingMess.mess.img} alt="img" />
                    }}
                </Popup>
            }
            {
                touchingMess.self &&
                <Popup modal className="my-delete-popup" onClose={() => {
                    let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
                    dispatch(action);
                }} trigger={
                    <div className="flex flex-col items-center hover:opacity-60 cursor-pointer">
                        <CancelIcon className="fill-current w-5 h-5 text-secondary" />
                        Delete
                    </div>
                }>
                    {
                        close => {
                            return <div className="flex items-center p-4 justify-between rounded-2xl bg-primary" ref={panelRef}>
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
                                    onClick={() => handleDeleteMess()}
                                >Delete</button>
                            </div>
                        }
                    }
                </Popup>
            }

        </div>
    )
}

export default EditPanel;