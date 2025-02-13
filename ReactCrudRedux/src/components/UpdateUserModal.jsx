import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUserById, clearError } from "../redux/userSlice";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateUserModal = ({ show, handleClose, userId }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.users.selectedUser);
  const error = useSelector((state) => state.users.error);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Cargar los datos del usuario al abrir el modal
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  // Actualizar los campos del formulario con los datos del usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    }
  }, [selectedUser]);

  // Mostrar errores si ocurren
  useEffect(() => {
    if (error) {
      Swal.fire("Error", error, "error");
    }
  }, [error]);

  // Función para actualizar el usuario
  const handleUpdate = () => {
    if (!name || !email) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    dispatch(updateUser({ id: userId, userData: { name, email } })).then(
      (action) => {
        if (!action.error) {
          Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
          handleCloseModal(); // Cerrar el modal después de la actualización exitosa
        }
      }
    );
  };

  // Limpiar el error y cerrar el modal
  const handleCloseModal = () => {
    dispatch(clearError()); // Limpiar el error
    handleClose(); // Cerrar el modal
  };

  return (
    <div
      className={`modal ${show ? "d-block" : "d-none"}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div
            className="modal-header text-center"
            style={{ borderBottom: "none" }}
          >
            <h5 className="modal-title w-100">Actualizar Usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer" style={{ borderTop: "none" }}>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Validación de PropTypes
UpdateUserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default UpdateUserModal;
