import React from 'react';


function ThemedSuspense() {
    return (
        <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50 flex items-center justify-center">
            <span className="text-green-500 opacity-75 mx-auto block relative">
                <i className="fas fa-circle-notch fa-spin fa-5x" />
            </span>
        </div>
    )
}

export default ThemedSuspense;