import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import "bulma/css/bulma.css";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Network from "./pages/network";
import * as d3 from 'd3';

export default function App() {
    let a = d3.select();
    return (
        <div>

            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <Main/> } />
                    <Route path = "/network" element = {<Network/>} />
                    <Route path = '/help' element = {<div>help</div>}/>
                    <Route path = "*" element = {<NotFound/>} />
                </Routes>
            </BrowserRouter>
            
            <Footer />
        </div>
    );
  }