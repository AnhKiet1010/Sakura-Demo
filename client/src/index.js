import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemedSuspense from './components/ThemedSuspense';
import store from './app/store'
import { Provider } from 'react-redux'
import { ThemeProvider } from "./components/themeContext";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <Suspense Suspense fallback={< ThemedSuspense />}>
        <App />
      </Suspense >
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
