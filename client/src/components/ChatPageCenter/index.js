import React, { useEffect, useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import InfiniteScroll from '../InfiniteScroll';
import Loading from '../Loading';
import { setTouchingMess } from '../../slices/touchingMessSlice';
import Header from './Header';
import Input from './Input';
import EditPanel from './EditPanel';
import API from '../../api/API';
import Profile from '../Profile';



const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);

function ChatPageCenter({ handleSearchPress, refProfile, hasMoreTop, hasMoreBot, loadingMess, changeData, limit, setLimit, showProfile, setShowProfile, skip, setSkip }) {
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
                                <Input showReplyPanel={showReplyPanel} replyText={replyText} replyMessId={replyMessId} onCloseReplyPanel={onCloseReplyPanel} setShowReplyPanel={setShowReplyPanel} />
                                :
                                <EditPanel handleReply={handleReply} imagesSlide={imagesSlide} />
                        }
                    </div>

                    <Profile refProfile={refProfile} showProfile={showProfile} setShowProfile={setShowProfile} />

                </> :
                    <div className="bg-primary text-primary w-full h-full flex justify-center items-center">
                        <p className="text-3xl text-gray-400">Click a chat to start talking!</p>
                    </div>
            }
        </>
    )

}

export default ChatPageCenter;