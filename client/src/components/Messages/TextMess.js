import Highlighter from "react-highlight-words";
import { formatTime, formatText } from '../../helpers/format';

function TypeText({ avatar, seen, time, text, word }) {

    const calcTime = formatTime(time);

    const arr = [];
    arr.push(word);
    var content = "";

    if (typeof (formatText(text)) == 'array') {
        content = formatText(text).join(' ');
    } else {
        content = text;
    }

    return (
        <div className="flex items-start mb-4 text-sm">
            <img src={avatar} className="w-10 h-10 rounded-full mr-3" alt="avatar" />
            <div className="flex items-end">
                <p className="text-gray-800 leading-normal bg-gray-300 rounded-lg px-4 py-3 m-0 max-w-lg">
                    <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={arr}
                        autoEscape={true}
                        textToHighlight={content}
                    />
                </p>
                <div className="flex flex-col items-start">
                    {seen && <span className="text-gray-200 text-xs mx-2">✔</span>}
                    <span className="text-gray-500 text-xs mx-2">{calcTime}</span>
                </div>
            </div>
        </div>
    );
}

export default TypeText;