import { useState, useEffect } from "react";
import { IProyecto } from "../../../types/Iinterfaces";
import {
  createTareaController,
  getTareasController,
  updateTareaController,
} from "../../../data/proyectoController"; // Importando las funciones actualizadas
import styles from "./modal.module.css";
import Swal from "sweetalert2";

type ProyectoModalProps = {
  closeModal: () => void;
  refreshProyectos: () => void;
  proyecto?: IProyecto;
};

const ProyectoModal = ({ closeModal, refreshProyectos, proyecto }: ProyectoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setFechaInicio(proyecto.fechaInicio);
      setFechaFin(proyecto.fechaFin);
    }
  }, [proyecto]);

  const handleCreateProject = async () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const tareasBd = (await getTareasController()) || [];
    const nextId =
      tareasBd.length > 0
        ? (Math.max(...tareasBd.map((t: IProyecto) => Number(t.id))) + 1).toString()
        : "1";

    const tareaEditada: IProyecto = {
      id: proyecto ? proyecto.id : nextId,
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
    };

    if (proyecto) {
      await updateTareaController(tareaEditada); // Función para actualizar
    } else {
      await createTareaController(tareaEditada); // Función para crear
    }

    refreshProyectos();
    closeModal();
  };

  return (
    <div className={styles.proyectoModal}>
      <div className={styles.proyectoModalContent}>
        <h2 className={styles.proyectoModalTitle}>
          {proyecto ? "Editar Tarea" : "Crear Nueva Tarea"}
        </h2>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Nombre de la tarea:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la tarea"
            className={styles.proyectoInput}
          />
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la tarea"
            className={styles.proyectoTextarea}
          />
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={styles.proyectoInput}
          />
        </div>

        <div className={styles.proyectoFormGroup}>
          <label className={styles.proyectoLabel}>Fecha de Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className={styles.proyectoInput}
          />
        </div>

        <div className={styles.proyectoModalActions}>
          <button className={styles.proyectoButtonCancel} onClick={closeModal}>
            Cancelar
          </button>
          <button className={styles.proyectoButton} onClick={handleCreateProject}>
            {proyecto ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoModal;
