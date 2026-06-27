import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [credenciais, setcredenciais] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  const onChange = (e) => {
    setcredenciais({ ...credenciais, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/creatuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credenciais.name,
        email: credenciais.email,
        password: credenciais.password,
        location: credenciais.location,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("Dados inválidos. Verifique as informações.");
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={credenciais.name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credenciais.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              Não compartilhamos seus dados com ninguém.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credenciais.password}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Localização
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={credenciais.location}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="m-3 btn btn-success">
            Enviar
          </button>
          <Link to="/login" className="m-3 btn btn-danger">
            Já é um usuário
          </Link>
        </form>
      </div>
    </>
  );
}