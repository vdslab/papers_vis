import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import {useRef, useState} from 'react';


const NodeDetail = ({detail, isOpenMenu, setIsOpenMenu}) => {


   
    return(
          
        <section className ="message is-info is-12" style={{width:'45%', height :isOpenMenu?`${window.innerHeight * 0.6}px`:'0px',overflowY: 'scroll', transitionDuration: '.5s'}} >

        <div className="message-header">
            <h1 className="title is-6" style = {{position:'relative', top : '12px'}}>論文詳細</h1>
            <CloseIcon onClick = {() => setIsOpenMenu(!isOpenMenu)}/>
        </div>

        
        <div className="message-body">
            
            <a href = {detail.url} target="_black"><h1 className='title is-info'>{detail.title}</h1></a>
            <br/><br/>
            
            <h2 className='subtitle'>{detail.author}</h2>
            <Divider/><br/>
            abstract:<br/>
            {detail.abstract}
            
        </div>

    </section>
    );
}

export default NodeDetail;