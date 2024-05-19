import React from 'react'

export default function Steps({progress}) {
    return (
        <div className='px-6 pt-6 pb-2 absolute top-0 left-0 right-0 z-10 bg-gray-50'>
            <h2 className="sr-only">Steps</h2>
            <div>
                <div className="overflow-hidden rounded-full bg-gray-200">
                    <div style={{width: `${progress * 50}%`}} className="h-2 rounded-full bg-teal-500"></div>
                </div>

                <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
                    <li className="flex items-center justify-start text-teal-600">
                        <span className="hidden sm:inline"> Sign Up </span>

                        <svg
                            className="h-6 w-6 sm:ml-2 sm:h-5 sm:w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                            />
                        </svg>
                    </li>

                    <li style={{color: progress > 0 ? 'rgb(13, 148, 136)' : 'inherit'}} className="flex items-center justify-center text-teal-600">
                        <span className="hidden sm:inline"> Create Account </span>

                        <svg
                            className="h-6 w-6 sm:ml-2 sm:h-5 sm:w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22,11V7.83L12,2.06,2,7.83V11H4v8H2v2H22V19H20V11ZM4,9l8-4.62L20,9H4ZM6,19V11H8v8Zm4,0V11h4v8Zm8,0H16V11h2Z"/>
                        </svg>
                    </li>

                    <li style={{color: progress > 1 ? 'rgb(13, 148, 136)' : 'inherit'}} className="flex items-center justify-end">
                        <span className="hidden sm:inline"> Create Transaction </span>

                        <svg
                            className="h-6 w-6 sm:ml-2 sm:h-5 sm:w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                    </li>
                </ol>
            </div>
        </div>

    )
}
