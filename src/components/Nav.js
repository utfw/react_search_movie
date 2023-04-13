import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'styles/nav.css';

function Nav() {
  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() =>{
    window.addEventListener("scroll", (e) =>{
      window.scrollY > 50 ? setShow(true) : setShow(false)
    })
    return () =>{
      window.removeEventListener("scroll", ()=>{});
      // 사용하지 않을때 윈도우 객체에서 이벤트를 지워줌. 
    }
  },[]);

  const onChange = (e) => {
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`);
  }
  return (
    <nav className={`nav ${show  && 'nav__black'}`} >
      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Logonetflix.png/800px-Logonetflix.png' alt='Netflix logo' className='nav__logo' onClick={()=>window.location.href="/react_search_movie_2023/"} />
      <input type='search' placeholder='영화를 검색해주세요' className='nav__input' onChange={onChange} value={searchValue} />
      <img src='https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41' alt='User Logged' className='nav__avatar' />
    </nav>
  )
}

export default Nav