import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './containers/Home/Home';
import AdminPage from './containers/AdminPage/AdminPage';
import Page from "./components/Page/Page";
import FormPages from './components/FormPages/FormPages';
import NotFound from './containers/NotFound/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="page-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/admin" element={<AdminPage />}/>
            <Route path="/pages/:id" element={<Page/>}>
              <Route path="edit" element={<FormPages/>}/>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;