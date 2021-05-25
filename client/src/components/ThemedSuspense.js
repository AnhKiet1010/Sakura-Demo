import React from 'react';


function ThemedSuspense() {
    return (
        <div className="w-full h-screen flex justify-center items-center p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
            <div className="">
                <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                </svg>
            </div>
        </div>
    )
}

export default ThemedSuspense;