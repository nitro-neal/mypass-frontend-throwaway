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

class Admin extends React.Component {
  state = {
    rolePerms: [],
    submitPermissionsClicked: false,
    disableSubmit: false
  };

  submitPermissions = async () => {
    let body = {
      rolePermissionTable: this.state.rolePerms
    };

    let res = await axios.post(
      "http://localhost:5000/api/admin/rolePermissionTable/",
      body
    );

    console.log(res.data);

    this.setState({ submitPermissionsClicked: true });
  };
  buildPermissionTable = async () => {
    let rolePermRes = await axios.get(
      "http://localhost:5000/api/admin/rolePermissionTable"
    );
    console.log("roles");
    console.log(rolePermRes.data.rolePermissionTable);

    if (
      rolePermRes.data.rolePermissionTable === null ||
      rolePermRes.data.rolePermissionTable === undefined ||
      JSON.stringify(rolePermRes.data.rolePermissionTable) ===
        JSON.stringify({})
    ) {
      let rolePermResDefault = await axios.get(
        "http://localhost:5000/api/admin/generateDefaultRolePermissionsTable"
      );
      console.log("default tabe");
      console.log(rolePermResDefault.data.rolePermissionTable);

      if (
        JSON.stringify(rolePermResDefault.data.rolePermissionTable) ===
        JSON.stringify({})
      ) {
        this.setState({ disableSubmit: true });
      }

      this.setState({
        rolePerms: rolePermResDefault.data.rolePermissionTable
      });
    } else {
      this.setState({
        rolePerms: rolePermRes.data.rolePermissionTable
      });
    }
  };

  componentDidMount = () => {
    this.buildPermissionTable();
  };

  checkBoxChanged = e => {
    console.log(e.target.id);
    console.log(e.target.checked);
    console.log(e.target.name);
    this.state.rolePerms[e.target.id] = e.target.checked;

    let rolePerms = this.state.rolePerms;

    rolePerms[e.target.id] = e.target.checked;

    this.setState({ rolePerms: rolePerms });
  };
  render() {
    // console.log("admin");

    let checkBoxes = [];
    let roleDefault = "-";

    console.log("RENDER");
    console.log(this.state.rolePerms);
    for (var key of Object.keys(this.state.rolePerms)) {
      console.log(key + " -> " + this.state.rolePerms[key]);
      checkBoxes.push(
        <div>
          <MDBInput
            onChange={this.checkBoxChanged}
            label={key}
            filled
            checked={this.state.rolePerms[key]}
            type="checkbox"
            id={key}
          />
          <hr />
        </div>
      );
    }

    let welcomeMessage = <h3>Welcome!</h3>;

    if (this.state.disableSubmit === true) {
      welcomeMessage = (
        <div>
          <h3>No roles or permissions found!</h3>
          <p>
            Please update roles and permissions with the post: /api/permissions/
            and post: /api/roles/ endpoints
          </p>
        </div>
      );
    }
    return (
      <MDBContainer style={{ paddingTop: "100px" }}>
        {this.state.submitPermissionsClicked === false ? (
          <div>
            <MDBRow>
              <MDBCol></MDBCol>
              <MDBCol>{welcomeMessage}</MDBCol>
              <MDBCol></MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol></MDBCol>
              <MDBCol>{checkBoxes}</MDBCol>
              <MDBCol></MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol></MDBCol>
              <MDBCol>
                <MDBBtn
                  onClick={this.submitPermissions}
                  disabled={this.state.disableSubmit}
                >
                  Submit Permissions
                </MDBBtn>
              </MDBCol>
              <MDBCol></MDBCol>
            </MDBRow>
          </div>
        ) : (
          <h1>Permissions Updated!</h1>
        )}
      </MDBContainer>
    );
  }
}

export default Admin;
