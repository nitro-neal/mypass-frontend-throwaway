import React, { Component, Link } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBAlert,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBAnimation
} from "mdbreact";
import axios from "axios";

class OwnerWorkflow extends React.Component {
  state = { loggedInAsOwner: false, documentTypes: [], modal: false, uploadDisabled: true, currentUploadType: "", uploadDocumentFinished: false, documentTypeToUrlMap: {} };

  fileSelected = () => {
    this.setState({ uploadDisabled: false });
  };

  getAccountData = async () => {
    let res = await axios.get("http://localhost:5000/api/documenttypes/");
    console.log(res);
    this.setState({ documentTypes: res.data.documentTypes });
    this.getDocuments();
  };

  uploadDocument = async () => {
    const file = document.getElementById("inputGroupFile01").files;
    const formData = new FormData();
    formData.append("img", file[0]);
    formData.append("type", this.state.currentUploadType);

    if (this.state.uploadForAccountName !== undefined && this.state.uploadForAccountId !== undefined) {
      formData.append("uploadForAccountName", this.state.uploadForAccountName);
      formData.append("uploadForAccountId", this.state.uploadForAccountId);

      let res = await fetch("http://localhost:5000/api/uploadDocumentOnBehalfOfUser/", {
        method: "POST",
        headers: {
          authorization: "Token " + localStorage.getItem("jwt")
        },
        body: formData
      });
    } else {
      let res = await fetch("http://localhost:5000/api/documents/", {
        method: "POST",
        headers: {
          authorization: "Token " + localStorage.getItem("jwt")
        },
        body: formData
      });
    }

    this.setState({ uploadDocumentFinished: true });
    this.getDocuments();
  };

  getDocuments = async () => {
    let documentsRes = await axios.get("http://localhost:5000/api/documents/");
    let documents = documentsRes.data.documents;
    let documentTypeToUrlMap = {};

    for (var i = 0; i < documents.length; i++) {
      let documentUrl = "http://localhost:5000/api/documents/" + documents[i].url;
      let type = documents[i].type;
      documentTypeToUrlMap[type] = documentUrl;
    }

    this.setState({ documentTypeToUrlMap: documentTypeToUrlMap });
  };

  loginAsOwner = async () => {
    this.setState({ loggedInAsOwner: true });
    let body = {
      account: {
        email: "owner@owner.com",
        password: "owner"
      }
    };

    let loginRes = await axios.post("http://localhost:5000/api/accounts/login", body);

    let account = loginRes.data.account;

    axios.defaults.headers.common["Authorization"] = "Bearer " + account.token;
    localStorage.setItem("jwt", account.token);

    this.getAccountData();
  };

  logout = async () => {
    localStorage.setItem("jwt", undefined);
    window.location.reload(false);
  };

  toggle = name => () => {
    this.setState({ uploadDocumentFinished: false });
    this.setState({ currentUploadType: name });
    this.setState({ uploadDisabled: true });
    this.setState({
      modal: !this.state.modal
    });
  };

  componentDidMount = () => {
    let jwt = localStorage.getItem("jwt");
    if (jwt !== undefined && jwt !== "undefined") {
      axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
      this.setState({ loggedInAsOwner: true });
      this.getAccountData();
    }
  };
  render() {
    let mainContent;
    let recordRows = [];

    for (let document of this.state.documentTypes) {
      let documentName = document.name;
      recordRows.push(
        <div>
          <MDBRow>
            <MDBCol size="4">
              <div style={{ verticalAlign: "bottom", marginTop: "40px" }}>
                {this.state.documentTypeToUrlMap[documentName] === undefined ? (
                  <MDBIcon style={{ width: "100px", verticalAlign: "middle", paddingRight: "30px" }} icon="file" size="4x" />
                ) : (
                  <img src={this.state.documentTypeToUrlMap[documentName]} style={{ width: "100px", verticalAlign: "middle", paddingRight: "30px" }} />
                )}

                <span>{documentName}</span>
              </div>
            </MDBCol>
            <MDBCol size="2">
              {/* <div style={{ verticalAlign: "bottom", marginTop: "30px" }}>
                <img style={{ width: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} class="circular--square" src="newimages/owner.png" />
              </div> */}

              <div class="text-center" style={{ verticalAlign: "bottom", marginTop: "50px" }}>
                <p style={{ marginLeft: "auto", marginRight: "auto" }}>-</p>
              </div>
            </MDBCol>
            <MDBCol size="2">
              {/* <div style={{ marginTop: "20px" }}>
                <img style={{ width: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} class="circular--square" src="newimages/owner.png" />
              </div>
              <div class="text-block-22">Jan 9, 2020</div> */}

              <div style={{ marginTop: "40px" }}>
                <div style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
                  {/* <div class="text-center" style={{ verticalAlign: "bottom" }}>
                    <p style={{ color: "#d3d3d3", marginLeft: "auto", marginRight: "auto" }}>Not Uploaded</p>
                  </div> */}

                  {this.state.documentTypeToUrlMap[documentName] === undefined ? (
                    <MDBBtn onClick={this.toggle(documentName)} color="mdb-color">
                      Upload
                    </MDBBtn>
                  ) : (
                    <div>
                      <div style={{ verticalAlign: "bottom", marginTop: "30px" }}>
                        <img style={{ width: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} class="circular--square" src="newimages/owner.png" />
                      </div>
                      <p>Feb 5, 2020</p>
                    </div>
                  )}
                </div>
              </div>
            </MDBCol>
            <MDBCol size="2">
              {/* <div style={{ marginTop: "40px" }}>
                <div class="text-block-22">June 4, 2023</div>
              </div> */}
              <div class="text-center" style={{ verticalAlign: "bottom", marginTop: "50px" }}>
                <p style={{ marginLeft: "auto", marginRight: "auto" }}>-</p>
              </div>
            </MDBCol>
            <MDBCol size="2">
              {/* <div style={{ marginTop: "40px" }}>
                <MDBIcon style={{ width: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} icon="check-circle" />
              </div> */}

              <div class="text-center" style={{ verticalAlign: "bottom", marginTop: "50px" }}>
                <p style={{ marginLeft: "auto", marginRight: "auto" }}>-</p>
              </div>
            </MDBCol>
          </MDBRow>

          <hr></hr>
        </div>
      );
    }

    let modal = (
      <MDBModal size="large" isOpen={this.state.modal} toggle={this.toggle("")} centered>
        <MDBModalHeader toggle={this.toggle("")}>
          <p>
            <MDBIcon far icon="file" /> {"   "}Document Upload
          </p>
        </MDBModalHeader>

        {this.state.uploadDocumentFinished === true ? (
          <MDBAnimation type="flipInX">
            <h1 style={{ marginLeft: "auto", marginRight: "auto" }}>Upload Finished</h1>
          </MDBAnimation>
        ) : (
          <div>
            <MDBModalBody>
              <div className="custom-file">
                <input onClick={this.fileSelected} type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />

                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose file
                </label>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn disabled={this.state.uploadDisabled} onClick={this.uploadDocument} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} color="primary">
                Save
              </MDBBtn>
            </MDBModalFooter>
          </div>
        )}
      </MDBModal>
    );

    if (this.state.loggedInAsOwner === true) {
      mainContent = (
        <div>
          {modal}
          <MDBRow>
            <MDBCol size="1">
              {/* Side bar */}
              <div class="div-block-68" style={{ width: "100px", height: "1317px" }}>
                <div>
                  <div class="div-block-36">
                    <div data-w-id="ddbc8949-2fc3-f476-97de-60228bd6fa89" class="div-block-91" style={{ width: "90px", height: "80px" }}></div>
                  </div>
                </div>
                <div data-w-id="fd40dfd9-11f3-d26b-9e05-bf6a430b3346" class="div-block-92">
                  <div class="div-block-38">
                    <div class="div-block-37"></div>
                  </div>
                </div>
              </div>
            </MDBCol>
            <MDBCol size="9">
              <div style={{ paddingTop: "110px" }}>
                <div class="div-block-109">
                  <h1 style={{ fontWeight: "bold" }} class="heading-3">
                    My Documents
                  </h1>
                </div>
              </div>
              <hr></hr>
              <MDBRow>
                <MDBCol size="4">
                  <div class="text-block-16 name">NAME</div>
                </MDBCol>
                <MDBCol size="2">
                  <div class="text-block-16">SHARED WITH</div>
                </MDBCol>
                <MDBCol size="2">
                  <div class="text-block-16">UPLOADED</div>
                </MDBCol>
                <MDBCol size="2">
                  <div class="text-block-16">VALID UNTIL</div>
                </MDBCol>
                <MDBCol size="2">
                  <div class="text-block-16">NOTARIZED</div>
                </MDBCol>
              </MDBRow>
              {recordRows}
            </MDBCol>
            <MDBCol size="2">
              <img style={{ marginTop: "47px", width: "50px" }} class="circular--square" src="newimages/owner.png" />
              <p style={{ paddingLeft: "3px" }}>
                <button onClick={this.logout} className="button-link">
                  logout
                </button>
              </p>
            </MDBCol>
          </MDBRow>
        </div>
      );
    } else {
      mainContent = (
        <MDBRow>
          <MDBCol></MDBCol>
          <MDBCol>
            <img style={{ marginTop: "300px", width: "350px", display: "block", marginLeft: "auto", marginRight: "auto" }} src="./newimages/mypass-logo.png"></img>
            <div style={{ marginTop: "100px" }}>
              <img style={{ width: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} class="circular--square" src="newimages/owner.png" />
              <MDBBtn onClick={this.loginAsOwner} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} color="primary">
                Login As Owner
              </MDBBtn>
            </div>
          </MDBCol>
          <MDBCol></MDBCol>
        </MDBRow>
      );
    }
    return <div>{mainContent}</div>;
  }
}

export default OwnerWorkflow;
