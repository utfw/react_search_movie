import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { auth, db, storage } from '../firebase'
import { signOut } from 'firebase/auth'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { faCaretDown, faPen, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { collection, doc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { defaultFace } from 'default'

function ProfilePage() {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newFace, setNewFace] = useState(defaultFace);
  const [newName, setNewName] = useState("");
  const [faceBefore, setFaceBefore] = useState(""); 
  const [nameBefore, setNameBefore] = useState("");
  const [userProfiles, setUserProfiles] = useState([]);
  let profileInfo = {};
  const [id, setId] = useState(0);

  useEffect(()=>{
    getProfiles();
  },[]);
  
  const getProfiles = async() => {
    const q = await query(collection(db, `${auth.currentUser.uid}`));
    const querySnapshot = await getDocs(q);
    await setUserProfiles(querySnapshot.docs);
    // console.log(querySnapshot.docs);
    setId(userProfiles.length-1);
    console.log(id);
  }

  const onLogoutClick = async(e) =>{
    await auth.signOut();
    navigate('/');
  }
  
  const onChangeFace = (e) =>{
    setFaceBefore(newFace);
    const {target:{files}} = e;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (e) =>{
      const {currentTarget:{result}} = e;
      setNewFace(result);
    }
    reader.readAsDataURL(theFile);
  }
  const onChangeName = useCallback((e) =>{
    const {target:{value}} = e;
    setNewName(value);
  },[]);
  
  const onSubmit = async(e) =>{
    e.preventDefault();
    profileInfo = userProfiles[id].data();
    // 이게 새로운 프로필인지 기존의 프로필인지 조건을 따지기 귀찮으니 차라리 접근을 제한.
    console.log(id);
    let fileUrl = profileInfo.fileUrl;
    const fileName = id; //내가 클릭한 애가 누군지 어떻게 아는가. 
    const storageRef = ref(storage, `${auth.currentUser.uid}/profile/${fileName}`);
    if(faceBefore !== newFace){ //이미지 변경이 있을 시 사진 업로드 진행
      try {
        const upload = await uploadString(storageRef, newFace, 'data_url');
        fileUrl = await getDownloadURL(ref(storage, upload.ref));
        setNewFace(fileUrl);
      } catch (error) {
        console.log(error);
      }
    }
    try { // 프로필 정보 문서 업로드
      await setDoc(doc(db,`${auth.currentUser.uid}`,`${fileName}`),{
        id: id,
        displayname:newName,
        fileName:fileName,
        fileUrl:fileUrl
      })
    } catch (error) {
      console.log(error)
    }
    console.log(`${id} submit done`);
    setIsEditing(prev=>!prev);
    setEdit(prev=>!prev);
  }
  const onAddProfile = async(e) => {
    const q = query(collection(db, `${auth.currentUser.uid}`));
    const querySnapshot = await getDocs(q);
    await setUserProfiles(querySnapshot.docs);
    const length = userProfiles.length;
    console.log(length);
    if(length < 6){
      // add profile
      try {
        setId(length);
        await setDoc(doc(db,`${auth.currentUser.uid}`,`${id}`),{
          id: id,
          displayname:newName,
          fileName:id,
          fileUrl:defaultFace,
          date:Date.now()
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('프로필 최대상한도달')
    }
  }

  async function onEditProfile(idx){
    console.log(idx);
    setNameBefore(newName);
    setFaceBefore(newFace);
    setId(idx);
    profileInfo = userProfiles[idx].data();
    // console.log(profileInfo);
    await setNewName(profileInfo.displayname);
    await setNewFace(profileInfo.fileUrl);
    setIsEditing(true);
    console.log(id);
  } 
  return (
    <ProfileContainer>
      <h2 className='blind'>프로필 관리</h2>
      {isEditing ? (
        // 프로필 생성 / 설정 변경
        <EditProfile> 
          <form className='profile__form-edit' onSubmit={onSubmit}>
            <legend>프로필 변경</legend>
            <fieldset>
              <div className='form__top-wrap'>
                <div className='form__face'>
                  <div className='face-wrap'>
                  <img src={newFace} alt='' className='face'></img>
                  <input type='file' onChange={onChangeFace} id='input_face_change' accept="image/*"></input>
                  <label htmlFor='input_face_change' className='face__btn-edit'>
                    <FontAwesomeIcon icon={faPencil} />
                  </label>
                  </div>
                </div>
                <div className='form__content'>
                  <div className='form__content-top'>
                    <input type='text' onChange={onChangeName} value={newName} required></input>
                    <dl>
                      <dt>언어</dt>
                      <dd>
                      <ul className='lang__list'>
                      <li>한국어<FontAwesomeIcon icon={faCaretDown} /></li>
                      <li>
                      </li>  
                      </ul></dd>
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
              <button type='button' className='form__btn-cancel' onClick={()=>{setIsEditing(prev=>!prev);setEdit(prev=>!prev)}}>취소</button>
              <button type='button' className='form__btn-delete'>프로필 삭제</button>
              </div>
            </fieldset>
          </form>
        </EditProfile>
      ):(
        <Profiles>
        <p className='profile__text'>Netflix를 시청할 프로필을 선택하세요.</p>
        <ul className='profile-wrap'>
          {userProfiles.map((profile,idx) =>{
              return(
              <li className='profile' key={idx} onClick={()=>onEditProfile(idx)}>
                {edit && (
                  <div className='edit__btn' >
                    <span >
                      <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                    </span>
                  </div>
              )}
                <img src={`${profile.data().fileUrl}`} alt=''></img>
              </li>
              )
            })
          }
          {id < 5 &&(
            <li>
            <AddProfile>
              <div className='icon-wrap' onClick={onAddProfile}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </div>
              <p>프로필 추가</p>
            </AddProfile>
            </li>
          )}
        </ul>
        <button type='button' onClick={()=>{setEdit(prev=>!prev)}} className='profile__btn-toggle'>프로필 관리</button>
        <button onClick={onLogoutClick} className='logout'>로그아웃</button>
      </Profiles>
      )}
     
    </ProfileContainer>
  )
}

export default ProfilePage
 // 전체 wrap
const ProfileContainer = styled.div`
height:100vh;
`
 // 수정화면
const EditProfile = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
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
        .form__face{
          margin-right:10px;
          padding-top:10px;
          .face-wrap{
            position:relative;
            width:80px;
            height:80px;

              .face{
                width:100%;
                height:100%;
                object-fit:cover;
              }
              input[type="file"]{
                display:none;
              }

            .face__btn-edit{
              position:absolute;
              left:2px;
              bottom:2px;
              width:22px;
              height:22px;
              border:1px solid #fff;
              border-radius:50%;
              cursor:pointer;
              svg{
                position:absolute;
                top: calc(50% - 5.5px);
                left: calc(50% - 5.5px);
                font-size:11px;
              }
            }
          }
        }
        .form__content{
          div{
            padding: 10px 0; 
            border-top:1px solid #333;
            box-sizing:boder-box;
          }
          .form__content-top{
            input[type="text"]{
              width:100%;
              margin-bottom:32px;
              padding:8px 8px;
              box-sizing:border-box;
            }
            .lang__list{
              display:inline-block;
              padding:4px;
              border:1px solid #ddd;
              font-size:14px;
              li{
                svg{
                  margin-left:40px;
                }
              }
            }
          }
          .form__content-mid{}
          .form__content-bottom{}
          dt{
            color:#ccc;
          }
          dd{
            margin:10px 0;
            font-size:14px;
          }
        }

      }

      .form__btns-wrap{
        display:flex;
        width:100%;
        padding-top:28px;
        border-top:1px solid #333;
        button{
          width:auto;
          margin-right:10px;
          padding: 0 20px;
          background: transparent;
          line-height:32px;
          border:1px solid #bbb;
          border-radius: 2px;
          color:#bbb;
          cursor:pointer;
        }
      }
    }
  }

`
// 디폴트 화면
const Profiles = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width:100%;
height:100%;
  .profile__text{
    color:#fff;
    font-size:28px;
  }
  .profile-wrap{
    display:flex;
    margin:20px 0 80px;
    .profile{
      overflow:hidden;
      position:relative;
      width:80px;
      height:80px;
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
        height:100%;
        object-fit:cover;
      }
    }
  }
  .profile__btn-toggle{
    width:120px;
    margin-bottom:20px;
    background: transparent;
    line-height:32px;
    border:1px solid #bbb;
    border-radius: 2px;
    color:#bbb;
    cursor:pointer;
  }
  .logout{
    width:120px;
    background: transparent;
    line-height:32px;
    border:1px solid #bbb;
    border-radius: 2px;
    color:#bbb;
    cursor:pointer;
    transition:all 0.2s ease-in;
    &:hover{
      background: var(--red);
      border-color:var(--red);
      font-weight:bold;
      color:#fff;
    }
  }
`
// 프로필 추가 버튼
const AddProfile = styled.div`
display:flex;
justify-content:center;
align-items:center;
position:relative;
width:80px;
height:80px;
border-radius:8px;
  .icon-wrap{
    display:flex;
    justify-content:center;
    align-items:center;
    width:40px;
    height:40px;
    background:#ddd;
    border-radius:50%;
    cursor:pointer;
    svg{
      font-size:32px;
      color:#111;
    }
  }
  p{
    position:absolute;
    bottom:0;
    font-size:12px;
    color:#ccc;
    transform:translateY(100%);
  }
`