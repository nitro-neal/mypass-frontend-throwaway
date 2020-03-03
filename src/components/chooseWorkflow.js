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
import { Route } from "react-router-dom";

class ChooseWorkflow extends React.Component {
  loginAsOwner = async () => {
    this.props.history.push("/owner");
  };

  loginAsCaseWorker = async () => {
    this.props.history.push("/caseworker");
  };

  render() {
    return (
      <div>
        <MDBRow>
          <MDBCol></MDBCol>
          <MDBCol>
            <img
              style={{
                marginTop: "300px",
                width: "350px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto"
              }}
              src="./newimages/mypass-logo.png"
            ></img>
            <MDBRow>
              <MDBCol>
                <div style={{ marginTop: "100px" }}>
                  <img
                    style={{
                      width: "70px",
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                    class="circular--square"
                    src="newimages/owner.png"
                  />
                  <MDBBtn
                    onClick={this.loginAsOwner}
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                    color="primary"
                  >
                    Login As Owner
                  </MDBBtn>
                </div>
              </MDBCol>
              <MDBCol>
                <div style={{ marginTop: "100px" }}>
                  <img
                    style={{
                      width: "70px",
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                    class="circular--square"
                    src="newimages/caseworkerlower.png"
                  />
                  <MDBBtn
                    onClick={this.loginAsCaseWorker}
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                    color="primary"
                  >
                    Login As Case Worker
                  </MDBBtn>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol></MDBCol>
        </MDBRow>
      </div>
    );
  }
}

export default ChooseWorkflow;
