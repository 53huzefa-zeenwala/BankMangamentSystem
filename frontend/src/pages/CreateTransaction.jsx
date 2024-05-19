import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MainLayout, Steps } from '../components'
import { useStateContext } from '../context/stateContext'

export default function createTransaction() {
    const { setAlert, currentUser } = useStateContext()
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0)
    const [type, setType] = useState("credited")
    const [software, setSoftware] = useState("phonepe")
    const [method, setMethod] = useState("online")
    const [searchParam, getSearchParam] = useSearchParams()
    const navigate = useNavigate()
    async function addTransaction(e, redirect) {
        e.preventDefault()

        if (currentUser?.id && currentUser?.userAccount) {
            setAlert({ isShow: true, message: "User not found", duration: 3000, type: "error" })
            return navigate('/login')
        }
        if (type.length === 0 || method.length === 0) {
            return setAlert({ isShow: true, message: "Fill all necessary inputs", duration: 3000, type: "error" })
        }
        console.log({ software: method !== 'online' ? '' : software })
        try {
            const res = await axios.post('http://localhost:8000/api/transaction', { amount, type, method, software: method !== 'online' ? '' : software, description }, { withCredentials: true })
            setDescription('')
            setAmount(0)
            setType('credited')
            setMethod('online')
            setSoftware('phonepe')
            setAlert({ isShow: true, message: res.data, duration: 3000, type: "success" })
            redirect ? navigate('/') : navigate('/createTransaction')
            console.log(res)
        } catch (error) {
            setAlert({ isShow: true, message: error.message, duration: 3000, type: "error" })
        }
    }
    return (
        <MainLayout>
            {searchParam.get('redirect') && <Steps progress={2} />}

            <main style={{marginTop: searchParam.get('redirect') ? '2rem' : '0'}} className='flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6'>
                <div className="max-w-xl lg:max-w-3xl w-full">
                    <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">Create Transaction</h1>
                    <form action="" className="mt-8 grid grid-cols-6 gap-6">
                        <div className="inputSmallDiv">
                            <label htmlFor="amount" className="label">Amount</label>
                            <input type="number" name="amount" value={amount} onChange={e => setAmount(e.target.value)} className='input' required />
                        </div>
                        <div className="inputSmallDiv">
                            <fieldset className="flex flex-wrap gap-3">
                                <legend className="label pb-1">Type</legend>

                                <div>
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="credited"
                                        id="credited"
                                        className="peer hidden [&:checked_+_label_svg]:block"
                                        checked={type === 'credited'}
                                        onChange={e => setType(e.target.value)}
                                    />

                                    <label
                                       htmlFor="credited"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 py-2 px-3 text-gray-900 hover:border-gray-200 peer-checked:border-teal-500 peer-checked:bg-teal-500 peer-checked:text-white shadow-sm"
                                    >
                                        <svg
                                            className="hidden h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        <p className="text-sm font-medium">Credited</p>
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="debited"
                                        id="debited"
                                        className="peer hidden [&:checked_+_label_svg]:block"
                                        checked={type === 'debited'}
                                        onChange={e => setType(e.target.value)}
                                    />

                                    <label
                                       htmlFor="debited"
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 py-2 px-3 text-gray-900 hover:border-gray-200 peer-checked:border-teal-500 peer-checked:bg-teal-500 peer-checked:text-white shadow-sm"
                                    >
                                        <svg
                                            className="hidden h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        <p className="text-sm font-medium">Debited</p>
                                    </label>
                                </div>
                            </fieldset>
                        </div>

                        <div className="inputSmallDiv">
                            <label htmlFor="paymentMethod" className="label">Method</label>
                            <select name="method" id="paymentMethod" required className='input' value={method} onChange={e => setMethod(e.target.value)}>
                                <option value="online">Online</option>
                                <option value="cash">Cash</option>
                                <option value="check">Check</option>
                            </select>
                        </div>
                        <div className="inputSmallDiv">
                            <label htmlFor="interest" className="label">Software</label>
                            <select disabled={method !== "online"} value={software} onChange={e => setSoftware(e.target.value)} name="interest" id="interest" className='input'>
                                <option value="phonepe">PhonePe</option>
                                <option value="googlePay">Google Pay</option>
                                <option value="paytm">Paytm</option>
                                <option value="bTob">Bank to bank</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="message" className="label">Message</label
                            ><textarea
                                name="message"
                                id="message"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                minLength="10"
                                rows="5"
                                maxLength="264"
                                placeholder="Tell us about your consult"
                                className='input'
                            ></textarea>
                        </div>
                        <div className="col-span-6 flex gap-4 flex-col md:flex-row md:justify-between">
                            <button className='secondaryButton' onClick={e => addTransaction(e, false)}>Add More</button>
                            <button className='primaryButton' onClick={e => addTransaction(e, true)}>Save and Return Home</button>
                        </div>
                    </form>
                </div>
            </main>
        </MainLayout>
    )
}
