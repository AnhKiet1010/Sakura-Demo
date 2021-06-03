import React from 'react';
import Popup from "reactjs-popup";
import Highlighter from "react-highlight-words";
import { formatTime, formatText } from '../../helpers/format';

import { CancelIcon } from '../../icons';
import 'reactjs-popup/dist/index.css';


function MessFilterPopup({
    showListFilterMess,
    listMessFilter,
    handleSearchPress,
    word,
    handleWordChange,
    onClose,
    currentUser,
    searchLimit,
    searchSkip,
    searchTotal,
    handleChangeLimitSearch,
    handleChangeSkipPrev,
    handleChangeSkipNext
}) {

    return (
        <Popup open={showListFilterMess} closeOnDocumentClick={false} className="my-popup">
            <div className="relative px-6 py-4 bg-primary">
                <CancelIcon className="absolute w-8 h-8 -top-3 -right-3 text-black bg-white p-2 rounded-full z-10 cursor-pointer" onClick={onClose} />
                <div className="mb-2 flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-primary">Search Messages</h2>
                </div>
                <div className="mt-4 flex sm:flex-row flex-col">
                    <div className="flex flex-row mb-1 sm:mb-0">
                        <div className="relative">
                            <select onChange={handleChangeLimitSearch} className="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="block relative">
                        <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                                </path>
                            </svg>
                        </span>
                        <input
                            placeholder="Search" type="text" value={word}
                            onChange={handleWordChange}
                            onKeyDown={handleSearchPress}
                            className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
                    </div>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                    <div className="inline-block w-full shadow overflow-hidden">
                        <table className="text-left w-full">
                            <thead className="w-full bg-gray-300 dark:bg-gray-700 text-primary">
                                <tr className="flex w-full">
                                    <th className="p-4 w-1/6">User</th>
                                    <th className="p-4 w-4/6">Message</th>
                                    <th className="p-4 w-1/6 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-primary text-primary flex flex-col items-center overflow-y-scroll w-full h-80">
                                {
                                    listMessFilter.length > 0 ?
                                        listMessFilter.map((mess, i) => {
                                            let arr = [];
                                            arr.push(word);
                                            let content = formatText(mess.content).map((c, index) => {
                                                return <Highlighter
                                                    key={index}
                                                    highlightClassName="YourHighlightClass animate-pulse dark:bg-gray-600 dark:text-white"
                                                    searchWords={arr}
                                                    autoEscape={true}
                                                    textToHighlight={c.props.children[0]}
                                                />
                                            })
                                            return <tr key={i} className={`w-full px-5 py-5 ${i !== listMessFilter.length - 1 ? "border-b" : ""} border-gray-200`}>
                                                <td className="text-sm w-1/6">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img className="w-full h-full rounded-full" src={currentUser.avatar} alt="img" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="whitespace-no-wrap">
                                                                {currentUser.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-sm w-full">
                                                    <p className="whitespace-no-wrap">
                                                        {content}</p>
                                                </td>
                                                <td className="text-sm w-2/3">
                                                    <p className="whitespace-no-wrap pl-4">
                                                        {formatTime(mess.time)}
                                                    </p>
                                                </td>
                                            </tr>
                                        }) : <div className="py-4">❌ Not Data Match Keyword ❌</div>
                                }
                            </tbody>
                        </table>

                    </div>
                    <div className="px-5 py-5 bg-primary flex flex-col xs:flex-row items-center xs:justify-between">
                        <span className="text-xs xs:text-sm text-primary">
                            Showing {searchTotal === 0 ? 0 : searchSkip === 0 ? 1 : searchSkip + 1} to {searchTotal < searchLimit ? searchTotal : searchTotal < (searchSkip + 1 + searchLimit) ? searchTotal : searchSkip === 0 ? searchLimit : (searchSkip + searchLimit)} of {searchTotal} Entries
                            </span>
                        <div className="inline-flex mt-2 xs:mt-0">
                            <button
                                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 focus:outline-none"
                                disabled={searchSkip === 0}
                                onClick={handleChangeSkipPrev}
                            >
                                Prev
                                </button>
                            <button
                                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 focus:outline-none"
                                disabled={(searchSkip + searchLimit) < searchTotal ? false : true}
                                onClick={handleChangeSkipNext}
                            >
                                Next
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </Popup >
    )
}

export default MessFilterPopup;