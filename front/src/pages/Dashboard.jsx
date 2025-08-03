import React, { useState, useEffect, useRef } from 'react';
import AlertPanel from '../components/AlertsPanel';
import DiagramEditor from '../components/DiagramEditor/DiagramEditor';
import NetworkOverview from '../components/NetworkOverview';
import SwitchLoadWidget from '../components/SwitchLoadWidget';

const Dashboard = () => {
  const [screen, setScreen] = useState(0);
  const scrollingRef = useRef(false);

  // Чтобы предотвратить слишком частое переключение, добавим "дебаунс"
  const onWheel = (e) => {
    if (scrollingRef.current) return;

    if (e.deltaY > 0 && screen === 0) {
      scrollingRef.current = true;
      setScreen(1);
      setTimeout(() => { scrollingRef.current = false; }, 700); // время анимации + небольшой запас
    } else if (e.deltaY < 0 && screen === 1) {
      scrollingRef.current = true;
      setScreen(0);
      setTimeout(() => { scrollingRef.current = false; }, 700);
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [screen]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '200vh', // 2 экрана по 100vh
          width: '100%',
          transition: 'transform 0.6s ease-in-out',
          transform: `translateY(-${screen * 100}vh)`,
        }}
      >
        {/* Первый экран */}
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: '0 0 10%',
              backgroundColor: '#a2d5f2',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NetworkOverview/>
          </div>
          <div style={{ flex: '0 0 90%', display: 'flex' }}>
            <div
              style={{
                flex: '0 0 65%',
                backgroundColor: '#f2a2a2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DiagramEditor/>
            </div>
            <div
              style={{
                flex: '1',
                backgroundColor: '#a2f2a2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SwitchLoadWidget/>
            </div>
          </div>
        </div>

        {/* Второй экран */}
        <div
          style={{
            height: '100vh',
            width: '100%',
            backgroundColor: '#f2dfa2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AlertPanel/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
