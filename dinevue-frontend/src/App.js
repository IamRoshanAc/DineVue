
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
import Index_Restaurant_View from './pages/Index_Restaurant_View';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import Review from './pages/Review';
import FAQ from './pages/Faq';
import DetailsUpdate from './components/restaurant/DetailsUpdate';
import AboutUs from './pages/AboutUs';
import SearchView from './pages/SearchView';
import AdminLog from './pages/admin/admin_login';


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
        <Route path='/index_restaurant_view/:id' element={<Index_Restaurant_View/>} />
        <Route path='/review/:id' element={<Review/>} />
        <Route path='/faqs' element={<FAQ/>} />
        <Route path='/aboutUs' element={<AboutUs/>} />
        <Route path='/search' element={<SearchView/>} />

        {/* restaurants */}
        <Route path='/restaurant_reg' element={<RestaurantReg/>} />
        <Route path='/restaurant_log' element={<RestaurantLog/>} />
        <Route path='/restaurant_dashboard' element={<RestaurantDashboard/>} />

        {/* admin */}
        <Route path='/admin_log' element={<AdminLog/>} />
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
