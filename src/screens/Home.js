import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";

export default function Home() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const fetchRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allRestaurants", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success && data.restaurants) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Cabeçalho com busca e localização */}
      <div className="bg-light p-3 shadow-sm">
        <div className="container">
          <input
            className="form-control form-control-lg mb-2"
            type="search"
            placeholder="Procurar prato"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            Entregar em <strong>Localização Exemplo</strong>
          </div>
        </div>
      </div>

      {/* Lista de restaurantes */}
      <div className="container flex-grow-1 mt-3">
        {filteredRestaurants.length > 0 ? (
          <ul className="list-group list-group-flush">
            {filteredRestaurants.map((rest) => (
              <li
                key={rest._id}
                className="list-group-item d-flex justify-content-between align-items-start"
                style={{ cursor: "pointer" }}
                onClick={() => handleRestaurantClick(rest._id)}
              >
                <div>
                  <h5 className="mb-1">{rest.name}</h5>
                  <p className="mb-1 text-muted">
                    {rest.status === "Aberto" ? "Aberto" : "Fechado"} &bull; {rest.waitTime}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center mt-5">Nenhum restaurante encontrado</div>
        )}
      </div>

      {/* Rodapé */}
      <footer className="bg-white border-top py-2 mt-auto">
        <div className="container">
          <div className="row text-center">
            <div className="col">
              <Link to="/" className="text-decoration-none fw-bold text-success">
                Início
              </Link>
            </div>
            <div className="col">
              <Link to="/MyOrder" className="text-decoration-none">
                Pedidos
              </Link>
            </div>
            <div className="col">
              <Link to="/login" className="text-decoration-none">
                Perfil
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}