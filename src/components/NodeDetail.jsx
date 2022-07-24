import Divider from '@mui/material/Divider';

const NodeDetail = ({detail}) => {
    return(
          
        <section className ="message is-info is-12" style={{width:'45%', height :'500px',overflowY: 'scroll'}} >

        <div className="message-header">
            <h1 className="title is-6">論文詳細</h1>
        </div>

        
        <div className="message-body">
            
            <h1 className='title is-info'>{detail.title}</h1>
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