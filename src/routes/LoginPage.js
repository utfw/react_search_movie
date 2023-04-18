import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const onChange = useCallback((e) =>{
    if(e.target.name==='id'){
      setId(e.target.value)
    } 
    if(e.target.name==='pw'){
      setPw(e.target.value)
    }
  },[id, pw]);

  const onSubmit = useCallback(async(e) =>{
    e.preventDefault();
    try {
      const login = await signInWithEmailAndPassword(auth, id, pw);
      console.log(auth.currentUser);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  },[id, pw]);

  return (
    <Login>
      <form onSubmit={onSubmit}>
        <legend>로그인</legend>
        <fieldset>
        <input type='email' onChange={onChange} value={id} name='id'placeholder='이메일 주소' required />
        <input type='password' onChange={onChange} value={pw} name='pw' placeholder='비밀번호' required />
        <button type='submit'>로그인</button>
        </fieldset>
        <p>
          Netflix 회원이 아닌가요? &nbsp;
          <span onClick={() => {navigate('/')}} >지금 가입하세요.</span>
        </p>
      </form>

    </Login>
  )
}

export default LoginPage

const Login = styled.div`
height:calc(100vh - 228px);
position:relative;
form{
  position:absolute;
  top:50%;
  left:50%;
  width:420px;
  padding:40px;
  background:rgba(0,0,0,.3);
  border-radius:8px;
  transform:translate(-50%,-50%);
  legend{
    margin-bottom:20px;
    font-size:32px;
    color:#fff;
  }
  fieldset{
    display:flex;
    flex-direction:column;
    border:none;
    input{
      height:50px;
      margin-bottom:16px;
      padding:0 8px;
      border:none;
      border-radius:8px;
      background:#808080;
      outline:none;
      &::placeholder{
        color:#bbb;
      }
    }
    button{
      height:60px;
      margin-top:48px;
      margin-bottom:16px;
      border:none;
      border-radius:8px;
      background:var(--red);
      font-size:var(--font-size-btn);
      color:#fff;
      outline:none;
      &:hover{
        background:var(--deepred);
      }
    }
  }
  p{
    color:#fff;
    span{
      font-weight:bold;
      cursor:pointer;
      &:hover{
        text-decoration:underline;
      }
    }
  }
}

`