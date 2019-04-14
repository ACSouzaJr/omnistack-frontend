import React, { Component } from "react";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";
import "./styles.css";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket("https://omniatack-backend-33.herokuapp.com");
    io.emit("connectRoom", box);
    // se connecta a uma sala com o id da box
    // quando atualizado todos da sala recebem a atualização
    io.on("file", data => {
      // recebe o novo file nesse evento
      this.setState(prevState => {
        return {
          box: {
            ...prevState.box,
            files: [data, ...prevState.box.files]
          }
        };
      });
    });
  };

  uploadHandler = files => {
    files.forEach(file => {
      const box = this.props.match.params.id;
      const data = new FormData();
      data.append("file", file);
      console.log(data);
      api.post(`boxes/${box}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.uploadHandler}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt
                  })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
