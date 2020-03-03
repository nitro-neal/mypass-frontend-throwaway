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
  MDBDropdownItem,
  MDBIcon
} from "mdbreact";
import axios from "axios";

import { verifyCredential } from "did-jwt-vc";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";

const providerConfig = {
  name: "rsk:testnet",
  registry: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
  rpcUrl: "https://did.testnet.rsk.co:4444"
};

class Verify extends React.Component {
  state = {
    error: undefined,
    resolver: undefined,
    verifiedVC: undefined,
    signerMatches: false,
    verifiedSigner: "0x2a6F1D5083fb19b9f2C653B598abCb5705eD0439",
    jwt:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODI4MjA4MDYsInN1YiI6ImRpZDpldGhyOjB4NmVmZWRlYWVjMjBlNzkwNzEyNTFmZmZhNjU1RjFiZERDYTY1YzAyNyIsIm5iZiI6MTU4MjgyMDgwNiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJkb2N1bWVudCI6eyJ0eXBlIjoiQmlydGggQ2VydGlmaWNhdGUiLCJoYXNoIjoiZTlmNWMzOGYwODk2N2U4NDEzODc3NWY3OGYwNTg5N2EiLCJ1cmxIYXNoIjoiYWZjNTZlN2ZiMzUxODBiZjZkOGQ4YzIzZDM3MmM1NTAifSwibm90YXJpemF0aW9uIjp7InNlYWxIYXNoIjoiZTlmNWMzOGYwODk2N2U4NDEzODc3NWY3OGYwNTg5N2EiLCJub3Rhcml6YXRpb25UeXBlIjoiQ2VydGlmaWVkIENvcHkiLCJub3RhcnlJbmZvIjoiZXhhbXBsZS1ub3RhcnktaW5mbyIsInBlbSI6ImV4YW1wbGUtcGVtIn19fSwiaXNzIjoiZGlkOmV0aHI6MHgyYTZGMUQ1MDgzZmIxOWI5ZjJDNjUzQjU5OGFiQ2I1NzA1ZUQwNDM5In0.vB-U9fgyp9JBYr8ycxmuVKIEc3ZYeZqKfreda3pXMFcQH1gG7jOgqJVqVH_omIw74N5LO_LQBWKBUYvAi5j3GQA"
  };

  componentDidMount = () => {
    // this.buildPermissionTable();

    const resolver = new Resolver(getResolver(providerConfig));
    console.log(resolver);
    this.setState({ resolver: resolver });
  };

  jwtChange = e => {
    this.setState({ jwt: e.target.value });
  };

  verifyJWTClicked = async () => {
    let verifiedVC;
    try {
      verifiedVC = await verifyCredential(this.state.jwt, this.state.resolver);
    } catch (e) {
      console.log(e);
      this.setState({ error: e.message });
      return;
    }

    console.log(verifiedVC);

    if (
      verifiedVC.signer.id
        .toLowerCase()
        .includes(this.state.verifiedSigner.toLowerCase())
    ) {
      this.setState({ signerMatches: true });
    }
    this.setState({ verifiedVC: verifiedVC });
    this.setState({ error: undefined });
  };

  render() {
    return (
      <MDBContainer style={{ paddingTop: "100px" }}>
        <h1>Verify JWT</h1>
        {this.state.error && JSON.stringify(this.state.error)}

        <MDBInput
          style={{ paddingTop: "50px" }}
          onChange={this.jwtChange}
          type="textarea"
          label="Paste Your JWT Here"
          rows="8"
        />

        <MDBBtn onClick={this.verifyJWTClicked}>Verify</MDBBtn>

        <MDBRow style={{ textAlign: "center" }}>
          <MDBCol>
            {this.state.signerMatches && (
              <MDBIcon style={{ paddingTop: "50px" }} size="5x" icon="check" />
            )}
          </MDBCol>
          <MDBCol>
            <h3>Verified Signer</h3>
            <img
              style={{ margin: "47px", width: "45px" }}
              class="circular--square"
              src="newimages/caseworkerlower.png"
            />
            {this.state.verifiedVC && this.state.verifiedSigner}
          </MDBCol>
          <MDBCol>
            <h3 style={{ paddingTop: "100px" }}>VS</h3>
          </MDBCol>
          <MDBCol>
            <h3>Signer From JWT</h3>
            <img
              style={{ margin: "47px", width: "45px" }}
              class="circular--square"
              src="newimages/question.jpg"
            />
            {this.state.verifiedVC && this.state.verifiedVC.signer.id}
          </MDBCol>
        </MDBRow>

        <h3 style={{ paddingTop: "50px" }}>Subject</h3>
        {this.state.verifiedVC && this.state.verifiedVC.payload.sub}

        <h3 style={{ paddingTop: "50px" }}>Issuer</h3>
        {this.state.verifiedVC && this.state.verifiedVC.issuer}

        <h3 style={{ paddingTop: "50px" }}>Signer</h3>
        {this.state.verifiedVC && this.state.verifiedVC.signer.id}

        <h3 style={{ paddingTop: "50px" }}>Full JWT Decoded:</h3>
        {this.state.verifiedVC && JSON.stringify(this.state.verifiedVC)}
      </MDBContainer>
    );
  }
}

export default Verify;
