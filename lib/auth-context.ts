import { createContext } from "react";

const AuthContext = createContext<any>({
    user: {
        accessToken: null,
        id: null,
        email: null,
        name: null,
        is_pro: false,
    },
    updateUser: () => null,
})

export default AuthContext