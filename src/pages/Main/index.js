import React, { Component } from "react";
import logo from "../../assets/logo.svg";
import "./styles.css";
import api from "../../services/api";

export default class Main extends Component {
  state = {
    boxName: ""
  };

  inputChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  submitHandler = async e => {
    e.preventDefault();
    const response = await api.post("/boxes", {
      title: this.state.boxName
    });
    // console.log(response.data);
    this.props.history.push(`/box/${response.data._id}`);
  };

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.submitHandler}>
          <img src={logo} alt="" />
          <input
            type="text"
            name="boxName"
            placeholder="Criar um Box"
            onChange={this.inputChangeHandler}
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    );
  }
}
