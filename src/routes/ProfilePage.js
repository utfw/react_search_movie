import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { faPen } from '@fortawesome/free-solid-svg-icons'

function ProfilePage() {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const onLogoutClick = (e) =>{
    auth.signOut();
    console.log(auth.currentUser)
    navigate('/');
  }

  return (
    <ProfileContainer>
      <h2 className='blind'>프로필 관리</h2>
      <p>Netflix를 시청할 프로필을 선택하세요.</p>
      {isEditing ? (
        <EditProfile>
          <form className='profile__form-edit'>
            <legend>프로필 변경</legend>
            <fieldset>
              <div className='form__top-wrap'>
                <div className='form__face'>
                  <img src='https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41' alt=''></img>
                </div>
                <div className='form__content'>
                  <div className='form__content-top'>
                    <input type='text' value={`이름이 들어가야함.`}></input>
                    <dl>
                      <dt>언어</dt>
                      <dd>한국어<span className='chev-down'></span></dd>
                    </dl>
                  </div>
                  <div className='form__content-mid'>
                    <dl>
                      <dt>관람등급 설정:</dt>
                      <dd>모든 관람등급</dd>
                      <dd>이 프로필에서는 모든 관람등급의 콘텐츠가 표시됩니다.</dd>
                    </dl>
                    {/* 어떻게 등급에 따라 설명을 바꾸고 설명을 뭐로 태그할 것인가. */}
                  </div>
                  <div className='form__content-bottom'>
                    <dl>
                      <dt>자동 재생 설정</dt>
                      <dd>
                        <input type='checkbox' id='onNextplay'></input>
                        <label htmlFor='onNextplay'>모든 디바이스에서 시리즈의 다음 화 자동 재생</label>
                      </dd>
                      <dd>
                        <input type='checkbox' id='onPreplay'></input>
                        <label htmlFor='onPreplay'>모든 디바이스에서 탐색 중 미리보기 자동 재생</label>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className='form__btns-wrap'>
              <button type='submit' className='form__btn-confirm'>저장</button>
              <button type='button' className='form__btn-cancel'>취소</button>
              <button type='button' className='form__btn-delete'>프로필 삭제</button>
              </div>
            </fieldset>
          </form>
        </EditProfile>
      ):(
        <Profiles>
        <ul className='profile-wrap'>
          <li className='profile'>
            {edit && (
            <div className='edit__btn' onClick={()=>{setIsEditing(true)}}>
              <span >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </span>
            </div>
            )}
            <img src='https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41' alt='' />
          </li>
          <li className='profile'>
            <img src='https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41' alt='' />
          </li>
        </ul>
        <button type='button' onClick={()=>{setEdit(prev=>!prev)}} className='profile__btn-toggle'>프로필 관리</button>
      </Profiles>
      )}
     
    </ProfileContainer>
  )
}

export default ProfilePage

const ProfileContainer = styled.div`
height:100vh;
`

const EditProfile = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width:100vh;
height:100vh;
color:#fff;
  .profile__form-edit{
    legend{
      font-size:32px;
      margin-bottom:10px;
    }
    fieldset{
      .form__top-wrap{
        display:flex;
        flex-wrap:nowrap;
        .form__content{
          div{
            padding: 10px 0; 
            border-top:1px solid #333;
            box-sizing:boder-box;
          }
        }

      }

      .form__btns-wrap{
        display:flex;
        justify-content:space-between;
        width:100%;
        border-top:1px solid #333;
      }
    }
  }

`

const Profiles = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;

width:100%;
height:100%;
  .profile-wrap{
    display:flex;
    margin-bottom:80px;
    .profile{
      overflow:hidden;
      position:relative;
      width:80px;
      height:80px;
      border:1px solid red;
      border-radius:8px;
      margin-right:20px;
      box-sizing:border-box;
      &:last-of-type{
        margin-right:0;
      }
      .edit__btn{
        display:flex;
        justify-content:center;
        align-items:center;
        position:absolute;
        width:100%;
        height:100%;
        backdrop-filter: blur(2px) grayscale(0.7);
        span{
          display:flex;
          justify-content:center;
          align-items:center;
          width:32px;
          height:32px;
          border:1px solid #fff;
          border-radius:50%;
          cursor:pointer;
          svg{
            color:#fff;
          }
        }
      }
      img{
        width:100%;
      }
    }
  }
  .profile__btn-toggle{
    width:120px;
    background: transparent;
    line-height:32px;
    border:1px solid #ccc;
    border-radius: 4px;
    color:#ccc;
    cursor:pointer;
  }
`