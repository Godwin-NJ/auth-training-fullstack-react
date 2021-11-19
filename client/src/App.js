import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useHistory
} from "react-router-dom";

import PrivateRoute from './components/routing/privateRoute'

import PrivateScreen from './components/screens/PrivateScreen'
import LoginScreen from './components/screens/LoginScreen'
import RegisterScreen from './components/screens/RegisterScreen'
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen'
import ResetPasswordScreen from './components/screens/ResetPasswordScreen'

const  App = () => {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' 
          element={
          <PrivateRoute >
            <PrivateScreen />
          </PrivateRoute >
          }/>
        <Route exact path="/login" element={<LoginScreen/>} />
        <Route exact path="/register" element={<RegisterScreen/>} />
        <Route exact path="/forgotpassword" element={<ForgotPasswordScreen/>} />
        <Route exact path="/passwordreset/:resetToken" element={<ResetPasswordScreen/>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
