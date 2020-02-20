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
import DetailTabs from "./detailTabs";
import moment from "moment";
import SearchBar from "./searchbar";

class CaseWorkerWorkflow extends React.Component {
  state = {
    caseWorkerAccount: {},
    loggedInAsCaseWorker: true,
    ownerAccountsForSearch: [],
    ownerAccounts: [],
    selectedAccout: {},
    uploadModal: false,
    availableDocumentTypes: [],
    shareRequests: []
  };

  toggleUploadModal = () => {
    this.setState({
      uploadModal: !this.state.uploadModal
    });
  };

  requestDocument = name => async () => {
    console.log("request doc");
    let body = {
      documentRequest: {
        accountId: this.state.selectedAccout._id,
        documentType: name
      }
    };

    let res = await axios.post(this.props.urlBase + "/api/shareRequest/", body);

    console.log(res);
  };

  fileSelected = () => {
    this.setState({ uploadDisabled: false });
  };

  getAllAccounts = async () => {
    console.log("get accounts");
    let res = await axios.get(this.props.urlBase + "/api/accounts/");
    console.log(res.data);
    let ownerAccountsForSearch = [];
    for (let account of res.data) {
      if (account.role === "owner") {
        let imgSrc = "newimages/anon-user.png";
        if (account.username === "sallyowner") {
          imgSrc = "newimages/owner.png";
        }
        let ownerAccount = {
          first: account.username,
          last: account.role,
          imgSrc: imgSrc,
          id: account._id
        };
        ownerAccountsForSearch.push(ownerAccount);
      }
    }

    this.setState({ ownerAccountsForSearch: ownerAccountsForSearch });
    this.setState({ ownerAccounts: res.data });
  };

  getAccountData = async () => {
    // let res = await axios.get(this.props.urlBase + "/api/documenttypes/");
    // console.log(res);
    // this.setState({ documentTypes: res.data.documentTypes });
    // this.getDocuments();
  };

  ownerSelectedFromDropdown = async owner => {
    console.log("from dropdown");
    console.log(owner);

    const found = this.state.ownerAccounts.find(
      element => element._id === owner.id
    );
    console.log(found);
    this.setState({ selectedAccout: found });

    const documentTypes = [];
    let res = await axios.get(
      this.props.urlBase + "/api/account/" + found._id + "/documenttypes"
    );

    let sqRes = await axios.get(
      this.props.urlBase + "/api/account/" + found._id + "/sharerequests"
    );

    this.setState({ shareRequests: sqRes.data });

    console.log(res.data);
    this.setState({ availableDocumentTypes: res.data });
  };

  uploadDocument = async () => {
    this.setState({ uploadDocumentFinished: true });
    const file = document.getElementById("inputGroupFile01").files;
    const formData = new FormData();
    formData.append("img", file[0]);
    formData.append("type", this.state.currentUploadType);

    if (
      this.state.uploadForAccountName !== undefined &&
      this.state.uploadForAccountId !== undefined
    ) {
      formData.append("uploadForAccountName", this.state.uploadForAccountName);
      formData.append("uploadForAccountId", this.state.uploadForAccountId);

      let res = await fetch(
        this.props.urlBase + "/api/uploadDocumentOnBehalfOfUser/",
        {
          method: "POST",
          headers: {
            authorization: "Token " + localStorage.getItem("jwt-caseworker")
          },
          body: formData
        }
      );
    } else {
      let res = await fetch(this.props.urlBase + "/api/documents/", {
        method: "POST",
        headers: {
          authorization: "Token " + localStorage.getItem("jwt-caseworker")
        },
        body: formData
      });
    }

    // this.setState({ uploadDocumentFinished: true });
    this.getDocuments();
  };

  getDocuments = async () => {
    let documentsRes = await axios.get(this.props.urlBase + "/api/documents/");
    let documents = documentsRes.data.documents;
    console.log("documents:");
    console.log(documents);
    let documentTypeToUrlMap = {};

    for (var i = 0; i < documents.length; i++) {
      let documentUrl =
        this.props.urlBase + "/api/documents/" + documents[i].url;
      let date = moment(documents[i].createdAt);
      let humanReadable = date.format("MMM Do YYYY");
      let docObject = { createdAt: humanReadable, url: documentUrl };
      let type = documents[i].type;
      documentTypeToUrlMap[type] = docObject;
    }

    this.setState({ documentTypeToUrlMap: documentTypeToUrlMap });
  };

  loginAsCaseWorker = async () => {
    this.setState({ loggedInAsOwner: true });
    let body = {
      account: {
        email: "caseworker@caseworker.com",
        password: "caseworker"
      }
    };

    let loginRes = await axios.post(
      this.props.urlBase + "/api/accounts/login",
      body
    );

    let account = loginRes.data.account;

    axios.defaults.headers.common["Authorization"] = "Bearer " + account.token;
    localStorage.setItem("jwt-caseworker", account.token);

    this.setState({ caseWorkerAccount: account });
    // this.getAccountData();
    await this.getAllAccounts();
  };

  logout = async () => {
    localStorage.setItem("jwt-caseworker", undefined);
    document.location.href = "/";
  };

  componentDidMount = () => {
    this.loginAsCaseWorker();
  };

  render() {
    let selectedOwnerLeftView;
    let selectedOwnerRightView;

    let ownerAvailableDocumentTypes = [];

    for (let documentType of this.state.availableDocumentTypes) {
      let requestButton = (
        <MDBBtn onClick={this.requestDocument(documentType)} color="mdb-color">
          Request
        </MDBBtn>
      );

      for (let shareRequest of this.state.shareRequests) {
        if (
          shareRequest.documentType === documentType &&
          shareRequest.shareWithAccountId === this.state.caseWorkerAccount.id &&
          shareRequest.approved === false
        ) {
          requestButton = (
            <MDBBtn
              disabled
              onClick={this.requestDocument(documentType)}
              color="mdb-color"
            >
              Requested
            </MDBBtn>
          );
        } else if (
          shareRequest.documentType === documentType &&
          shareRequest.shareWithAccountId === this.state.caseWorkerAccount.id &&
          shareRequest.approved === true
        ) {
          requestButton = <MDBIcon icon="check" />;
        }
      }

      // if(shareRequest.approved === false)
      ownerAvailableDocumentTypes.push(
        <div>
          <MDBRow>
            <MDBCol>
              <h5>{documentType}</h5>
            </MDBCol>
            <MDBCol>{requestButton}</MDBCol>
            <hr></hr>
          </MDBRow>
        </div>
      );
    }
    let ownerImage;

    if (this.state.selectedAccout.username === "sallyowner") {
      ownerImage = (
        <img
          style={{ margin: "47px", width: "450px" }}
          class="circular--square"
          src="newimages/owner.png"
        />
      );
    } else {
      ownerImage = (
        <img
          style={{ margin: "47px", width: "450px" }}
          class="circular--square"
          src="newimages/anon-user.png"
        />
      );
    }

    if (this.state.selectedAccout.username !== undefined) {
      selectedOwnerLeftView = (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>{this.state.selectedAccout.username}</h2>
          {ownerImage}
          <h5>
            Upload a document for owner: {this.state.selectedAccout.username}
          </h5>
          <MDBBtn onClick={this.toggleUploadModal} color="mdb-color">
            Upload
          </MDBBtn>
        </div>
      );

      selectedOwnerRightView = (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>Documents in MyPass</h2>
          <hr></hr>
          {ownerAvailableDocumentTypes}
        </div>
      );
    }

    return (
      <div>
        <MDBRow>
          <MDBCol size="1">
            {/* Side bar */}
            <div
              class="div-block-68"
              style={{ width: "100px", height: "1317px" }}
            >
              <div>
                <div class="div-block-36">
                  <div
                    data-w-id="ddbc8949-2fc3-f476-97de-60228bd6fa89"
                    class="div-block-91"
                    style={{ width: "90px", height: "80px" }}
                  ></div>
                </div>
              </div>
              <div
                data-w-id="fd40dfd9-11f3-d26b-9e05-bf6a430b3346"
                class="div-block-92"
              >
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
                  MyPass
                </h1>
              </div>
            </div>
            <hr></hr>

            <MDBRow>
              <MDBCol>
                <div style={{ textAlign: "center" }}>
                  <SearchBar
                    ownerSelectedFromDropdown={this.ownerSelectedFromDropdown}
                    ownerAccountsForSearch={this.state.ownerAccountsForSearch}
                  />
                </div>
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol>{selectedOwnerLeftView}</MDBCol>
              <MDBCol>{selectedOwnerRightView}</MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol size="2">
            <img
              style={{ marginTop: "47px", width: "50px" }}
              class="circular--square"
              src="newimages/caseworker.png"
            />
            <p style={{ paddingLeft: "3px" }}>
              <button onClick={this.logout} className="button-link">
                logout
              </button>
            </p>
          </MDBCol>
        </MDBRow>
      </div>
    );
  }
}

export default CaseWorkerWorkflow;
