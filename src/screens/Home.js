import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";

export default function Home() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const dummyData = [
      {
        _id: "1",
        name: "DA PRAÇA RESTAURANTE",
        description: "Lanches, Comida.",
        rating: '5.0', // todo: Tem que ser dinamico, não estático. fazer isso depois.
      },
      {
        _id: "2",
        name: "CORDERO ESPETARIA E CHOPPERIA",
        description: "Carnes, Churrasco, Cerveja.",
        rating: '5.0',
      },
      {
        _id: "3",
        name: "MIYABI COMIDA JAPONESA",
        description: "Comida Japonesa.",
        rating: '5.0',
      },
      {
        _id: "4",
        name: "SEM CAÔ HAMBURGUERIA E CREPERIA",
        description: "Hamburguers e Crepês.",
        rating: '5.0',
      },
      {
        _id: "5",
        name: "ALINE AÇAÍ, SOBREMESAS E MARMITAS FIT",
        description: "Doces, Açaí e Marmitas.",
        rating: '5.0',
      },
    ];
    setRestaurants(dummyData);
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // navega para a tela de detalhes do restaurante clicado. Só funciona com o restaurante 1 pq tá ruim. pelo menos os ids estão funcionandos. 
  // TODO: IDS de restaurantes
  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* cabeçalho com busca e localização */}
      {/* bugado por enquanto. TODO: termina isso. */}
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
      {/* lista de restaurantes */}
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
                  <p className="mb-1 text-muted">{rest.description}</p>
                  <small className="text-warning">
                    {"●".repeat(Math.floor(rest.rating))} {rest.rating}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center mt-5">Nenhum restaurante encontrado</div>
        )}
      </div>
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