import React, { useContext } from 'react'
import { UserContext } from './context/usercontext'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import LoginPage from './components/login'
import { Cal } from './components/cal'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql/', //URL of the GraphQL server
  request: operation => {
    const token = localStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
})

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <PrivateRoute exact path="/">
          <ApolloProvider client={client}>
            <Cal />
          </ApolloProvider>
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let { userState } = useContext(UserContext)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        userState.isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}
