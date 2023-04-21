import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function DetailPage() {
  const [movie, setMovie] = useState({});
  let {movieId} = useParams(); // 주소창 중 파라미터를 가져옴
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  useEffect(() =>{
    fetchData(); // useEffect에 바로 넣지 않는게 좋아서 따로 만드는것. 잊지말기
  },[movieId])  
  const fetchData = async() =>{
    try {
      const request = await axios.get(`/movie/${movieId}`);
    
      if(false){   // 이미지가 존재하는지 조건을 걸어야함. 
        const imgRequest = await axios.get(`/movie/${movieId}/image`);
        console.log(imgRequest) 
      }
      setMovie(request.data);
      setGenres(request.data.genres);
      console.log(request.data)
    } catch (error) {
      console.log(error);
    }
  }

  if(!movie) return <div>...loading</div>
  return (
    <>
    <Btn__nav onClick={() =>{navigate(-1)}}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></Btn__nav>
    <MovieDetail style={{backgroundImage:`url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`, backgroundSize:`cover`,backgroundRepeat:`no-repeat`}}>
      <MoviePoster><img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.name || movie.original_name} /></MoviePoster>
      <div className='section__inner'>
      <div>
        <h2>{movie.title || movie.name || movie.original_name}</h2>
        <MovieInfo>
          <li>{movie.release_date}</li>
          <li>{`${movie.runtime}분`}</li>
          <li>
          <ul className='genres'>
          {genres.map((item, index) =>{
            return(
              <li className='genres'>{item.name}</li>
            )
          })}
          </ul>
          </li>
        </MovieInfo>
        <MovieDescription>
          <p>{movie?.overview}</p>
        </MovieDescription>
      </div>
      </div>

    </MovieDetail>

    </>
  )
}


const Btn__nav = styled.div`
  position:fixed;
  display:flex;
  justify-content:center;
  align-items:center;
  top:86px;
  left:16px;
  width:40px;
  height:40px;
  z-index:10;
  cursor:pointer;
  svg{
    width:100%;
    height:24px;
    color:#fff;
  }
`
const MovieDetail = styled.section`
  display:flex;
  position:relative;
  justify-content:space-between;
  align-items:flex-end;
  width:100%;
  min-height:100vh;
  padding:80px 50px 80px 120px;
  box-sizing:border-box;
  color: #fff;
  .section__inner{
    width:100%;
    max-width:860px;
    padding: 40px 32px 40px;
    box-sizing:border-box;
    background: #111;
    h2{
      padding-left:0;
      font-size:28px;
    }
  }
`
const MovieInfo = styled.ul`
  display:flex;
  align-items:flex-end;
  list-style:none;
  margin-top:10px;
  padding-left:0;
  font-size:14px;
  >li{
    margin-right: 8px;
  }
  .genres{
    display:flex;
    list-style:none;
    padding:0;
    margin:0;
    li{
      padding-right:10px;
      font-style:italic;
    }
  }
`
const MovieDescription =styled.div`
  width:100%;
  margin-top:40px;
  text-align:justify;
  line-height:1.5;
  font-size: 18px;
`
const MoviePoster = styled.div`
height:50%;
`
export default DetailPage