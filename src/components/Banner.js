import axios from 'api/axios.js';
import requests from 'api/requests';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/banner.css'

function Banner() {
  const [movie, setMovie] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    fetchData();
    console.log(movie.id);
  },[])

  const fetchData = async() =>{
    const request = await axios.get(requests.fetchNowPlaying);

    const movieId = request.data.results[
      Math.floor(Math.random()*request.data.results.length)
    ].id;
    const {data:movieDetail} = await axios.get(`/movie/${movieId}`,{params:{append_to_response: "videos"}});
  // console.log(movieDetail);
  setMovie(movieDetail);
  }
  const turncate = (text, length) =>{
    return text?.length > length ? text.substr(0, length-1) + '...' : text; 
  } //?를 넣어주면 값이 없어도 에러가 나오지 않는다. 

  if(!isClicked){
    return (
      <header className='banner' style={{backgroundImage:`url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,backgroundPosition:'top center',backgroundSize:'cover'}}>
        <div className='banner__contents'>
          <h1 className='banner_title'>
            {movie.title || movie.name || movie.original_name}
          </h1>
          <div className='banner__buttons'>
            <button className='banner__button play' onClick={() => setIsClicked(true)}>
              play
            </button>
            <button className='banner__button info' onClick={()=>{navigate(`/${movie.id}`)}}>
              <div className='space'></div>More Information
            </button>
          </div>
          <p className='banner__description'>
            {turncate(movie.overview,100)}
          </p>
        </div>
        <div className='banner--fadeBottom'></div>
      </header>
      )
  } else{
    return(
      <Container>
        <HomeContainer>
          <Iframe
          src={`https://www.youtube.com/embed/${movie.videos.results[0]?.key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos.results[0]?.key}`}
          width='640'
          height='360'
          frameborder='0'
          allow='autoplay; fullscreen'>
          </Iframe>
        </HomeContainer>
      </Container>
    )
  }
}
const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-item: center;
width: 100%;
height: 100vh;
`;

const HomeContainer = styled.div`
width: 100%;
height: 100%;
`

const Iframe =styled.iframe`
width: 100%;
height: 100%;
z-index: -1;
opacity: 0.65;
border: none;
&::after{
  content:"";
  position: absolute;
  top: 0;
  left:0;
  width:100%;
  height:100%;
}
`
export default Banner