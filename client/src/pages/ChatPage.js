import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Aos from 'aos';
import 'react-toastify/dist/ReactToastify.css';
import 'aos/dist/aos.css';
import { useDispatch, useSelector } from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import { useSwipeable } from 'react-swipeable';

import API from '../api/API';

import { ThemeContext } from '../components/themeContext';
import audio from "../assets/audio/like.wav";
import MessFilterPopup from '../components/MessFilterPopup';
import socket from '../helpers/socketConnect';
import { setKeyword } from '../slices/keywordSlice';
import { setTyping } from '../slices/typingSlice';
import { setCurrentUser } from '../slices/currentUserSlice';
import { setListFriends } from '../slices/listFriendsSlice';
import { setListMessages } from '../slices/listMessagesSlice';
import { setIsMobile } from '../slices/isMobileSlice';
import { setListNoti } from '../slices/listNotiSlice';
import { setHaveNoti } from '../slices/haveNotiSlice';
import { setTouchingMess } from '../slices/touchingMessSlice';
import { setListSearchFriends } from '../slices/listSearchFriendsSlice';
import handleProfileClickOutside from '../helpers/handleProfileClickOutside';
import ChatPageLeft from '../components/ChatPageLeft';
import ChatPageCenter from '../components/ChatPageCenter';

const envLimit = parseInt(process.env.REACT_APP_MESS_PER_LOAD);


function ChatPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const keyword = useSelector(state => state.keyword);
    const currentUser = useSelector(state => state.currentUser);
    const { theme, setTheme } = useContext(ThemeContext);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(envLimit);
    const [hasMoreTop, setHasMoreTop] = useState(true);
    const [hasMoreBot, setHasMoreBot] = useState(true);
    const [loadingMess, setLoadingMess] = useState(false);
    const [loadingFr, setLoadingFr] = useState(false);
    const [isChangeData, setIsChangeData] = useState(false);
    const [word, setWord] = useState(keyword);
    const [listMessFilter, setListMessFilter] = useState([]);
    const [showListFilterMess, setShowListFilterMess] = useState(false);
    const messAudio = new Audio(audio);
    const [searchLimit, setSearchLimit] = useState(5);
    const [searchSkip, setSearchSkip] = useState(0);
    const [searchTotal, setSearchTotal] = useState(0);
    const {
        refProfile,
        showProfile,
        setShowProfile
    } = handleProfileClickOutside(false);
    const [showLeft, setShowLeft] = useState(true);


    useEffect(() => {
        socket.on("UserSendMessToChangeData", (data) => {
            changeData();
        });

        socket.on("UserSendMessToUser", () => {
            messAudio.play();
            changeData();
        });

        socket.on("OnChangeListMessBySearch", data => {
            setListMessFilter(data.listMessFilter);
            setSearchTotal(data.searchTotal);
            console.log("listFilter", listMessFilter);
        });

        socket.on("SearchedFriend", data => {
            let action = setListSearchFriends(data.listSearch);
            dispatch(action);
        });

        socket.on("UserStateChange", () => {
            changeData();
        });

        socket.on("UserSendNoti", () => {
            updateNoti();
            let action = setHaveNoti(true);
            dispatch(action);
        });

        socket.on("ChangeMessStatusToSeen", (data) => {
            if (data.id === currentUser._id) {
                updateListMess();
            }
        });

        socket.on("SetStartTyping", (data) => {
            const action = setTyping({
                state: true,
                id: data.id
            });
            dispatch(action);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                setShowLeft(true);
                let action = setIsMobile(false);
                dispatch(action);
            } else {
                let action = setIsMobile(true);
                dispatch(action);
            }
        });

        socket.on("SetEndTyping", (data) => {
            const action = setTyping({
                state: false,
                id: ""
            });
            dispatch(action);
        });

        socket.on("UserDeleteMess", () => {
            changeData();
            let action = setTouchingMess({ messId: "", showEditPanel: false, self: false, text: "" });
            dispatch(action);
        });

        socket.on("UserRecallMess", () => {
            changeData();
        });

        return () => {
            socket.off("UserSendMessToChangeData");
            socket.off("UserSendMessToUser");
            socket.off("OnChangeListMessBySearch");
            socket.off("UserStateChange");
            socket.off("ChangeMessStatusToSeen");
            socket.off("SetStartTyping");
            socket.off("SetEndTyping");
            socket.off("UserDeleteMess");
            socket.off("UserRecallMess");
            socket.off("SearchedFriend");
        }
    });

    function isDark() {
        return theme === "dark";
    }

    function updateListMess() {
        const body = { frId: currentUser._id, userId: user.id, limit, skip };
        API.getListMessages(body)
            .then(res => {
                const { listMess, hasMoreTop, hasMoreBot } = res.data.data;
                let action = setListMessages(listMess);
                dispatch(action);
                console.log('updating list mess', res.data.data);
                setHasMoreTop(hasMoreTop);
                setHasMoreBot(hasMoreBot);
            });
        setLoadingMess(false);
    }

    function updateNoti() {
        const body = { id: user.id };

        API.getNoti(body)
        .then(res => {
            let action = setListNoti(res.data.listNoti);
            dispatch(action);
        }).catch(err => console.log(err));
    }

    function updateListFriend() {
        API.getListFriend({ userId: user.id })
            .then(res => {
                if (res.data.error) {
                    toast.error(res.data.message);
                } else {
                    let action = setListFriends(res.data.data.listFriends);
                    dispatch(action);
                }
            }).catch(err => {
                console.log(err);
            })
        setLoadingFr(false);
    }

    function handleSearchPress(e) {
        setWord(e.target.value);
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            const action = setKeyword(e.target.value);
            dispatch(action);
            socket.emit('SearchMess', {
                text: e.target.value,
                skip: searchSkip,
                limit: searchLimit
            });
            setShowListFilterMess(true);
        }
    }

    function handleChangeSkipPrev() {
        setSearchSkip(searchSkip - searchLimit < 0 ? 0 : searchSkip - searchLimit);
        socket.emit('SearchMess', {
            text: word,
            skip: searchSkip - searchLimit < 0 ? 0 : searchSkip - searchLimit,
            limit: searchLimit
        });
    }

    function handleChangeSkipNext() {
        setSearchSkip(parseInt(searchSkip) + parseInt(searchLimit));
        socket.emit('SearchMess', {
            text: word,
            skip: parseInt(searchSkip) + parseInt(searchLimit),
            limit: searchLimit
        });
    }

    function handleChangeLimitSearch(e) {
        setSearchLimit(e.target.value);
        socket.emit('SearchMess', {
            text: word,
            skip: searchSkip,
            limit: e.target.value
        });
    }

    const onFriendClick = (friend) => {
        setLoadingMess(true);
        setLimit(envLimit);
        setHasMoreTop(true);
        setHasMoreBot(false);
        if (window.innerWidth <= 768) {
            setShowLeft(false);
        }
        let action = setCurrentUser(friend);
        socket.emit("UserSeenMess", { ofId: friend._id, fromId: user.id });
        dispatch(action);
    }

    function changeData() {
        setIsChangeData(!isChangeData);
    }

    useEffect(() => {
        updateListFriend();
        updateListMess();
    }, [currentUser, isChangeData]);

    useEffect(() => {
        document.title = "Sakura Chat";
        setLoadingFr(true);
        setLimit(envLimit);
        updateListFriend();
        socket.emit("UserOnline", { id: user.id });
        updateNoti();
    }, []);

    function onCloseSearchPopup() {
        setWord("");
        setShowListFilterMess(false);
        const action = setKeyword("");
        setSearchLimit(5);
        setSearchSkip(0);
        setSearchTotal(0);
        dispatch(action);
    }

    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            // console.log("User Swiped Left!");
            if (window.innerWidth <= 768 && currentUser.name !== undefined) {
                if (showLeft) {
                    setShowLeft(false);
                } else {
                    setShowProfile(true);
                }
            }
        },
        onSwipedRight: (eventData) => {
            // console.log("User Swiped Right!");
            if (window.innerWidth <= 768 && currentUser.name !== undefined) {
                if (showProfile) {
                    setShowProfile(false);
                } else {
                    setShowLeft(true);
                }
            }
        },
    });

    return (
        <div className="relative font-sans antialiased h-screen w-full flex overflow-hidden" {...handlers}>
            <ToastContainer />
            <ChatPageLeft
                setTheme={setTheme}
                isDark={isDark}
                loadingFr={loadingFr}
                onFriendClick={onFriendClick}
                showLeft={showLeft}
                setShowLeft={setShowLeft}
            />
            <MessFilterPopup
                showListFilterMess={showListFilterMess}
                onClose={onCloseSearchPopup}
                word={word}
                currentUser={currentUser}
                handleSearchPress={handleSearchPress}
                listMessFilter={listMessFilter}
                searchLimit={searchLimit}
                searchSkip={searchSkip}
                searchTotal={searchTotal}
                handleChangeLimitSearch={handleChangeLimitSearch}
                handleChangeSkipPrev={handleChangeSkipPrev}
                handleChangeSkipNext={handleChangeSkipNext}
            />
            <ChatPageCenter
                handleSearchPress={handleSearchPress}
                refProfile={refProfile}
                hasMoreTop={hasMoreTop}
                hasMoreBot={hasMoreBot}
                loadingMess={loadingMess}
                changeData={changeData}
                limit={limit}
                setLimit={setLimit}
                skip={skip}
                setSkip={setSkip}
                showProfile={showProfile}
            />
        </div>
    )
}

export default ChatPage;