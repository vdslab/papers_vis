import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import {useRef, useState} from 'react';


const NodeDetail = ({detail}) => {
    const [isOpenMenu, setIsOpenMenu] = useState(true);
    const closeEl = useRef(null);
    const closeMenu = () => {
        menuEl.current.focus();
    }

    return(
          
        <section className ="message is-info is-12" style={{width:isOpenMenu?'45%':'0%', height :'500px',overflowY: 'scroll'}} >

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