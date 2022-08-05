import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import {useRef, useState} from 'react';


const NodeDetail = ({detail, isOpenMenu, setIsOpenMenu}) => {

    const authors = typeof detail.author === undefined || [];
    console.log("#####");
    console.log(detail.author);
    return(
          
        <section className ="message is-info is-12" style={{width:'45%', height :isOpenMenu?`${window.innerHeight * 0.7}px`:'0px',overflowY: 'scroll', transitionDuration: '.3s'}} >

        <div className="message-header">
            <h1 className="title is-5" >論文詳細</h1>
            
        </div>

        
        <div className="message-body">
            
            <a href = {detail.html_url} target="_black" rel = "external"><h1 className='title is-info is-4'>{detail.title}</h1></a>
            <br/><br/>
            
            {/*<h2 className='subtitle'>{detail.author}</h2>*/}

            {console.log(detail.author)}
           {detail.author === undefined || <ui>
            {detail.author.map((element) => {
                return <a href = {element.url} target="_black" rel = "external"> <li>{element.name}</li></a>
            })}
           </ui>
           }
           {console.log(detail.author)}
       

            <Divider/><br/>
            abstract:<br/>
            {detail.abstract}
            
        </div>

    </section>
    );
}

export default NodeDetail;