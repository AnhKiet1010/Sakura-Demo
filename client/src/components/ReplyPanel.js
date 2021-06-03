
import { CancelIcon, ReplyIcon } from "../icons";

function ReplyPanel({ currentUser, text, close }) {
    return (
        <div className="w-full pl-8 pr-5 py-2">
            <div className="relative bg-gray-300 dark:bg-gray-500 text-primary rounded-xl px-6 py-2">
                <div className="border-l-2 border-blue-600 pl-2">
                    <div className="flex items-center">
                        <div className="text-3xl text-primary pr-2 focus:outline-none cursor-pointer">
                            <ReplyIcon className="fill-current h-5 w-5 block hover:text-secondary" />
                        </div>
                        Reply to <span className="font-bold mx-2">{currentUser.name}</span>
                    </div>
                    <div className="text-primary opacity-75">{text}</div>
                </div>
                <div className="absolute bg-primary top-2 right-2 p-2 cursor-pointer rounded-full" onClick={close}>
                    <CancelIcon className="fill-current h-2 w-2 block hover:text-secondary" />
                </div>
            </div>
        </div>
    )
}

export default ReplyPanel;