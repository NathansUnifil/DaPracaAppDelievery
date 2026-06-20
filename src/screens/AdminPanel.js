import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RESTAURANTS_DATA } from "../data/restaurantData";
import { ORDERS_DATA } from "../data/orderData";
import { USERS_DATA } from "../data/userData";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState(RESTAURANTS_DATA);
  const [users, setUsers] = useState(USERS_DATA);
  const [orders, setOrders] = useState(ORDERS_DATA);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("Aberto");
  const [newWaitTime, setNewWaitTime] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editWaitTime, setEditWaitTime] = useState("");

  const restaurantList = Object.entries(restaurants || {}).map(([id, data]) => ({
    _id: id,
    name: data.name,
    status: data.status,
  }));

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir o restaurante?")) {
      setRestaurants((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleEditClick = (id) => {
    const restaurant = restaurants[id];
    if (restaurant) {
      setEditId(id);
      setEditName(restaurant.name);
      setEditStatus(restaurant.status);
      setEditWaitTime(restaurant.waitTime || "");
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    setRestaurants((prev) => ({
      ...prev,
      [editId]: {
        ...prev[editId],
        name: editName,
        status: editStatus,
        waitTime: editWaitTime || prev[editId].waitTime,
      },
    }));
    setShowEditModal(false);
    setEditId(null);
  };

  const handleAddRestaurant = () => {
    if (!newName.trim()) return;
    const existingIds = Object.keys(restaurants).map(Number).filter((n) => !isNaN(n));
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const newRestaurant = {
      name: newName,
      status: newStatus,
      waitTime: newWaitTime || "Indisponível",
      categories: [],
    };
    setRestaurants((prev) => ({
      ...prev,
      [newId.toString()]: newRestaurant,
    }));
    setNewName("");
    setNewStatus("Aberto");
    setNewWaitTime("");
    setShowAddModal(false);
  };

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
                {(orders || []).map((order) => (
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
                {(users || []).map((u, idx) => (
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

        {/* Modal Add */}
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

        {/* Modal Editar */}
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
      </div>
      <Footer />
    </div>
  );
}