import React, { useEffect, useState } from "react"
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout'
import Quote from './components/Quote'

function App() {
  return (
    <div className="App">
      <Layout>
        <Quote />
      </Layout>
    </div>
  );
}

export default App;
