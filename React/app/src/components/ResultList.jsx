import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/esm/Container';
import {useState} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';




function ResultList (props) {

    const itemPerPage = 2
    const pages = Math.floor(props.songs.length/itemPerPage)

    const [selectedPage, setSelectedPage] = useState(0)
    const changePage = (page) => {
        setSelectedPage(page)
    }

    // Get the slice of songs for the current page
    const songsList = props.songs.slice(
        selectedPage * itemPerPage,
        Math.min((selectedPage + 1) * itemPerPage, props.songs.length)
    );

    return ( <>
    <Container>
    <ListGroup>
        {songsList.map((song) => <ListGroup.Item key={song.id}><ResultCard song={song} playSong={props.playSong} addToQueue={props.addToQueue}></ResultCard></ListGroup.Item>)}
    </ListGroup>
    {pages > 0 ? <Pages pages={pages} selectedPage = {selectedPage} changePage={changePage}></Pages> : <></>}
    </Container>


    </>);

}


function ResultCard (props){

    const overlayDelayShow = 250
    const overlayDelayHide = 400

    return ( <>
        <Card className='mt-2 mb-2'>
        <Row className='mt-2 mb-2 mx-auto'>
            <Col >
                <Card.Img src={props.song.image} />
            </Col>
            <Col>
                <Card.Body >
                        <Card.Title>{props.song.title}</Card.Title>
                        <Card.Text>{props.song.length} | {props.song.description}</Card.Text>
                </Card.Body>
                <Stack direction='horizontal' gap={2} >
                <Button variant="success" onClick={() => props.playSong(props.song)}><i className="bi bi-play-fill"></i></Button>

                <OverlayTrigger placement="bottom" delay={{ show: overlayDelayShow, hide: overlayDelayHide }} overlay={<Tooltip>Add to Queue</Tooltip>}>
                    <Button variant="warning" onClick={() => props.addToQueue(props.song)}><i className="bi bi-clock"></i></Button> 
                </OverlayTrigger> 

                <OverlayTrigger placement="bottom" delay={{ show: overlayDelayShow, hide: overlayDelayHide }} overlay={<Tooltip>Add to Playlist</Tooltip>}>
                    <Button variant="info"><i className="bi bi-music-note-list"></i></Button>
                </OverlayTrigger> 
                
                </Stack>
            </Col>       
          </Row>
        </Card>
    
        </>);
}

function Pages (props) {


    const items = []
    // if(props.pages < 8){
        // items.push(props.selectedPage > 0 ? <Pagination.Prev onClick={e => props.changePage(props.selectedPage-1)}/> : <Pagination.Prev disabled />)
        
        for(let i=0; i<props.pages; i++){
            items.push(i === props.selectedPage ? 
            <Pagination.Item key={i} active>{i+1}</Pagination.Item> : 
            <Pagination.Item key={i} onClick={e => props.changePage(i)}>{i+1}</Pagination.Item>)
        }

        // items.push(props.selectedPage < props.pages-1 ? <Pagination.Next onClick={e => props.changePage(props.selectedPage+1)}/> : <Pagination.Next disabled />)
    // }

    // else{
    //     items.push(props.selectedPage > 0 ? <Pagination.First onClick={e => props.changePage(0)}/> : <Pagination.First disabled />)
    //     items.push(props.selectedPage > 0 ? <Pagination.Prev onClick={e => props.changePage(props.selectedPage-1)}/> : <Pagination.Prev disabled />)

    //     for(let i=0; i<3; i++){
    //         items.push(i === props.selectedPage ? 
    //         <Pagination.Item key={i} active>{i+1}</Pagination.Item> : 
    //         <Pagination.Item key={i} onClick={e => props.changePage(i)}>{i+1}</Pagination.Item>)
    //     }

    //     items.push(<Pagination.Ellipsis />)

    //     for(let i=props.pages-3; i<props.pages; i++){
    //         items.push(i === props.selectedPage ? 
    //         <Pagination.Item key={i} active>{i+1}</Pagination.Item> : 
    //         <Pagination.Item key={i} onClick={e => props.changePage(i)}>{i+1}</Pagination.Item>)
    //     }

    //     items.push(props.selectedPage < props.pages-1 ? <Pagination.Next onClick={e => props.changePage(props.selectedPage+1)}/> : <Pagination.Next disabled />)
    //     items.push(props.selectedPage < props.pages-1 ? <Pagination.Last onClick={e => props.changePage(props.pages-1)}/> : <Pagination.Last disabled />)

    // }

    return (
        <>
        <Container className='d-flex justify-content-center'>
        <Pagination className='mt-2'>
          {/* <Pagination.First /> */}
          {props.selectedPage > 0 ? <Pagination.Prev onClick={e => props.changePage(props.selectedPage-1)}/> : <Pagination.Prev disabled />}
          {items}
          {/* <Pagination.Ellipsis /> */}


          {props.selectedPage < props.pages-1 ? <Pagination.Next onClick={e => props.changePage(props.selectedPage+1)}/> : <Pagination.Next disabled />}
          {/* <Pagination.Last /> */}
        </Pagination>
        </Container>
        </>
      );
}


export default ResultList