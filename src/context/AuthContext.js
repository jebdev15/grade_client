import React from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

export const AuthContext = React.createContext();
export const AuthContextProvider = ({ children }) => {
    const [cookies] = useCookies(['token'])
    const isAuthenticated = Boolean(cookies.token)
    const navigate = useNavigate()
    return (
        <AuthContext.Provider>
            { children }
        </AuthContext.Provider>
    )
}
