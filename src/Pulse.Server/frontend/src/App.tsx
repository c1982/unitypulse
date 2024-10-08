import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Container } from './components/Layout/Container';
import { SessionsPage } from './pages/SessionsPage';

export const App: React.FC = () => {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/sessions' element={<SessionsPage />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
