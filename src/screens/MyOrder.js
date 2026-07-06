import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyOrder() {
  const [orderData, setOrderData] = useState({});
  const [orderDocId, setOrderDocId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBulkPayment, setIsBulkPayment] = useState(false);
  const [currentOrderIds, setCurrentOrderIds] = useState([]);

  const [cardNumber, setCardNumber] = useState("");
  const [validity, setValidity] = useState("");
  const [cvc, setCvc] = useState("");

  const fetchMyOrder = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const res = await fetch("http://localhost:5000/api/myOrderData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setOrderData(data);
      if (data.orderData && data.orderData._id) {
        setOrderDocId(data.orderData._id);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  const getAllItems = () => {
    if (!orderData?.orderData?.order_data) return [];
    const allItems = [];
    orderData.orderData.order_data.forEach((group, groupIndex) => {
      group.forEach((item, itemIndex) => {
        if (!item.Order_date) {
          const uniqueId = orderDocId
            ? `${orderDocId}_${groupIndex}_${itemIndex}`
            : `${groupIndex}_${itemIndex}`;
          allItems.push({ ...item, _computedId: uniqueId });
        }
      });
    });
    return allItems;
  };

  const allItems = getAllItems();
  const orders = orderData?.orderData?.order_data || [];

  const handlePaySingle = (computedId) => {
    setCurrentOrderIds([computedId]);
    setIsBulkPayment(false);
    setCardNumber("");
    setValidity("");
    setCvc("");
    setShowPaymentModal(true);
  };

  const handlePayAll = () => {
    if (allItems.length === 0) {
      alert("Nenhum pedido para pagar.");
      return;
    }
    const ids = allItems.map((item) => item._computedId).filter(Boolean);
    setCurrentOrderIds(ids);
    setIsBulkPayment(true);
    setCardNumber("");
    setValidity("");
    setCvc("");
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    const email = localStorage.getItem("userEmail");
    if (!cardNumber || !validity || !cvc) {
      alert("Preencha todos os campos do cartão.");
      return;
    }
    if (currentOrderIds.length === 0) {
      alert("Nenhum pedido selecionado.");
      return;
    }

    try {
      const paymentRes = await fetch("http://localhost:5000/api/processPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          orderIds: currentOrderIds,
          cardNumber,
          validity,
          cvc,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentData.success) {
        alert("Erro ao processar pagamento.");
        return;
      }

      const deleteRes = await fetch("http://localhost:5000/api/deleteOrderItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          itemIds: currentOrderIds,
        }),
      });
      const deleteData = await deleteRes.json();

      if (deleteData.success) {
        const newOrderData = orders
          .map((group, groupIndex) =>
            group.filter((item, itemIndex) => {
              if (item.Order_date) return true; 
              const computedId = orderDocId
                ? `${orderDocId}_${groupIndex}_${itemIndex}`
                : `${groupIndex}_${itemIndex}`;
              return !currentOrderIds.includes(computedId);
            })
          )
          .filter((group) => group.length > 0);

        setOrderData((prev) => ({
          ...prev,
          orderData: {
            ...prev.orderData,
            order_data: newOrderData,
          },
        }));

        alert("Pagamento processado e pedidos removidos com sucesso!");
      } else {
        alert("Pagamento realizado, mas houve erro ao limpar o histórico.");
      }

      setShowPaymentModal(false);
    } catch (error) {
      console.error("Erro no pagamento:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-light mb-0">Meus Pedidos</h3>
          {allItems.length > 0 && (
            <button className="btn btn-warning" onClick={handlePayAll}>
              Pagar Tudo
            </button>
          )}
        </div>
        <div className="row">
          {orders.length > 0 ? (
            orders.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.map((item, itemIndex) => {
                  const computedId = orderDocId
                    ? `${orderDocId}_${groupIndex}_${itemIndex}`
                    : `${groupIndex}_${itemIndex}`;

                  if (item.Order_date) {
                    return (
                      <div key={`date-${groupIndex}-${itemIndex}`} className="m-auto mt-3">
                        <h5 className="text-light">{item.Order_date}</h5>
                        <hr className="text-light" />
                      </div>
                    );
                  }
                  return (
                    <div key={computedId} className="col-12 col-md-6 col-lg-3">
                      <div
                        className="card mt-3 bg-dark text-light"
                        style={{ width: "16rem", maxHeight: "360px" }}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text small">
                            Qtd: {item.qty} | Tamanho: {item.size}
                          </p>
                          <p className="card-text">
                            Preço: R$ {item.price}
                          </p>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handlePaySingle(computedId)}
                          >
                            Pagar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))
          ) : (
            <p className="text-light">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>

      {/* Modal do Pagamento */}
      {showPaymentModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  {isBulkPayment ? "Pagar Todos os Pedidos" : "Pagamento"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Número do Cartão</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Validade (MM/AA)</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    placeholder="12/99"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">CVC</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light border-secondary"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handlePaymentSubmit}
                >
                  Confirmar Pagamento
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