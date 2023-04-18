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
    <MovieDetail>
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
      <MovieDescription> <p>{movie?.overview}</p></MovieDescription>
      </div>
      </div>
      <img className='modal__poster-img' src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title || movie.name || movie.original_name} />
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
const MovieDescription =styled.div`
  width:100%;
  margin-top:20px;
  text-align:justify;
`
const MovieInfo = styled.ul`
  display:flex;
  align-items:flex-end;
  list-style:none;
  margin-top:4px;
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
const MovieDetail = styled.section`
  display:flex;
  flex-direction:column-reverse;
  position: relative;
  color: #fff;
  min-height:calc(100vh - 228px);
  padding-top:70px;
  .section__inner{
    width:100%;
    padding: 20px 16px 0;
    box-sizing:border-box;
    background: linear-gradient(to bottom, transparent 10%, #111 46%, #111 60%);
    margin-bottom:40px;
    h2{
      padding-left:0;
      font-size:28px;
    }
  }

`
export default DetailPage