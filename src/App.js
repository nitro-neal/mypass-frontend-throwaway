import React from "react";
import "./App.css";
import "./css/mypass-webflow.css";
import "./css/normalize.css";
import "./css/webflow.css";
import OwnerWorkflow from "./components/ownerWorkflow";
import Admin from "./components/admin";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import CaseWorkerWorkflow from "./components/caseworkerWorkflow";
import ChooseWorkflow from "./components/chooseWorkflow";
import Verify from "./components/verify";

// const URL_BASE = "http://34.212.27.73:5000";
const URL_BASE = "http://localhost:5000";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/verify">
            <Verify />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/owner">
            <OwnerWorkflow urlBase={URL_BASE} />
          </Route>
          <Route path="/caseworker">
            <CaseWorkerWorkflow urlBase={URL_BASE} />
          </Route>
          <Route
            path="/"
            render={routeProps => <ChooseWorkflow {...routeProps} />}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
