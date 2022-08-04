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
import { useEffect,useState } from "react";


      //論文のauthor_idを取得 このテーブル消すかも。タイムアウトしなければ直接authorを検索できるようにする。
      //const response = await fetch(`/.netlify/functions/api/authorsearch/${encoded}`);
      
      //author_idからauthorの情報の検索
      const response = await fetch(`/.netlify/functions/api/authors/${author_id}`);
      const data = await response.json();
      setData(data);
    })();
    }, []);

    console.log(data);
    return (
        <div>
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