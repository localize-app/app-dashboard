import { createContext, useState } from 'react';

export let UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [userCount, setUserCount] = useState(null);

  return (
    <UserContext.Provider value={{ userCount, setUserCount }}>
      {children}
    </UserContext.Provider>
  );
}
