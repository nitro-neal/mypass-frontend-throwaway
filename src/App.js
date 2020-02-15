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

function App() {
  return (
    <OwnerWorkflow />
    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link to="/admin">Admin</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     <Switch>
    //       <Route path="/admin">
    //         <Admin />
    //       </Route>
    //       <Route path="/">
    //         <OwnerWorkflow />
    //       </Route>
    //     </Switch>
    //   </div>
    // </Router>
  );
}

export default App;
