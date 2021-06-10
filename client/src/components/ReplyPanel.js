
import { CancelIcon, ReplyIcon } from "../icons";
import { useSelector } from 'react-redux';

function ReplyPanel({ close }) {
    const currentUser = useSelector(state => state.currentUser);
    const touchingMess = useSelector(state => state.touchingMess);
    return (
        <div className="w-full px-4 py-2">
            <div className="relative bg-gray-300 dark:bg-gray-500 text-primary rounded-xl px-6 py-2">
                <div className="border-l-2 border-blue-600 pl-2">
                    <div className="flex items-center">
                        <div className="text-3xl text-primary pr-2 focus:outline-none cursor-pointer">
                            <ReplyIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                        </div>
                        <span className="font-bold text-sm">{touchingMess.self ? "You" : currentUser.name}</span>
                    </div>
                    <div className="text-primary opacity-75 w-full truncate text-sm">{touchingMess.mess.content}</div>
                </div>
                <div className="absolute bg-primary top-2 right-2 p-2 cursor-pointer rounded-full" onClick={close}>
                    <CancelIcon className="fill-current h-2 w-2 block hover:text-secondary" />
                </div>
            </div>
        </div>
    )
}

export default ReplyPanel;