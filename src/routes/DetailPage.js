import axios from '../api/axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function DetailPage() {
  const [movie, setMovie] = useState({});
  let {movieId} = useParams(); // 주소창 중 파라미터를 가져옴
  const [genres, setGenres] = useState([]);

  useEffect(() =>{
    fetchData(); // useEffect에 바로 넣지 않는게 좋아서 따로 만드는것. 잊지말기
  },[movieId])  
  const fetchData = async() =>{
    try {
      const request = await axios.get(`/movie/${movieId}`);
      setMovie(request.data);
      setGenres(request.data.genres);
      console.log(request.data)
    } catch (error) {
      console.log(error);
    }
  }

  if(!movie) return <div>...loading</div>
  return (
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
      </div>
      <div>
        <p>{movie?.overview}</p>
      </div>
      </div>
      <img className='modal__poster-img' src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title || movie.name || movie.original_name} />
    </MovieDetail>
  )
}
const MovieInfo = styled.ul`
  display:flex;
  align-items:flex-end;
  list-style:none;
  padding-left:0;
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
  position: relative;
  color: #fff;
  .section__inner{
    position:absolute;
    bottom:0;
    padding: 0 16px;
    background: linear-gradient(to bottom, transparent 0%, #111 50%);
    h2{
      padding-left:0;
    }
  }

`
export default DetailPage