import '../App.css'
import Home from "./Home"
import AuthorList from "./AuthorList";
import AuthorId from './AuthorId';
import BookList from "./BookList";
import BookId from "./BookId";
import PublisherList from "./PublisherList";
import PublisherId from "./PublisherId";
import SearchLanding from "./SearchLanding";
import {Route, Routes, Link} from "react-router-dom"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/authors" element={<AuthorList/>} />
        <Route path="/authors/:id" element={<AuthorId/>} />
        <Route path="/books" element={<BookList/>}/>
        <Route path="/books/:id" element={<BookId/>}/>
        <Route path="/publishers" element={<PublisherList/>}/>
        <Route path="/publishers/:id" element={<PublisherId/>}/>
        <Route path="/search" element={<SearchLanding/>}/>
      </Routes>
      <br/>
      <Link to='/'>Home</Link> <br/>
      <Link to='/authors'>Authors</Link> <br/>
      <Link to='/books'>Books</Link> <br/>
      <Link to='/publishers'>Publishers</Link> <br/>
      <Link to='/search'>Search</Link>
    </div>
  )
}

export default App
