import React, { useEffect, useState } from 'react';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import InfiniteScroll from '../InfiniteScroll';
import Loading from '../Loading';
import UploadPopup from '../UploadPopup';
import { PlusIcon, CancelIcon } from '../../icons';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import handleProfileClickOutside from '../../helpers/handleProfileClickOutside';
import Header from './Header';
import Input from './Input';
import EditPanel from './EditPanel';
import API from '../../api/API';


const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);

function ChatPageCenter({ handleSearchPress, refProfile, hasMoreTop, hasMoreBot, loadingMess, changeData, limit, setLimit, showProfile, skip, setSkip }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const user = useSelector(state => state.user);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [loadingTop, setLoadingTop] = useState(false);
    const [replyMessId, setReplyMessId] = useState("");
    const [replyText, setReplyText] = useState("");
    const [showReplyPanel, setShowReplyPanel] = useState(false);
    const [imagesSlide, setSlideImages] = useState([]);
    const touchingMess = useSelector(state => state.touchingMess);

    useEffect(() => {
        function UpdateListImagesMess(fromId, toId) {
            API.getImages({ fromId, toId })
            .then((res) => {
                if (res.status === 200) {
                    setSlideImages(res.data.result);
                }
            });
        }
        
        UpdateListImagesMess(currentUser._id, user.id);
    }, [currentUser]);

    function fetchMoreMess(to) {
        if (to === 'top') {
            console.log("fetchinggggg Top");
            setLoadingTop(true);
            setLimit(limit + envLimit);
        } else if (to === 'bot' && skip !== 0) {
            console.log("fetchinggggg Bot");
            setLoadingBottom(true);
            if (skip - envLimit > 0) {
                setSkip(skip - envLimit);
            } else {
                setSkip(0);
            }
        }
        changeData();
    }

    function handleReply() {
        setReplyText(touchingMess.mess.content);
        setReplyMessId(touchingMess.mess._id);
        setShowReplyPanel(true);
        let action = setTouchingMess({ mess: touchingMess.mess, showEditPanel: false, self: touchingMess.self });
        dispatch(action);
    }

    function onCloseReplyPanel() {
        setShowReplyPanel(false);
        setReplyMessId("");
        setReplyText("");
        let action = setTouchingMess({ mess: {}, showEditPanel: false, self: false });
        dispatch(action);
    }

    return (
        <>
            {
                currentUser.name !== undefined ? <>
                    <div className={`flex-1 flex flex-col justify-center bg-primary w-full h-screen text-primary`}>

                        <Header handleSearchPress={handleSearchPress} />
                        {
                            loadingMess ? <Loading /> : <InfiniteScroll
                                loading={false}
                                fetchMoreMess={fetchMoreMess}
                                hasMoreTop={hasMoreTop}
                                hasMoreBot={hasMoreBot}
                                currentUser={currentUser}
                                limit={limit}
                                loadingBottom={loadingBottom}
                                loadingTop={loadingTop}
                            />
                        }

                        {
                            !touchingMess.showEditPanel ?
                                <Input showReplyPanel={showReplyPanel} replyText={replyText} replyMessId={replyMessId} onCloseReplyPanel={onCloseReplyPanel} setShowReplyPanel={setShowReplyPanel}  />
                                :
                                <EditPanel handleReply={handleReply} imagesSlide={imagesSlide} />
                        }
                    </div>

                    <div className={`absolute right-0 z-10 h-screen bg-primary text-primary border-l-2 dark:border-gray-500 flex-none w-full md:w-72 lg:w-96 py-6 transform translate-x-full ${showProfile ? 'slide-in' : 'slide-out'}`} ref={refProfile}>
                        <div>
                            <div className="relative border-b-2 pb-8 flex flex-col items-center text-primary dark:border-gray-500">
                                <button className={`absolute text-xl text-primary p-2 focus:outline-none -top-3 right-3 opacity-80 hover:opacity-100`}>
                                    <CancelIcon className="fill-current h-6 w-6 block text-primary bg-primary hover:text-secondary" />
                                </button>
                                <img src={currentUser.avatar} alt="avatar" className="rounded-full w-60 h-60 object-cover" />
                                <p className="text-3xl my-3 text-center">{currentUser.name}</p>
                                <p className="text-xl text-center">No pain no gain</p>
                            </div>
                            <div className="flex justify-between items-center px-6 py-2">
                                <div className="">Notes <span className="dark:text-gray-500 text-gray-400">0</span></div>
                                <Popup modal trigger={
                                    <button className="text-3xl text-primary p-2 focus:outline-none text-green-400">
                                        <PlusIcon className="h-7 w-7 block hover:text-secondary" />
                                    </button>
                                }>
                                    {close => <UploadPopup close={close} currentUser={currentUser} />}
                                </Popup>
                            </div>
                        </div>
                    </div>

                </> :
                    <div className="bg-primary text-primary w-full h-full flex justify-center items-center">
                        <p className="text-3xl text-gray-400">Click a chat to start talking!</p>
                    </div>
            }
        </>
    )

}

export default ChatPageCenter;