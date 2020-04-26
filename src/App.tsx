import React, {FC, useState} from 'react';
import Authenticate, { CLIENT_ID } from './Authenticate';
import Main from './Main';

const App: FC<{}> = () => {
  const [isLogged, setIsLogged] = useState<boolean>(() => !!localStorage.getItem(CLIENT_ID));
  return isLogged ? <Main /> : <Authenticate setIsLoggedIn={setIsLogged} />;
};
export default App;
