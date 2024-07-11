
import '../style/Home.css'
import Footer from '../components/footer'
import SearchBar from '../components/Search'
import PopularSlider from '../components/PopularSlider'
import TopSlider from '../components/TopSliders'
import NewSlider from '../components/NewSlider'
import NavbarIndex from '../components/navbar_index'
import IndexPopularSlider from '../components/Index_Popular'
import IndexNewSlider from '../components/Index_New'
import IndexTopSlider from '../components/Index_Top'
const Index = () =>{


return(
<>
<NavbarIndex/>
<SearchBar/>
<br/>
<IndexPopularSlider/>
<br/>
<IndexNewSlider/>
<br/>
<IndexTopSlider/>
<br/>
<br/>
<br/>
<Footer/>
</>
)
}

export default Index;