import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { RESTAURANTS_DATA } from "../data/restaurantData";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = RESTAURANTS_DATA[id] || null;
  const [activeCategory, setActiveCategory] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setIsSticky(window.scrollY >= headerHeight - 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (index) => {
    setActiveCategory(index);
    if (sectionRefs.current[index]) {
      const yOffset = tabsRef.current ? tabsRef.current.offsetHeight : 0;
      const element = sectionRefs.current[index];
      const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    const initialOptions = {};
    if (item.details) {
      item.details.forEach((section, idx) => {
        initialOptions[idx] = null;
      });
    }
    setSelectedOptions(initialOptions);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedOptions({});
  };
  const isOrderValid = () => {
    if (!selectedItem || !selectedItem.details) return true; // sem opções = sempre válido
    return selectedItem.details.every((section, idx) => {
      if (section.required) {
        return selectedOptions[idx] !== null && selectedOptions[idx] !== undefined;
      }
      return true;
    });
  };
  const handleAddToOrder = async () => {
    if (!isOrderValid()) {
      alert("Selecione todas as opções obrigatórias.");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Você precisa estar logado para fazer um pedido.");
      navigate("/login");
      return;
    }
    const orderItem = {
      name: selectedItem.name,
      price: selectedItem.price,
      description: selectedItem.description,
      options: selectedItem.details?.map((section, idx) => ({
        title: section.title,
        selected: selectedOptions[idx] !== null ? section.options[selectedOptions[idx]].name : null,
        selectedPrice: selectedOptions[idx] !== null ? section.options[selectedOptions[idx]].price : null,
      })),
      qty: 1,
      size: "",
    };

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          order_data: [orderItem],
          order_date: new Date().toDateString(),
        }),
      });

      const json = await response.json();
      if (json.success) {
        alert("Pedido adicionado com sucesso!");
        closeItemModal();
      } else {
        alert("Erro ao adicionar pedido.");
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (!restaurant) {
    return (
      <div className="container mt-5 text-center">
        <h3>Restaurante não encontrado.</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Cabeçalho */}
      <div ref={headerRef} className="bg-white px-3 pt-3 pb-1">
        <h2 className="mb-1">{restaurant.name}</h2>
        <p className="text-muted">{restaurant.waitTime}</p>
      </div>

      {/* Abas de categorias */}
      {restaurant.categories && restaurant.categories.length > 0 && (
        <div
          ref={tabsRef}
          className={`bg-light border-bottom ${
            isSticky ? "position-fixed top-0 start-0 w-100 shadow-sm" : ""
          }`}
          style={{ zIndex: 1020 }}
        >
          <div className="d-flex overflow-auto px-2 py-2 gap-1">
            {restaurant.categories.map((cat, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  index === activeCategory ? "btn-success" : "btn-outline-success"
                } text-nowrap`}
                onClick={() => scrollToCategory(index)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo das categorias */}
      <div
        className="container flex-grow-1 mt-3"
        style={isSticky ? { paddingTop: tabsRef.current?.offsetHeight || 0 } : {}}
      >
        {restaurant.categories.map((category, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="mb-4"
          >
            <h4 className="mb-2">{category.name}</h4>
            {category.items.length > 0 ? (
              <ul className="list-group list-group-flush">
                {category.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="list-group-item d-flex justify-content-between align-items-start"
                    style={{ cursor: item.details ? "pointer" : "default" }}
                    onClick={() => item.details && openItemModal(item)}
                  >
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="mb-1 text-muted small">{item.description}</p>
                      <strong className="text-success">Por R$ {item.price}</strong>
                    </div>
                    {item.details && (
                      <span className="text-muted ms-2">+</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Nenhum item disponível.</p>
            )}
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <footer className="bg-white border-top py-2 mt-auto">
        <div className="container">
          <div className="row text-center">
            <div className="col">
              <Link to="/" className="text-decoration-none">Voltar</Link>
            </div>
            <div className="col">
              <Link to="/" className="text-decoration-none fw-bold text-success">Início</Link>
            </div>
            <div className="col">
              <Link to="/MyOrder" className="text-decoration-none">Pedidos</Link>
            </div>
            <div className="col">
              <Link to="/login" className="text-decoration-none">Perfil</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de detalhe do item com seleção de opções */}
      {selectedItem && (
        <Modal onClose={closeItemModal}>
          <div className="text-white p-3 h-100 d-flex flex-column">
            <h3>Detalhes do Item</h3>
            <hr />
            <h4>{selectedItem.name}</h4>
            <p className="text-muted">{selectedItem.description}</p>
            <p className="text-success fs-5">Por R$ {selectedItem.price}</p>
            <div className="overflow-auto flex-grow-1 mt-3">
              {selectedItem.details?.map((section, sIdx) => (
                <div key={sIdx} className="mb-3">
                  <h6 className="text-uppercase">{section.title}</h6>
                  <p className="mb-1 small">
                    Escolha?{" "}
                    <span className={section.required ? "text-danger" : ""}>
                      {section.required ? "Obrigatório" : "Opcional"}
                    </span>
                  </p>
                  {section.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="form-check bg-dark text-white border-secondary rounded p-2 mb-1"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`section-${sIdx}`}
                        id={`opt-${sIdx}-${oIdx}`}
                        checked={selectedOptions[sIdx] === oIdx}
                        onChange={() =>
                          setSelectedOptions((prev) => ({ ...prev, [sIdx]: oIdx }))
                        }
                      />
                      <label
                        className="form-check-label d-flex justify-content-between align-items-center"
                        htmlFor={`opt-${sIdx}-${oIdx}`}
                      >
                        <div>
                          <span>{opt.name}</span>
                          {opt.subtext && (
                            <small className="d-block text-muted">{opt.subtext}</small>
                          )}
                        </div>
                        {opt.price && (
                          <span className="text-success ms-2">R$ {opt.price}</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={handleAddToOrder}
              disabled={!isOrderValid()}
            >
              Adicionar ao pedido
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}