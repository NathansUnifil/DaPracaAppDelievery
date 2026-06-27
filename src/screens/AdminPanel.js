import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("Aberto");
  const [newWaitTime, setNewWaitTime] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editWaitTime, setEditWaitTime] = useState("");
  const [editRating, setEditRating] = useState(0);
  const fetchRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allRestaurants", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success && data.restaurants) {
        const obj = {};
        data.restaurants.forEach((r) => {
          obj[r._id] = {
            _id: r._id,
            name: r.name,
            status: r.status,
            waitTime: r.waitTime,
            rating: r.rating || 0,
          };
        });
        setRestaurants(obj);
      }
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allOrderData", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success && data.orders) {
        const formatted = data.orders.map((order) => ({
          id: order._id,
          user: order.email,
          total: "R$ xx,xx",
          status: order.status || "Pendente",
        }));
        setOrders(formatted);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allUsers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success && data.users) {
        const formatted = data.users.map((user) => ({
          email: user.email,
          name: user.name,
          registered: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("pt-BR")
            : "N/A",
        }));
        setUsers(formatted);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
    fetchUsers();
  }, []);
  const handleAddRestaurant = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/addRestaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          status: newStatus,
          waitTime: newWaitTime || "Indisponível",
          rating: newRating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRestaurants((prev) => ({
          ...prev,
          [data.restaurant._id]: {
            _id: data.restaurant._id,
            name: data.restaurant.name,
            status: data.restaurant.status,
            waitTime: data.restaurant.waitTime,
            rating: data.restaurant.rating,
          },
        }));
        setNewName("");
        setNewStatus("Aberto");
        setNewWaitTime("");
        setNewRating(0);
        setShowAddModal(false);
      } else {
        alert("Erro ao adicionar restaurante");
      }
    } catch (error) {
      console.error("Erro ao adicionar restaurante:", error);
    }
  };

  const handleEditClick = (id) => {
    const restaurant = restaurants[id];
    if (restaurant) {
      setEditId(id);
      setEditName(restaurant.name);
      setEditStatus(restaurant.status);
      setEditWaitTime(restaurant.waitTime || "");
      setEditRating(restaurant.rating || 0);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/updateRestaurant/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          status: editStatus,
          waitTime: editWaitTime,
          rating: editRating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRestaurants((prev) => ({
          ...prev,
          [editId]: {
            ...prev[editId],
            name: data.restaurant.name,
            status: data.restaurant.status,
            waitTime: data.restaurant.waitTime,
            rating: data.restaurant.rating,
          },
        }));
        setShowEditModal(false);
        setEditId(null);
      } else {
        alert("Erro ao editar restaurante");
      }
    } catch (error) {
      console.error("Erro ao editar restaurante:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir o restaurante?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/deleteRestaurant/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setRestaurants((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        alert("Erro ao excluir restaurante");
      }
    } catch (error) {
      console.error("Erro ao excluir restaurante:", error);
    }
  };
  const restaurantList = Object.values(restaurants);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-light mb-4">Painel de Administração</h2>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "restaurants" ? "active" : "text-light"}`}
              onClick={() => setActiveTab("restaurants")}
            >
              Restaurantes
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : "text-light"}`}
              onClick={() => setActiveTab("orders")}
            >
              Pedidos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "users" ? "active" : "text-light"}`}
              onClick={() => setActiveTab("users")}
            >
              Usuários
            </button>
          </li>
        </ul>

        {/* Aba Restaurantes */}
        {activeTab === "restaurants" && (
          <>
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurantList.map((r) => (
                    <tr key={r._id}>
                      <td>{r._id}</td>
                      <td>{r.name}</td>
                      <td>
                        <span className={`badge bg-${r.status === "Aberto" ? "success" : "danger"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>{r.rating}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning me-1"
                          onClick={() => handleEditClick(r._id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(r._id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
              + Adicionar Restaurante
            </button>
          </>
        )}

        {/* Aba Pedidos */}
        {activeTab === "orders" && (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Usuário</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user}</td>
                    <td>{order.total}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Aba Usuários */}
        {activeTab === "users" && (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nome</th>
                  <th>Registrado em</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={idx}>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{u.registered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Adicionar Novo Restaurante</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome do restaurante"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select bg-secondary text-light border-secondary"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tempo de espera</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={newWaitTime}
                    onChange={(e) => setNewWaitTime(e.target.value)}
                    placeholder="Ex: 30-40 min"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control bg-secondary text-light border-secondary"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleAddRestaurant}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Editar Restaurante</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select bg-secondary text-light border-secondary"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tempo de espera</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={editWaitTime}
                    onChange={(e) => setEditWaitTime(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control bg-secondary text-light border-secondary"
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleSaveEdit}>
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}