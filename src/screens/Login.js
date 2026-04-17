import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  let navigate = useNavigate();
  const onChange = (e) => {
    setcredentials({ ...credenciais, [e.target.name]: e.target.value });
  };
  const [credenciais, setcredentials] = useState({
    email: "",
    password: "",
  });
  const formSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credenciais.email,
        password: credenciais.password,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("EMAIL OU PASSWORD ERRADOS");
    }
    if (json.success) {
      localStorage.setItem("userEmail", credenciais.email);
      localStorage.setItem("authToken", json.authToken);
      navigate("/");
    }
  };
  return (
    <>
      <div className="container">
        <form onSubmit={formSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Endereço de Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              value={credenciais.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              Não compartilhamos seus dados com ninguem
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={credenciais.password}
              onChange={onChange}
            />
          </div>

          <button type="submit" className=" m-3 btn btn-success">
            Enviar
          </button>
          <Link to="/signup" className="m-3 btn btn-danger">
            Sou um novo usuário
          </Link>
        </form>
      </div>
    </>
  );
}
