import Navbar from '../components/navbar'
import '../style/Home.css'
import Footer from '../components/footer'
import SearchBar from '../components/Search'
import PopularSlider from '../components/PopularSlider'
import TopSlider from '../components/TopSliders'
import NewSlider from '../components/NewSlider'
import Noscrollnav from '../components/noscroll'
const Home = () =>{


return(
<>
<Noscrollnav/>
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