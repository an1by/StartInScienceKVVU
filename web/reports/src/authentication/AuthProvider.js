import {createContext} from "react";
import Cookies from "universal-cookie";

const AuthContext = createContext();
localStorage.setItem("user", JSON.stringify({login: null, name: null, status: null}))

// Создаем компонент провайдера, который предоставляет данные контекста всем дочерним компонентам
export const AuthProvider = ({ children }) => {
    const signOut = () => {
        cookies.remove("reports_auth");
        sessionStorage.removeItem("user");
    }
    const cookies = new Cookies(null, { path: '/' });
    const isAuthenticated = () => {
        return sessionStorage.getItem("user") != null && cookies.get("reports_auth") != null
    }
    const getToken = () => {
        return cookies.get("reports_auth");
    }
    const getUser = () => {
        return JSON.parse(sessionStorage.getItem("user"));
    }
    const getStatusName = () => {
        if (isAuthenticated()) {
            switch (getUser().status) {
                case "cadet":
                    return "Кадет"
                case "teacher":
                    return "Преподаватель"
                case "admin":
                    return "Администратор"
            }
        }
        return "";
    }
    const signIn = (token, user) => {
        cookies.set("reports_auth", token);
        sessionStorage.setItem("user", JSON.stringify(user));
    };

    // Возвращаем контекст провайдера, передавая значения isAuthenticated и setAuth в качестве значения контекста
    return (
        <AuthContext.Provider value={{getUser, getToken, getStatusName, isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;