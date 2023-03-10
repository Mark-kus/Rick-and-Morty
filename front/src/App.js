import { useEffect, useState } from 'react';
import './App.css';
import Cards from './components/Cards/Cards.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer.jsx'
import About from './components/About/About.jsx'
import Error from './components/Error/Error.jsx'
import Detail from './components/Detail/Detail.jsx'
import Form from './components/Form/Form';
import video from './backgroundDesktop.mp4';
import title from './title.png';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFav, updateAll } from './redux/actions';

export default function App() {
  const [characters, setCharacters] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const myFavorites = useSelector(state => state.myFavorites)
  const charactersAmount = 826;

  // simulacion de seguridad

  const [access, setAccess] = useState(false);
  const username = 'tignanellimarco@gmail.com';
  const password = 'alphabeta';
  const navigate = useNavigate();

  const login = (userData) => {
    if (userData.password === password && userData.username === username) {
      setAccess(true);
      navigate('/home');
    }
  }

  useEffect(() => {
    access && navigate('/');
  }, [access]);

  // !access para simular, access para no
  // fin de simulacion

  //En el componente Detail donde llamamos a la API de Rick & Morty en la ruta https://rickandmortyapi.com/api/character/ cámbiala por la ruta que creamos en el back: http://localhost:3001/rickandmorty/detail

  //En la action para agregar favorito, ahora debes enviar los personajes al endpoint http://localhost:3001/rickandmorty/fav con el método post.

  //En la action para eliminar favorito, ahora debes enviar el personaje a eliminar al endpoint http://localhost:3001/rickandmorty/fav con el método delete.

  const onSearch = ({ id }) => {
    if (characters.length === charactersAmount) {
      alert('No hay más cartas que añadir');
      return null;
    }
    // fetch(`${process.env.REACT_APP_URL_BASE}/character/${id}?key=${process.env.REACT_APP_API_KEY}`)
      fetch(`http://localhost:3001/onsearch/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.name) {
          let repeated = false;
          if (characters.length > 0) {
            characters.forEach((elem) => {
              if (elem.id === data.id) {
                alert('Esa carta ya existe');
                repeated = true;
              }
            })
          }
          if (!repeated) {
            if (characters.length > 0) {
              setCharacters([
                ...characters,
                data
              ]);
            } else {
              setCharacters([
                data
              ]);
            }
          }
        } else {
          window.alert('No hay personajes con ese ID');
        }
      });
  }

  const onSearchRandom = () => {
    if (characters.length === charactersAmount) {
      alert('No hay más cartas que añadir')
      return null;
    }
    let random = Math.floor(Math.random() * charactersAmount + 1);
    if (characters.length > 0) {
      characters.forEach((elem) => {
        if (elem.id === random) {
          random = onSearchRandom();
        }
      })
    }
    onSearch({ id: random });
  }

  const onClose = (idCharacter) => {
    const newCharacters = characters.filter((character) => character.id !== idCharacter);
    setCharacters([
      ...newCharacters
    ]);
    dispatch(deleteFav(idCharacter));
  }

  return (
    <div>
      <div className='img'>
        <img className='titleImg' src={title} alt='Rick and Morty title' />
      </div>
      <div className='App'>
        <video id="background-video" loop autoPlay muted>
          <source src={video} type="video/mp4" />
        </video>
        {location.pathname !== '/' ? <NavBar onSearch={onSearch} onSearchRandom={onSearchRandom} /> : ''}
        <div className='container'>
          <Routes>
            <Route path='/home' element={<Cards characters={characters} onClose={onClose} />} />
            <Route path='/about' element={<About />} />
            <Route path='/favorites' element={<Cards characters={myFavorites} />} />
            <Route path='/detail/:id' element={<Detail characters={characters} setCharacters={setCharacters} />} />
            <Route exact path='/' element={<Form login={login} />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </div>
      </div>
        <Footer />
    </div>
  )
}