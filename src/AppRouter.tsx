
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';

export const Navigation =() =>{
    return(
    <Router>
        <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/hom" Component={HomePage} />
            <Route path="/search" Component={SearchBooksPage} />
        </Routes>
    </Router>

    )
};