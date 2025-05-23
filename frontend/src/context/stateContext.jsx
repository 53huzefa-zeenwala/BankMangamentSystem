import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const Context = createContext()
export const StateContext = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [userAvailable, setUserAvailable] = useState(null)
    async function isUserAvailable() {
        try {
            const isUser = await axios.get("http://localhost:8000/api/user/isAvailable", { withCredentials: true })
            console.log(isUser, isUser.data);
            if (isUser.data === true) {
                setUserAvailable(true)
            } else {
                setUserAvailable(false)
            }
        } catch (error) {
            console.log(error)
            setUserAvailable(false)
        } 
    }
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
        isUserAvailable()
    }, [currentUser]);
    const [alert, setAlert] = useState({ isShow: false, duration: 3000, message: "", type: "" })
    return (
        <Context.Provider value={{
            alert,
            setAlert,
            setCurrentUser,
            currentUser,
            userAvailable
        }}>
            {children}
        </Context.Provider>
    )
}
export const useStateContext = () => useContext(Context);