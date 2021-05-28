
import Highlighter from "react-highlight-words";
import { formatTime, formatText } from '../../helpers/format';

function Self({ text, seen, time, word }) {

    const calcTime = formatTime(time);

    const arr = [];
    arr.push(word);
    var content = "";

    if(typeof(formatText(text)) == 'array') {
        content = formatText(text).join(' ');
    } else {
        content = text;
    }

    return (
        <div className="flex flex-row-reverse justify-start items-end mb-4 text-sm">
            <p className="text-gray-800 leading-normal bg-green-200 rounded-lg px-4 py-3 m-0 max-w-lg">
                <Highlighter
                    highlightClassName="YourHighlightClass animate-pulse"
                    searchWords={arr}
                    autoEscape={true}
                    textToHighlight={content}
                />
            </p>
            <div className="flex flex-col items-end">
                {seen && <span className="text-gray-200 text-xs mx-2">✔</span>}
                <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
            </div>
        </div>
    )
}

export default Self;