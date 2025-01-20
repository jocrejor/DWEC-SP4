import { Children, createContext,useState} from "react";

export const currentUserContext = createContext();


export const currentUserProvider = ({children}) =>{
    const [activeUser,setActiveUser] = useState({})

    const login = (us) => {
        setActiveUser(us)
    }

    const logout = () => {
        setActiveUser({})
    }
    return(
            <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
              {children}
            </AuthContext.Provider>
          );
    };
    


export const currentUserUse = () => {
    return useContext(currentUserContext );
  };
