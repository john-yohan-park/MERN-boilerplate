import React                                      from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header                                     from './components/Header'
import Routes                                     from './routes'

const App = () => 
  <Router>
    <Header/>
    <Switch>
      { Routes.map((route,i) => <Route exact key={i} {...route}/>) }
    </Switch>
  </Router>

export default App