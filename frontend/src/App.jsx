import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import { Home, Login, CreateAccount, Signup, CreateTransaction } from './pages';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/createaccount",
    element: <CreateAccount />,
  },
  {
    path: "/createtransaction",
    element: <CreateTransaction />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
