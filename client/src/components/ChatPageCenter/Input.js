import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { useSelector } from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import socket from '../../helpers/socketConnect';
import UploadPopup from '../UploadPopup';
import { PlusIcon, MicIcon, SmileIcon, StickerIcon, SendIcon, LoadingIcon } from '../../icons';
import handleEmojiClickOutside from '../../helpers/handleEmojiClickOutside';
import ReplyPanel from '../ReplyPanel';
import API from '../../api/API';

function Input({ onCloseReplyPanel, showReplyPanel, setShowReplyPanel }) {
    const isMobile = useSelector(state => state.isMobile);
    const touchingMess = useSelector(state => state.touchingMess);
    const currentUser = useSelector(state => state.currentUser);
    const user = useSelector(state => state.user);
    const [uploadingImageMess, setUploadingImageMess] = useState(false);
    const [reply, setReply] = useState("");
    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
    } = handleEmojiClickOutside(false);

    function addEmoji(e) {
        let emoji = e.native;
        setReply(reply + emoji);
    };

    function onFocusInput() {
        socket.emit("UserStartTyping", { fromId: user.id, toId: currentUser._id });
    }

    function onBlurInput() {
        socket.emit("UserEndTyping", { fromId: user.id, toId: currentUser._id });
    }

    function handleKeyPress(e) {
        if (e.nativeEvent.shiftKey) {
            if (e.nativeEvent.keyCode === 13) {
                return;
            }
        } else if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            socket.emit("ChannelSendMess", {
                fromId: user.id,
                toId: currentUser._id,
                content: reply,
                type: "text",
                reply: touchingMess.mess._id
            });
            setReply("");
            setShowReplyPanel(false);
        }
    }

    function handleSendMessClick(e) {
        e.preventDefault();
        socket.emit("ChannelSendMess", {
            fromId: user.id,
            toId: currentUser._id,
            content: reply,
            type: "text",
            reply: touchingMess.mess._id
        });
        setReply("");
    }

    const handleImageSendInMobile = (e) => {
        if (e.target.files !== undefined) {
            setUploadingImageMess(true);
            console.log('files', e.target.files);
            const formData = new FormData();

            for (let i = 0; i < e.target.files.length; i++) {
                formData.append("files", e.target.files[i]);
            }
            formData.append("toId", currentUser._id);
            formData.append("fromId", user.id);
            formData.append("type", 'image');

            API.sendMessage(formData)
                .then(res => {
                    console.log('res', res);
                    setUploadingImageMess(false);
                }).catch(err => {
                    console.log('loi', err);
                })
        }
    }

    return (
        <div className="flex flex-col w-full animate__animated animate__fadeIn">
                                    <div className="flex bg-gray-300 dark:bg-gray-500 justify-start">
                                        {
                                            !isMobile
                                                ?
                                                <Popup modal trigger={
                                                    <div className="text-3xl text-secondary p-2 ml-2 focus:outline-none cursor-pointer">
                                                        <PlusIcon className="h-6 w-6 block hover:text-primary" />
                                                    </div>
                                                }>
                                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                                </Popup>
                                                :
                                                <>
                                                    <label htmlFor="hidden-input" className="text-3xl text-secondary p-2 ml-2 focus:outline-none cursor-pointer flex items-center">
                                                        {
                                                            uploadingImageMess ?
                                                                <LoadingIcon className="animate-spin spin-slow h-5 w-5 block hover:text-primary fill-current" />
                                                                :
                                                                <PlusIcon className="h-6 w-6 block hover:text-primary" />
                                                        }
                                                    </label>
                                                    <input id="hidden-input" type="file" multiple className="hidden"
                                                        name="files" capture onChange={handleImageSendInMobile} />
                                                </>
                                        }
                                        <div className="relative text-3xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer" onClick={() => setIsComponentVisible(true)}>
                                            {
                                                isComponentVisible && <span ref={ref} className="absolute bottom-12 -left-8">
                                                    <Picker onSelect={addEmoji} />
                                                </span>
                                            }
                                            <SmileIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                        <div className="text-3xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                            <StickerIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                        <div className="text-2xl text-secondary p-2 focus:outline-none flex justify-center items-center cursor-pointer">
                                            <MicIcon className="h-6 w-6 block hover:text-primary" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {
                                            showReplyPanel &&
                                            <ReplyPanel
                                                close={onCloseReplyPanel}
                                            />
                                        }
                                        <TextareaAutosize
                                            className="bg-primary text-primary w-full pl-4 pr-24 text-left py-2 appearance-none focus:outline-none"
                                            minRows={3}
                                            placeholder={`Press「Enter」to send message to ${currentUser.name}`}
                                            onKeyDown={(e) => handleKeyPress(e)} onChange={(e) => {
                                                setReply(e.target.value);
                                            }}
                                            value={reply}
                                            onFocus={onFocusInput}
                                            onBlur={onBlurInput}
                                            autoFocus={false}
                                        />
                                        <button type="button" onClick={handleSendMessClick} className="absolute transform translate-y-1/2 z-10 right-5 inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                                            <SendIcon />
                                        </button>

                                    </div>
                                </div>
    )
}

export default Input;