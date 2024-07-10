import './App.css'

import { useState, useEffect, useCallback, useRef } from 'react'

function App() {

  const [score, setScore] = useState(0);

  const [follow, setFollow] = useState(false);

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const maxWidth = window.innerWidth - 100;
  const maxHeight = window.innerHeight - 100;

  const objetiveRef = useRef<HTMLElement | null>(null);

  const isTouching = (element1: Element , element2: Element) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right);
  } 

  const handleClick = () => {
    setFollow(!follow)
    setScore(0);
  }

  const createDiv = useCallback(() => {
    const div = document.createElement('div');
    div.classList.add('objetive');

    const randomX = Math.round(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    div.style.left = `${randomX}px`;
    div.style.top = `${randomY}px`;

    document.body.appendChild(div);
    objetiveRef.current = div;
  }, [maxWidth, maxHeight])

  const moveObjetive = useCallback(() => {
    const objetive = objetiveRef.current;
    if (objetive) {
      const randomX = Math.round(Math.random() * maxWidth);
      const randomY = Math.floor(Math.random() * maxHeight);

      objetive.style.left = `${randomX}px`;
      objetive.style.top = `${randomY}px`;
    }
  }, [maxWidth, maxHeight]);

  useEffect(() => {
    const handleMouseMove = (event: {clientX: number, clientY: number}) => {
      const newCoords = { x: event.clientX, y: event.clientY }
      setCoords(newCoords)
      const follower = document.querySelector('.follower');
      if (isTouching(follower!, objetiveRef.current!)) {
        setScore((currentScore) => currentScore + 1);
        moveObjetive();
      }
    }

    if (follow) {
      createDiv();
      window.addEventListener('pointermove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);

      const objectives = document.getElementsByClassName('objetive');

      if (objectives) {
        Array.from(objectives).forEach((element) => element.remove());
      }
    }
  }, [follow, createDiv, moveObjetive])

  return (
    <>
      <div className='follower' style={{ display: follow ? '' : 'none', transform: `translate(${coords.x}px, ${coords.y}px)`}}>
      </div>
      <p className='score'>Puntos totales: { score }</p>
      <button className='button' aria-label='botón de activación de seguimiento de mouse' onClick={handleClick}>{follow ? 'Desactivar' : 'Activar'} seguimiento de mouse</button>
    </>
  )
}

export default App