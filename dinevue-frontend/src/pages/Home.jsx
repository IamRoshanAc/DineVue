import Navbar from '../components/navbar'
import '../style/Home.css'
import Footer from '../components/footer'
import SearchBar from '../components/Search'
import PopularSlider from '../components/PopularSlider'
import TopSlider from '../components/TopSliders'
import NewSlider from '../components/NewSlider'
const Home = () =>{


return(
<>
<Navbar/>
<SearchBar/>
<br/>
<PopularSlider/>
<br/>
<TopSlider/>
<br/>
<NewSlider/>
<br/>
<br/>
<br/>
<Footer/>
</>
)
}

export default Home;