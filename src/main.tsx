import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <App type="stargazers" namespace="ant-design" repo="ant-design" />
);
