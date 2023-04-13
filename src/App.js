import requests from 'api/requests';
import Banner from 'components/Banner';
import Footer from 'components/Footer';
import Nav from 'components/Nav'
import Row from 'components/Row';
import { Outlet, Route, Routes } from 'react-router-dom';
import DetailPage from 'routes/DetailPage';
import MainPage from 'routes/MainPage';
import SearchPage from 'routes/SearchPage';
import 'styles/app.css'

const Layout = () => {
  return (
    <div>
    <Nav></Nav>
    <Outlet></Outlet> 
    <Footer></Footer>
    </div>
  )
} //레이아웃을 함수형 컴포넌트. 아웃렛에 자식경로 요소가 들어간다. 

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Layout />}> 
          <Route index element={<MainPage />}></Route>
          {/* index = 부모주소가져옴 */}
          <Route path=':movieId' element={<DetailPage />}></Route>
          {/* :으로 state 값을 넣어줄수있다.  */}
          <Route path='search' element={<SearchPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
