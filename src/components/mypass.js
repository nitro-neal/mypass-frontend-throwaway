import React, { Component, Link } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdbreact";
import axios from "axios";

class MyPass extends React.Component {
  state = {
    register: true,
    selectedFile: null,
    documentUrls: [],
    ownerAccounts: undefined,
    uploadForAccountName: undefined,
    uploadForAccountId: undefined
  };

  getAccount = async () => {
    console.log("get account1");
    let res = await axios.get("http://localhost:5000/api/account/");
    let account = res.data.account;

    console.log("get account");
    console.log(account);

    if (account.role === "agent") {
      console.log("agent here");
      let res = await axios.get("http://localhost:5000/api/accounts/");
      console.log(res.data);
      let owners = [];
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].role === "owner") {
          let ownerObj = {
            accountId: res.data[i]._id,
            name: res.data[i].username
          };
          owners.push(ownerObj);
        }
      }

      console.log("owners:");
      console.log(owners);
      this.setState({ ownerAccounts: owners });
    }
    this.setState({ username: account.username });
    this.setState({ email: account.email });
    this.setState({ loggedIn: true });

    this.getDocuments();
  };

  logout = async () => {
    localStorage.setItem("jwt", undefined);
    window.location.reload(false);
  };

  getDocuments = async () => {
    let documentsRes = await axios.get(
      "http://localhost:5000/api/accounts/documents/"
    );

    let documents = documentsRes.data.documents;
    let documentUrls = [];

    for (var i = 0; i < documents.length; i++) {
      let documentUrl =
        "http://localhost:5000/api/accounts/documents/" + documents[i].url;
      documentUrls.push(documentUrl);
    }
    this.setState({ documentUrls: documentUrls });
  };

  uploadDocument = async () => {
    const file = document.getElementById("inputGroupFile01").files;
    const formData = new FormData();

    formData.append("img", file[0]);
    if (
      this.state.uploadForAccountName !== undefined &&
      this.state.uploadForAccountId !== undefined
    ) {
      formData.append("uploadForAccountName", this.state.uploadForAccountName);
      formData.append("uploadForAccountId", this.state.uploadForAccountId);
    }

    let res = await fetch("http://localhost:5000/api/accounts/documents/", {
      method: "POST",
      headers: {
        authorization: "Token " + localStorage.getItem("jwt")
      },
      body: formData
    });

    this.getDocuments();
  };

  componentDidMount() {
    let jwt = localStorage.getItem("jwt");
    if (jwt !== undefined && jwt !== "undefined") {
      console.log("jwt");
      console.log(jwt);
      axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
      this.getAccount();
    }
  }

  inputChanged = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  registerLinkClicked = e => {
    let currentValue = this.state.register;
    this.setState({ register: !currentValue });
  };

  register = async () => {
    let body = {
      account: {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      }
    };

    let res = await axios.post("http://localhost:5000/api/accounts/", body);

    let account = res.data.account;
    this.setState({ username: account.username });
    this.setState({ email: account.email });
    this.setState({ loggedIn: true });

    axios.defaults.headers.common["Authorization"] = "Bearer " + account.token;
    localStorage.setItem("jwt", account.token);

    this.getDocuments();
  };

  login = async () => {
    let body = {
      account: {
        email: this.state.email,
        password: this.state.password
      }
    };

    let res = await axios.post(
      "http://localhost:5000/api/accounts/login",
      body
    );

    let account = res.data.account;
    this.setState({ username: account.username });
    this.setState({ email: account.email });
    this.setState({ loggedIn: true });

    axios.defaults.headers.common["Authorization"] = "Bearer " + account.token;
    localStorage.setItem("jwt", account.token);

    this.getDocuments();
  };

  dropdownClicked = e => {
    console.log("drop down clicked");

    this.setState({ uploadForAccountName: e.target.name });
    this.setState({ uploadForAccountId: e.target.id });
  };

  render() {
    let renderOwners;
    let dropDownItems = [];

    if (this.state.ownerAccounts !== undefined) {
      for (var i = 0; i < this.state.ownerAccounts.length; i++) {
        dropDownItems.push(
          <MDBDropdownItem
            id={this.state.ownerAccounts[i].accountId}
            name={this.state.ownerAccounts[i].name}
          >
            {this.state.ownerAccounts[i].name}
          </MDBDropdownItem>
        );
      }

      renderOwners = (
        <MDBDropdown>
          <MDBDropdownToggle caret color="default">
            Upload File For User
          </MDBDropdownToggle>
          <MDBDropdownMenu onClick={this.dropdownClicked} basic>
            {dropDownItems}
          </MDBDropdownMenu>
        </MDBDropdown>
      );
    }

    // register forms
    let formsToPresent = (
      <div>
        <form>
          <p className="h5 text-center mb-4">Sign in</p>
          <div className="grey-text">
            <MDBInput
              name="email"
              onChange={this.inputChanged}
              label="Type your email"
              icon="envelope"
              group
              type="email"
              validate
              error="wrong"
              success="right"
            />
            <MDBInput
              name="password"
              onChange={this.inputChanged}
              label="Type your password"
              icon="lock"
              group
              type="password"
              validate
            />
          </div>
          <div className="text-center">
            <MDBBtn onClick={this.login}>Login</MDBBtn>
          </div>
        </form>

        <div className="text-center">
          <button onClick={this.registerLinkClicked} className="button-link">
            Need to register?
          </button>
        </div>
      </div>
    );

    if (this.state.register === false) {
      formsToPresent = (
        <form>
          <p className="h5 text-center mb-4">Sign in</p>
          <div className="grey-text">
            <MDBInput
              name="username"
              onChange={this.inputChanged}
              label="Type your username"
              icon="user"
              group
              type="text"
            />
            <MDBInput
              name="email"
              onChange={this.inputChanged}
              label="Type your email"
              icon="envelope"
              group
              type="email"
              validate
              error="wrong"
              success="right"
            />
            <MDBInput
              name="password"
              onChange={this.inputChanged}
              label="Type your password"
              icon="lock"
              group
              type="password"
              validate
            />
          </div>
          <div className="text-center">
            <MDBBtn onClick={this.register}>Register</MDBBtn>
          </div>

          <div className="text-center">
            <button onClick={this.registerLinkClicked} className="button-link">
              Need to login?
            </button>
          </div>
        </form>
      );
    }

    //logged in
    if (this.state.loggedIn === true) {
      formsToPresent = (
        <div>
          <h5>Username: {this.state.username}</h5>
          <h5>Email: {this.state.email}</h5>
          <button onClick={this.logout} className="button-link">
            logout
          </button>
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
              aria-describedby="inputGroupFileAddon01"
            />

            <label className="custom-file-label" htmlFor="inputGroupFile01">
              Choose file
            </label>
          </div>
          {renderOwners}
          {/* <input type="file" name="file" onChange={this.onChangeHandler} /> */}
          <MDBBtn
            className="btn btn-success btn-block"
            onClick={this.uploadDocument}
          >
            Upload
          </MDBBtn>
        </div>
      );
    }

    let images = [];

    for (var i = 0; i < this.state.documentUrls.length; i++) {
      images.push(
        <img style={{ width: "350px" }} src={this.state.documentUrls[i]}></img>
      );
    }

    return (
      <MDBContainer style={{ paddingTop: "300px" }} className="center-vert">
        <MDBRow>
          <MDBCol></MDBCol>
          <MDBCol>{formsToPresent}</MDBCol>
          <MDBCol></MDBCol>
        </MDBRow>
        <MDBRow>{images}</MDBRow>
      </MDBContainer>
    );
  }
}

export default MyPass;
