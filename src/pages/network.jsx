import Divider from '@mui/material/Divider';
import { TabScrollButton } from '@mui/material';

const Network = () => {
    return(
        <section style={{display:'flex', margin: '20px'}}>

            <div style={{width:'55%'}}>
                <svg viewBox="0 0 200 100" width = "350" height = "200">
                    <circle cx="10" cy="10" r="10"/>
                    <circle cx="30" cy="50" r="10"/>
                    <circle cx="50" cy="70" r="10"/>
                    <circle cx="40" cy="90" r="10"/>
                    <circle cx="90" cy="70" r="10"/>
                    <circle cx="100" cy="30" r="10"/>
                </svg>
            </div>

            
            <section className ="message is-info is-12" style={{width:'45%', height :'500px',overflowY: 'scroll'}} >
                <div className="message-header">
                    <h1 className="title is-6">論文詳細</h1>
                </div>

                
                <div className="message-body">
                    
                    <h1 className='title is-info'>Louain-based Multi-level Graph Drawing</h1>
                    <br/><br/>
                    
                    <h2 className='subtitle'>Seok-Hee Hong; Peter Eades; Marnijati Torkel; James Wood; Kunsoo Park</h2>
                  <Divider/><br/>
                    abstract:<br/>
                    The multi-level graph drawing is a popular approach to visualize large and complex graphs. It recursively coarsens a graph and then uncoarsens the drawing using layout refinement. In this paper, we leverage the Louvain community detection algorithm for the multi-level graph drawing paradigm.More specifically, we present the Louvain-based multi-level graph drawing algorithm, and compare with other community detection algorithms such as Label Propagation and Infomap clustering. Experiments show that Louvain-based multi-level algorithm performs best in terms of efficiency (i.e., fastest runtime), while Label Propagation and Infomap-based multi-level algorithms perform better in terms of effectiveness (i.e., better visualization in quality metrics).
                </div>

            </section>
        </section>
    );
}

export default Network;