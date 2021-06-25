
import { useHistory } from 'react-router-dom';
import ListFriends from '../components/ListFriends';
import { LightIcon, DarkIcon, SearchIcon, BellIcon, CancelIcon, SettingIcon } from '../icons';
import Loading from './Loading';
import { onLogout } from '../helpers/auth';
import { useEffect, useState } from 'react';
import 'animate.css';
import LOGO from '../assets/images/logo.png';
import DARKLOGO from '../assets/images/darkLogo.png';
import socket from '../helpers/socketConnect';
import { setHaveNoti } from '../slices/haveNotiSlice';
import handleNotiClickOutside from '../helpers/handleNotiClickOutside';

import ListSearchFriends from './ListSearchFriends';
import { useSelector, useDispatch } from 'react-redux';
import API from '../api/API';
import { setListNoti } from '../slices/listNotiSlice';
import handleMenuClickOutside from '../helpers/handleMenuClickOutside';
import handleSearchFrClickOutside from '../helpers/handleSearchFrClickOutside';


function ChatPageLeft({ setTheme, isDark, loadingFr, onFriendClick, showLeft, setShowProfile }) {
    const history = useHistory();
    const user = useSelector(state => state.user);
    const [searchFriend, setSearchFriend] = useState("");
    const {searchFrRef, searchingFriend, setSearchingFriend } = handleSearchFrClickOutside(false);
    const listNoti = useSelector(state => state.listNoti);
    const [checkedNoti, setCheckedNoti] = useState(false);
    const { notiRef, showNoti, setShowNoti } = handleNotiClickOutside(false);
    const haveNoti = useSelector(state => state.haveNoti);
    const dispatch = useDispatch();
    const { menuRef, showMenu, setShowMenu } = handleMenuClickOutside(false);

    const onSearchFriend = (e) => {
        socket.emit("UserSearchFriend", { keyword: e.target.value, id: user.id });
        setSearchFriend(e.target.value);
    }

    const onInputFocus = () => {
        socket.emit("UserSearchFriend", { keyword: searchFriend, id: user.id });
        setSearchingFriend(true);
    }

    const handleLogout = () => {
        onLogout(user.id);
        history.push('/login');
    }


    useEffect(() => {
        setTimeout(() => {
            let action = setHaveNoti(false);
            dispatch(action);
        }, 2000);
    }, [haveNoti]);

    const onBellClick = () => {
        setShowNoti(true);
    }

    const handleAcceptFr = (fromId, toId, notiId) => {
        API.acceptNoti({ fromId, toId, notiId })
            .then(res => {
                let action = setListNoti(res.data.result);
                dispatch(action);
            }).catch(err => console.log(err));
    }

    const handleDeniedFr = (notiId) => {
        // API
    }

    const handleNotiClick = (notiId) => {
        socket.emit("UserSeenNoti", { notiId });
    }

    return (
        <div className={`absolute z-20 bg-secondary text-primary flex-none w-full md:w-96 h-screen pb-6 border-r-2 dark:border-gray-500 transform -translate-x-full md:translate-x-0 md:relative ${showLeft ? 'slide-in' : 'slide-out-X'}`}>
            <div>
                <div className="px-4 flex flex-col justify-between items-center py-4 dark:border-gray-500">
                    <div className="mx-auto mb-3">
                        {isDark() ? <img src={DARKLOGO} alt="logo" /> : <img src={LOGO} alt="logo" />}
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className="p-2 bg-primary rounded-lg" onClick={e => setTheme(!isDark() ? "dark" : "light")}>
                            {!isDark() && <DarkIcon className="w-5 h-5 fill-current animate__animated animate__fadeIn" />}
                            {isDark() && <LightIcon className="w-5 h-5 fill-current animate__animated animate__fadeIn" />}
                        </div>
                        <div>
                            <div className={`relative z-10 p-2 bg-primary rounded-lg block focus:outline-none ${haveNoti && "animate__animated animate__headShake animate__infinite"} cursor-pointer`} onClick={onBellClick} ref={notiRef}>
                                <BellIcon className="h-5 w-5 text-primary fill-current" />
                                <div className={`absolute top-1 right-0.5 w-2 h-2 bg-red-600 rounded-full animate-pulse ${(listNoti.length === 0 || checkedNoti) && "hidden"}`}></div>
                                <div className={`absolute right-1/2 transform translate-x-1/2 mt-4 px-3 bg-primary rounded-md shadow-2xl overflow-hidden z-20 w-80 ${!showNoti && "hidden"}`}>
                                    <div className="">
                                        {
                                            listNoti.map((noti, i) => {
                                                return <div className={`relative bg-primary flex items-center py-3 hover:opacity-60 animate__animated animate__fadeIn ${(listNoti.length > 1 && i !== listNoti.length - 1) && "border-b"}`} key={i} onClick={() => handleNotiClick(noti.id)}>

                                                    <div className={`w-2 h-2 bg-red-600 rounded-full animate-pulse ${noti.seen && "hidden"}`}></div>
                                                    <img className="h-8 w-8 rounded-full object-cover mx-3" src={noti.fromUser.avatar} alt="avatar" />
                                                    <div className="flex flex-col flex-1">
                                                        <p className="text-primary text-sm">
                                                            <span className="font-bold">{noti.fromUser.name}</span>
                                                            <br></br>
                                                            {
                                                                noti.type === 'send' ?
                                                                    " want to become your friend"
                                                                    : " accepted your request"
                                                            }
                                                        </p>
                                                    </div>
                                                    {
                                                        noti.type === 'send' &&
                                                        <div className="flex flex-col">
                                                            <div
                                                                onClick={() => handleAcceptFr(noti.fromId, noti.toId, noti.id)}
                                                                className="text-sm mx-2 mb-1 p-1 rounded-lg dark:bg-gray-600 bg-secondary cursor-pointer">
                                                                ✔
                                                            </div>
                                                            <div className="text-sm mx-2 mb-1 p-1 rounded-lg dark:bg-gray-600 bg-secondary cursor-pointer">❌</div>
                                                        </div>
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className={`block bg-primary ${listNoti.length > 0 && "border-t"} text-primary text-center font-bold py-2`}>
                                        {listNoti.length > 0 ? "See all notifications" : "Nothing"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`text-primary focus:outline-none hover:opacity-100 cursor-pointer`} ref={menuRef}>
                            <div className={`relative block p-2 bg-primary rounded-lg focus:outline-none hover:opacity-50 ${showMenu && "opacity-50"}`} onClick={() => setShowMenu(true)}>
                                <SettingIcon className="h-5 w-5 text-primary fill-current" />
                            </div>

                            <div className={`absolute right-4 mt-2 py-2 w-48 bg-primary rounded-md shadow-xl z-20 header ${!showMenu && "hidden"} animate__animated  animate__fadeIn animate__faster`}>
                                <div className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:opacity-50" onClick={() => setShowProfile(true)}>
                                    your profile
                                </div>
                                <div className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:opacity-50">
                                    Your projects
                                </div>
                                <div className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:opacity-50">
                                    Help
                                </div>
                                <div className="block px-4 py-2 text-sm border-b capitalize text-primary hover:bg-primary hover:opacity-50">
                                    Settings
                                </div>
                                <div className="block px-4 py-2 text-sm capitalize text-primary hover:bg-primary hover:opacity-50">
                                    Sign Out
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8" ref={searchFrRef}>
                <div className="px-4 mb-2 text-white flex justify-between items-center">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border w-full border-grey dark:border-gray-500 rounded-lg bg-primary pl-8 pr-4 py-2 text-primary focus:outline-none"
                            value={searchFriend}
                            onChange={onSearchFriend}
                            onFocus={onInputFocus}
                        />
                        <div className="absolute top-3 right-3 pl-3 flex items-center justify-center">
                            {
                                searchingFriend ?
                                    <CancelIcon className="fill-current text-gray-500 h-4 w-4 cursor-pointer" onClick={() => { setSearchingFriend(false); setSearchFriend("") }} />
                                    :
                                    <SearchIcon className="fill-current text-gray-500 h-4 w-4" />
                            }
                        </div>
                    </div>
                </div>
                {
                    loadingFr
                        ?
                        <Loading />
                        :
                        searchingFriend
                            ?
                            <ListSearchFriends />
                            :
                            <ListFriends onFriendClick={onFriendClick} />
                }
            </div>
            <button onClick={handleLogout} className="absolute bottom-10 inset-x-1/2 transform -translate-x-2/4 bg-gradient-to-b from-gray-400 to-gray-500  text-white font-bold py-2 px-4 rounded-lg uppercase text-sm  shadow-xl focus:outline-none">
                Logout
            </button>
        </div>
    )
}

export default ChatPageLeft;