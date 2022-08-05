import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import ScrollTop from "./components/Scrolltop";
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
    //   const response = await fetch(`/.netlify/functions/api/authors/${target_encoded}`);
    //   const data = await response.json();
    //   setData(data);

    //   const response = await fetch(`/.netlify/functions/api/authors/${author_id}`);
    //   const data = await response.json();

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
    //const [data, setData] = useState([]);
    useEffect(() => {
        /*
    (async () => {
    //検索されたdoiとauthor_id
      const doi = "10.1109/MCOM.1977.1089436"
      const encoded = encodeURIComponent(doi);
      const author_id = 17513;//26143,72400
      //選択された論文のdoiで類似度top10の検索
      const response = await fetch(`/.netlify/functions/api/papers/${encoded}`);
    
      //類似度が高いdoi
      const target_doi = "10.1109/35.166648";
      const target_encoded = encodeURIComponent(target_doi);
      //選択した論文と類似度が高い論文の内容の検索
      //const response = await fetch(`/.netlify/functions/api/papers/${target_encoded}`);
    //const response = await fetch(`/.netlify/functions/api/authors/${author_id}`);
    const data = await response.json();
    console.log(data);
    setData(data);
    })();
    */
    }, []);

    return (
            <BrowserRouter>
                <ScrollTop />
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