import '../App.css'
import Home from "./Home"
import Events from "./Events"
import Attractions from "./Attractions"
import Venues from "./Venues"
import EventCard from "./EventCard"
import AttractionCard from "./AttractionCard"
import VenueCard from "./VenueCard"
import {Route, Routes, Link} from "react-router-dom"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/events/page/:page" element={<Events/>} />
        <Route path="/attractions/page/:page" element={<Attractions/>} />
        <Route path="/venues/page/:page" element={<Venues/>} />
        <Route path="/events/:id" element={<EventCard/>} />
        <Route path="/attractions/:id" element={<AttractionCard/>} />
        <Route path="/venues/:id" element={<VenueCard/>} />
      </Routes>
      <br/>
      <Link to='/'>Home</Link> <br/>
      <Link to='/events/page/1'>Events</Link>
      <br/>
      <Link to='/attractions/page/1'>Attractions</Link>
      <br/>
      <Link to='/venues/page/1'>Venues</Link>
    </div>
  )
}

export default App
