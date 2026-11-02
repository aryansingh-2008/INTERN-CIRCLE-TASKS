import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { TodoList } from './pages/TodoList';
import { Pricing } from './pages/Pricing';
import { Weather } from './pages/Weather';
import { QuizAndShop } from './pages/QuizAndShop';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-width standalone Portfolio landing page matching the exact reference design */}
        <Route path="/portfolio" element={<Portfolio />} />
        
        {/* DevSuite Dashboard & Application Workspace */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="todo" element={<TodoList />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="weather" element={<Weather />} />
          <Route path="quiz" element={<QuizAndShop />} />
          <Route path="shop" element={<QuizAndShop />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
