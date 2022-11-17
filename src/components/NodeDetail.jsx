import Divider from '@mui/material/Divider';
import objectArray2ArrayByKey from '../objectArray2ArraybyKey';
import CloseIcon from '@mui/icons-material/Close';
import {useRef, useState} from 'react';
import { Link, Outlet } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';

const NodeDetail = ({detail, isOpenMenu, setIsOpenMenu, loadidng, setLoading, reloading, setReloading}) => {
    const escapeDoi = (doi) => {

        if(doi !== undefined) {
            
            return doi.replaceAll('.', '_').replaceAll('/', '-');
        } else {
            return doi;
        }
      }

      console.log(detail)
    return(
          
        <section className ="message is-info is-12" style={{position:'relative' ,top:'20px', height :isOpenMenu?`${window.innerHeight * 0.8}px`:'0px',overflowY: 'scroll', transitionDuration: '.2s'}} >

        <div className="message-header">
            <div className = "wrapper">
                <h1 className="title is-5"  >論文詳細</h1>
            </div>

            <IconButton aria-label="delete" onClick={() => setIsOpenMenu(!isOpenMenu)}>
                <KeyboardArrowDownIcon/>
            </IconButton>
        </div>

        
        <div className="message-body">
            
            <a href = {detail.html_url} target="_black" rel = "external"><h1 className='title is-info is-4'>{detail.title}</h1></a>
            <br/><br/>
            
            {/*<h2 className='subtitle'>{detail.author}</h2>*/}

            {/*console.log(detail.author)*/}
           {detail.author === undefined || <ul>
            {detail.author.map((element) => {
                //console.log(element);
                return element["url"] !== null?<a href = {element.url} target="_black" rel = "external"> <li>{element.name}</li></a>:<li>{element.name}</li>;
            })}
           </ul>
           }
           {/*console.log(detail.author) */}

           <br/>
           {detail.keyword === undefined || 
            <p>{objectArray2ArrayByKey(detail.keyword, 'keyword').join(',')}</p>
            
           }

           <Link to = {`/network/${escapeDoi(detail.doi)}`} onClick={() => setReloading(!reloading)}> generate a network out of this paper</Link>

            <Divider/><br/>
            abstract:<br/>
            {detail.abstract}
            
        </div>

    </section>
    );
}

export default NodeDetail;