import React, { Component } from "react";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBBtn, MDBRow, MDBCol } from "mdbreact";

class DetailTabs extends Component {
  state = {
    activeItem: "1",
    deleteClicked: false
  };

  toggle = tab => e => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab
      });
    }
  };

  deleteClicked = () => {
    console.log("delete clicked");
    this.setState({ deleteClicked: true });
  };

  render() {
    let docUrl = "#";
    if (this.props.imgSrc !== undefined) {
      docUrl = this.props.imgSrc.url;
    }

    return (
      <MDBContainer>
        <MDBNav className="nav-tabs mt-5">
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab">
              Preview
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab">
              Share
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItem === "2"} onClick={this.toggle("3")} role="tab">
              Replace
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItem === "3"} onClick={this.toggle("4")} role="tab">
              <MDBIcon far icon="trash-alt" size="2x" />
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent activeItem={this.state.activeItem}>
          <MDBTabPane tabId="1" role="tabpanel">
            <img src={docUrl} style={{ width: "400px", verticalAlign: "middle", padding: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          </MDBTabPane>
          <MDBTabPane tabId="2" role="tabpanel">
            <div>
              <h3 style={{ padding: "25px", textAlign: "center" }}>Share Feature Coming Soon...</h3>
            </div>
          </MDBTabPane>
          <MDBTabPane tabId="3" role="tabpanel">
            <div>
              <h3 style={{ padding: "25px", textAlign: "center" }}>Replace Feature Coming Soon...</h3>
            </div>
          </MDBTabPane>
          <MDBTabPane tabId="4" role="tabpanel">
            <div style={{ backgroundColor: "#d3d3d3", borderRadius: "25px" }}>
              {this.state.deleteClicked === false ? (
                <div>
                  <h3 style={{ padding: "25px", textAlign: "center" }}>Are you sure you want to permanently delete this file?</h3>

                  <img src={docUrl} style={{ width: "400px", verticalAlign: "middle", padding: "50px", display: "block", marginLeft: "auto", marginRight: "auto" }} />

                  <h6 style={{ padding: "25px", textAlign: "center" }}>Deleting this file will permanently revoke access to all users</h6>
                  <h6 style={{ padding: "25px", textAlign: "center" }}>Are you sure?</h6>
                  <div style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
                    <MDBBtn
                      onClick={() => {
                        this.props.deleteDocument();
                        this.deleteClicked();
                      }}
                      color="red"
                    >
                      Yes, Delete it
                    </MDBBtn>
                  </div>
                </div>
              ) : (
                <h3 style={{ padding: "25px", textAlign: "center" }}>File has been deleted</h3>
              )}
            </div>
          </MDBTabPane>
        </MDBTabContent>
      </MDBContainer>
    );
  }
}
export default DetailTabs;
