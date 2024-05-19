import React from 'react'
import { useStateContext } from '../context/stateContext'

export default function Header() {
    const {currentUser} = useStateContext()
    return (
        <header aria-label="Page Header">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="text-left sm:flex justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Welcome Back, {currentUser?.userName}!   
                        </h1>
                    </div>


                    <div className="mt-4 flex gap-4 sm:mt-0 justify-end sm:justify-center flex-row sm:items-center">

                        <a
                            className="block rounded-lg bg-teal-600 border-2 border-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:text-teal-600 hover:bg-gray-100 focus:outline-none focus:ring"
                            href='createtransaction'
                        >
                            Create Transaction
                        </a>
                        
                    </div>
                </div>
            </div>
        </header>
    )
}
