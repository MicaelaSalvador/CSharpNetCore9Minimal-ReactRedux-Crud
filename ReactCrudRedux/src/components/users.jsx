import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
  clearError,
} from "../redux/userSlice";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateUserModal from "./UpdateUserModal";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const error = useSelector((state) => state.users.error);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire("Error", error, "error");
      setName("");
      setEmail("");
    }
  }, [error]);

  const handleCreate = () => {
    if (!name || !email) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }
    dispatch(createUser({ name, email })).then((action) => {
      if (!action.error) {
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
        setName("");
        setEmail("");
        dispatch(fetchUsers());
      }
    });
  };

  const handleDelete = (id, userName) => {
    Swal.fire({
      title: `¿Está seguro que desea eliminar al usuario ${userName}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id)).then((action) => {
          if (!action.error) {
            Swal.fire(
              "Eliminado",
              "Usuario eliminado correctamente",
              "success"
            );
            dispatch(fetchUsers());
          }
        });
      }
    });
  };

  const handleUpdateClick = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
    dispatch(clearError());
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>{" "}
      {/* Título centrado */}
      <div className="d-flex justify-content-center">
        <div style={{ width: "75%" }}>
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100" onClick={handleCreate}>
                Crear Usuario
              </button>
            </div>
          </div>

          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleUpdateClick(user.id)}
                      >
                        Actualizar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <UpdateUserModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          userId={selectedUserId}
        />
      )}
    </div>
  );
};

export default Users;
