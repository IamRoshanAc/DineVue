
import '../../style/Home.css'
import Footer from '../../components/footer'

import IndexPopularSlider from '../../components/Index_Popular'
import IndexNewSlider from '../../components/Index_New'
import IndexTopSlider from '../../components/Index_Top'
import ApprovedSlider from '../../components/approved'
import NotApprovedSlider from '../../components/Notapproved'
import NavbarAdmin from '../../components/adminNav'
const Index = () =>{


return(
<>

<NavbarAdmin/>
<br/>
<ApprovedSlider/>
<br/>
<NotApprovedSlider/>
<br/>
<Footer/>
</>
)
}

export default Index;