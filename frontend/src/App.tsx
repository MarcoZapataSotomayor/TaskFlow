import "./App.css";
import { useState, useEffect } from "react";

function App() {
  type Tarea = {
    id: number;
    titulo: string;
  };

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [tituloEditado, setTituloEditado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarTareas = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/tareas");

        if (!respuesta.ok) {
          throw new Error("Error al obtener las tareas");
        }

        const datos: Tarea[] = await respuesta.json();

        if (activo) {
          setTareas(datos);
        }
      } catch (error) {
        if (activo) {
          console.error("No se pudieron cargar las tareas:", error);
          setErrorCarga(
            "No pudimos conectar con el servidor. Inténtalo más tarde.",
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargarTareas();

    return () => {
      activo = false;
    };
  }, []);

  const agregarTarea = async () => {
    const titulo = nuevaTarea.trim();

    if (titulo === "") {
      return;
    }

    setErrorOperacion(null);

    try {
      const respuesta = await fetch("http://localhost:3000/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo }),
      });

      if (!respuesta.ok) {
        throw new Error("Error al crear la tarea");
      }

      const tareaCreada: Tarea = await respuesta.json();

      setTareas((prev) => [...prev, tareaCreada]);
      setNuevaTarea("");
    } catch (error) {
      console.error("No se pudo crear la tarea:", error);
      setErrorOperacion("No se pudo crear la tarea. Inténtalo nuevamente.");
    }
  };

  const eliminarTarea = async (id: number) => {
    setErrorOperacion(null);

    try {
      const respuesta = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
    } catch (error) {
      console.error("No se pudo eliminar la tarea:", error);
      setErrorOperacion("No se pudo eliminar la tarea. Inténtalo nuevamente.");
    }
  };

  const editarTarea = async (id: number, nuevoTitulo: string) => {
    setErrorOperacion(null);

    try {
      const respuesta = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo: nuevoTitulo }),
      });

      if (!respuesta.ok) {
        throw new Error("Error al actualizar la tarea");
      }

      const tareaActualizada: Tarea = await respuesta.json();

      setTareas((prev) =>
        prev.map((tarea) => (tarea.id === id ? tareaActualizada : tarea)),
      );

      return true;
    } catch (error) {
      console.error("No se pudo actualizar la tarea:", error);
      setErrorOperacion(
        "No se pudo actualizar la tarea. Inténtalo nuevamente.",
      );

      return false;
    }
  };

  const iniciarEdicion = (tarea: Tarea) => {
    setIdEditando(tarea.id);
    setTituloEditado(tarea.titulo);
  };

  const guardarEdicion = async () => {
    if (idEditando === null) {
      return;
    }

    const titulo = tituloEditado.trim();

    if (titulo === "") {
      return;
    }

    const actualizado = await editarTarea(idEditando, titulo);

    if (actualizado) {
      cancelarEdicion();
    }
  };

  const cancelarEdicion = () => {
    setIdEditando(null);
    setTituloEditado("");
  };

  return (
    <main className="app">
      <div className="contenedor">
        <header className="encabezado">
          <div className="logo">✓</div>

          <div>
            <h1>TaskFlow</h1>
            <p>Organiza tus actividades diarias</p>
          </div>
        </header>

        <section className="tarjeta">
          <div className="cabecera-tareas">
            <h2>Mis tareas</h2>

            <span className="contador-tareas">
              {cargando
                ? "Cargando..."
                : errorCarga
                  ? "No disponible"
                  : `${tareas.length} ${tareas.length === 1 ? "tarea" : "tareas"}`}
            </span>
          </div>
          {cargando && <p>Cargando tareas...</p>}
          {errorCarga && (
            <div className="mensaje-error" role="alert">
              {errorCarga}
            </div>
          )}
          {!cargando && !errorCarga && tareas.length === 0 && (
            <div className="estado-vacio">
              <span className="icono-vacio">✓</span>

              <h3>Todavía no tienes tareas</h3>

              <p>Agrega tu primera tarea para comenzar a organizar tu día.</p>
            </div>
          )}
          <ul className="lista-tareas">
            {!cargando &&
              tareas.map((tarea) => (
                <li key={tarea.id} className="tarea">
                  {idEditando === tarea.id ? (
                    <>
                      <input
                        className="input-edicion"
                        type="text"
                        value={tituloEditado}
                        onChange={(e) => setTituloEditado(e.target.value)}
                      />

                      <button
                        className="boton-guardar"
                        onClick={guardarEdicion}
                      >
                        Guardar
                      </button>

                      <button
                        className="boton-cancelar"
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="titulo-tarea">{tarea.titulo}</span>

                      <button
                        className="boton-editar"
                        onClick={() => iniciarEdicion(tarea)}
                      >
                        Editar
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() => eliminarTarea(tarea.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </li>
              ))}
          </ul>

          <div className="formulario-tarea">
            <h3>Agregar nueva tarea</h3>
            {errorOperacion && (
              <div className="mensaje-error" role="alert">
                {errorOperacion}
              </div>
            )}
            <div className="formulario-contenido">
              <input
                className="input-tarea"
                type="text"
                aria-label="Título de la nueva tarea"
                placeholder="¿Qué necesitas hacer?"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
              />

              <button
                className="boton-agregar"
                onClick={agregarTarea}
                disabled={cargando || errorCarga !== null}
              >
                + Agregar
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
