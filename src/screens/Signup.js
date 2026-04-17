import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const onChange = (e) => {
    setcredenciais({ ...credenciais, [e.target.nome]: e.target.value });
  };
  const [credenciais, setcredenciais] = useState({
    nome: "",
    email: "",
    senha: "",
    localizacao: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/creatuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: credenciais.nome,
        email: credenciais.email,
        senha: credenciais.senha,
        location: credenciais.localizacao,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("Enter valid credenciais");
    }
  };
  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              nome
            </label>
            <input
              type="text"
              className="form-control"
              nome="nome"
              value={credenciais.nome}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              nome="email"
              value={credenciais.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              Não compartilhamos seus dados com ninguem.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              senha
            </label>
            <input
              type="senha"
              className="form-control"
              id="exampleInputPassword1"
              nome="senha"
              value={credenciais.senha}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Localização
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              nome="localizacao"
              value={credenciais.localizacao}
              onChange={onChange}
            />
          </div>
          <button type="submit" className=" m-3 btn btn-success">
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
