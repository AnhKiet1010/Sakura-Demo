import { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

import LoadingImg from '../../icons/loading.gif';
import TypingImg from '../../icons/typing.svg';
import ListMessages from '../ListMessages';

function InfiniteScroll({ fetchMoreMess, hasMoreTop, hasMoreBot, loadingBottom, loadingTop, currentUser, limit, slideImages }) {
    const messagesEndRef = useRef(null);
    const typing = useSelector(state => state.typing);

    useEffect(() => {

        scrollToBottom();

    }, []);

    const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleScroll(e) {
        let element = e.target;

        // do something at top of scroll
        if (hasMoreTop && Math.ceil(element.scrollHeight + element.scrollTop) === Math.ceil(element.clientHeight) + 1) {
            fetchMoreMess('top');
        }
        if (hasMoreBot && element.scrollTop === 1) {
            // do something at end of scroll
            fetchMoreMess('bot');
        }
    }


    return (
        <div className="w-full flex-1 flex px-4 pt-8 flex-col-reverse overflow-y-scroll overflow-x-hidden" id="scrollAbleDiv" onScroll={handleScroll}>
            { (typing.state && typing.id === currentUser._id ) && <div className="flex items-center bg-secondary -mx-4 px-3 max-w-max py-1 text-primary opacity-70 animate__animated animate__fadeIn">{currentUser.name} is typing<img src={TypingImg} alt="loading" className="w-10 h-6" /></div>}
            {limit === 15 && <div ref={messagesEndRef} className="" />}
            {
                hasMoreBot && loadingBottom && <span className="text-primary opacity-75 py-4 flex  justify-center mx-auto items-center relative w-10 h-6">
                    <img src={LoadingImg} alt="loading" />
                </span>
            }
            <ListMessages currentUser={currentUser} slideImages={slideImages} />
            {hasMoreTop && loadingTop && <span className="text-primary opacity-75 py-8 flex justify-center mx-auto items-center relative w-10 h-6">
                <img src={LoadingImg} alt="loading" />
            </span>
            }
            {!hasMoreTop && limit > 15 && <div className="flex py-8 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-primary w-full">
                    Yay! You have seen it all
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
            </div>
            }
        </div>
    );
}

export default InfiniteScroll;