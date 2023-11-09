import "./App.css";
import { useEffect, useState } from "react";
import enemigos from "./const/enemigos";
import aliados from "./const/aliados";

function App() {
  const puntoClic = 1;

  const [puntos, setPuntos] = useState(() => {
    const puntosGuardados = localStorage.getItem("puntos");
    return puntosGuardados ? parseInt(puntosGuardados, 10) : 0;
    
  });

  const [puntosSegundo, setPuntosSegundo] = useState(() => {
    const puntosSegundoGuardados = localStorage.getItem("puntosSegundo");
    return puntosSegundoGuardados ? parseInt(puntosSegundoGuardados, 10) : 0;
  });

  const [objetosComprados, setObjetosComprados] = useState(() => {
    const objetosCompradosGuardados = localStorage.getItem("objetosComprados");
    return objetosCompradosGuardados ? JSON.parse(objetosCompradosGuardados) : [];
  });
  

  // eslint-disable-next-line
  const [nombre, setNombre] = useState(() => {
    const nombreGuardado = localStorage.getItem("nombre");

    if (nombreGuardado) {
      return nombreGuardado;
    } else {
      const numeroAleatorio = Math.floor(Math.random() * 4);
      const nombreAleatorio = aliados[numeroAleatorio];

      localStorage.setItem("nombre", nombreAleatorio);

      return nombreAleatorio;
    }
  });

  useEffect(() => {
    localStorage.setItem("puntos", puntos);
    localStorage.setItem("puntosSegundo", puntosSegundo)
    localStorage.setItem("objetosComprados", JSON.stringify(objetosComprados));
  }, [puntos, puntosSegundo, objetosComprados]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nuevosPuntos = puntos + puntosSegundo;
      setPuntos(nuevosPuntos);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [puntos, puntosSegundo]);

  const handleCompra = (objeto) => {
    if (puntos >= objeto.valor) {

      const nuevosPuntos = puntos - objeto.valor;
      const nuevosObjetosComprados = [...objetosComprados, objeto];

      setPuntos(nuevosPuntos);
      setPuntosSegundo(puntosSegundo+objeto.valor)
      setObjetosComprados(nuevosObjetosComprados);

      // saberObjetos();
    }    
  };

  function saberObjetos(n){
    let count = 0;
    
    objetosComprados.forEach(element => {
      if(n === element.nombre){
        count ++;
      }
    });

    return count;
  }
  
  const resetStorage = () => {
    // Borra el localStorage
    localStorage.clear();

    setObjetosComprados([]);
    setPuntos(0);
    setPuntosSegundo(0);
  };

  
  return (
    <main>
      <div className="conatainerLogoDeepRock">
        <button onClick={() => resetStorage()}>Reset</button>
        <div className="info centered-info">
          <h2>La mina de {nombre}</h2>
          <div className="divPuntos">
            <h2 className="puntos">{puntos} puntos</h2>
            <h2 className="puntosSegundo">por segundo {puntosSegundo}</h2>
          </div>
        </div>

        <div className="centered-logo">
          <div
            className="logoDeepRock"
            onClick={() => setPuntos(puntos + puntoClic)}
          ></div>
        </div>
      </div>
      <div className="containerMejoras">
        <ul>
          {enemigos.map((enemigo, index) => (
            <li
              key={index}
              className="mejora"
              value={enemigo.valor * saberObjetos(enemigo.nombre)}
              onClick={() => handleCompra(enemigo)}
            >
              {enemigo.nombre}, precio: {enemigo.valor * (saberObjetos(enemigo.nombre) || 1)}, tienes {saberObjetos(enemigo.nombre)}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
