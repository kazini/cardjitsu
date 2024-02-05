import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './views/Home.tsx'
import Room from './views/Room.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreateGame from './views/createGame.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create",
    element: <CreateGame />
  },
  {
    path: "/room/:id",
    element: <Room />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
