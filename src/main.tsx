import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import Provider from "./context/context.tsx";

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>,
)
