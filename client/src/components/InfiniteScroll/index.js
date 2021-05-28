import { useEffect, useRef, useState } from 'react';

import LoadingImg from '../../icons/loading.gif';
import ListMessages from '../ListMessages';

function InfiniteScroll({ listMessages, fetchMoreMess, hasMoreTop, hasMoreBot, loadingBottom, loadingTop, currentUser, word, skip }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {

        scrollToBottom();

    }, []);

    const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleScroll(e) {
        let element = e.target;

        // do something at top of scrol
        if (hasMoreTop && element.scrollHeight + element.scrollTop === element.clientHeight) {
            fetchMoreMess('top');
            scrollToBottom();
        }
        if (hasMoreBot && element.scrollTop === 0) {
            // do something at end of scroll
            fetchMoreMess('bot');
            scrollToBottom();
        }
    }



    return (
        <div className="pr-6 pl-8 pb-4 pt-10 flex-1 flex flex-col-reverse overflow-y-scroll h-full border-r-2 dark:border-gray-500" id="scrollAbleDiv" onScroll={handleScroll}>
            <div ref={messagesEndRef} className="mb=8" />
            {
                loadingBottom && <span className="text-primary opacity-75 py-4 flex  justify-center mx-auto items-center relative w-10 h-6">
                    <img src={LoadingImg} alt="loading" />
                </span>
            }
            <ListMessages listMessages={listMessages} currentUser={currentUser} word={word} />
            {loadingTop && <span className="text-primary opacity-75 py-8 flex justify-center mx-auto items-center relative w-10 h-6">
                <img src={LoadingImg} alt="loading" />
            </span>
            }
            {!hasMoreTop && <div className="flex py-8 items-center text-center">
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