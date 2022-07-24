import React from 'react';
import ReactDOM from 'react-dom/client';
import Github from './App';
import './index.scss';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<Github type="stargazers" namespace="alibaba" repo="hooks" />);
