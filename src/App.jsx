import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "bulma/css/bulma.css";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Network from "./pages/network";

export default function App() {
    return (
        <div>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <Main/> } />
                    <Route path = "/network" element = {<Network/>} />
                </Routes>
            </BrowserRouter>
            
            <Footer />
        </div>
    );
  }