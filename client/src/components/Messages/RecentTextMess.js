function RecentTextMess({ read, time, text }) {
    return (
        <div className="flex items-start mb-4 text-sm">
            <div className="w-10 h-10 mr-3"></div>
            <div className="flex items-end">
                <p className="text-gray-800 leading-normal bg-gray-300 rounded-lg px-4 py-3 m-0">
                    {text}
                </p>
                <div className="flex flex-col items-start">
                    {read && <span className="text-gray-200 text-xs mx-2">✔</span>}
                    <span className="text-gray-500 text-xs mx-2">{time}</span>
                </div>
            </div>
        </div>
    );
}

export default RecentTextMess;