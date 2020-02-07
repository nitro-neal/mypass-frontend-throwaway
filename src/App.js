import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MyPass from "./components/mypass";
import Admin from "./components/admin";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <MyPass />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
