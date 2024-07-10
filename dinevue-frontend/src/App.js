
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'


// for showing toast messages
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import RegistrationPage from './pages/register';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Restaurant_View from './pages/Restaurant_view';
import Index from './pages/Index';
import RestaurantReg from './pages/restaurant/RestaurantReg';
import AdminDashboard from './pages/admin/dashboard';
import RestaurantLog from './pages/restaurant/RestaurantLog';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      {/* <ToastContainer> */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={< Index/>} />
        <Route path='/home' element={<Home/>} />
        <Route path="/restaurant_view/:id" element={<Restaurant_View />} />
        <Route path='/profile' element={<Profile/>} />

        {/* restaurants */}
        <Route path='/restaurant_reg' element={<RestaurantReg/>} />
        <Route path='/restaurant_log' element={<RestaurantLog/>} />

        {/* admin */}
        <Route path='/admin_dashboard' element={<AdminDashboard/>} />

        {/* <Route element={<UserRoutes/>}>
        <Route path='/profile' element={<Profile/>} />

        </Route> */}

        {/* <Route element={<AdminRoutes />}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
   
          
        </Route> */}

      </Routes>
      
    </Router>
    // {/* </ToastContainer> */}
  );
}

export default App;
