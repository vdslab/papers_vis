import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import "bulma/css/bulma.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";
import Network from "./pages/network";
import * as d3 from 'd3';


const Layout = ({children}) => {
    return(
        <>
            <Header />
                <Outlet />
            <Footer/>
        </>
    );
}
export default function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Layout />}>
                        <Route index element = {<Main />} />
                        <Route path = "network" element = {<Network />} />
                        <Route path = "help" element = {<p>f</p>} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    
                </Routes>
            </BrowserRouter>
    );
  }