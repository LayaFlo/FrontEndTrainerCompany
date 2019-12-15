import React from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            GYM
          </Typography>
        </Toolbar>
      </AppBar>
      <CustomerList />
    </div>
  );
}

export default App;
