import { createContext, useState } from 'react';
import Image01 from '../images/user-36-05.jpg';
import Image02 from '../images/user-36-06.jpg';
import Image03 from '../images/user-36-07.jpg';
import Image04 from '../images/user-36-08.jpg';
import Image05 from '../images/user-36-09.jpg';

export const team = [
  {
    id: '0',
    image: Image01,
    name: 'Alex Shatov',
    email: 'alexshatov@gmail.com',
    role: 'Owner',
  },
  {
    id: '1',
    image: Image02,
    name: 'Philip Harbach',
    email: 'philip.h@gmail.com',
    role: 'Member',
  },
  {
    id: '2',
    image: Image03,
    name: 'Mirko Fisuk',
    email: 'mirkofisuk@gmail.com',
    role: 'Admin',
  },
  {
    id: '3',
    image: Image04,
    name: 'Olga Semklo',
    email: 'olga.s@cool.design',
    role: 'Member',
  },
  {
    id: '4',
    image: Image05,
    name: 'Burak Long',
    email: 'longburak@gmail.com',
    role: 'Admin',
  },
];

export let UsersContext = createContext(null);

export default function UsersContextProvider({ children }) {
  let [users, setUsers] = useState(team);

  return (
    <UsersContext.Provider value={{ users }}>{children}</UsersContext.Provider>
  );
}
