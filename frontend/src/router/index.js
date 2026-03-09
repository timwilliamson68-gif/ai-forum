import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Category from '../pages/Category';
import Post from '../pages/Post';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><App /></Layout>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'category/:id',
        element: <Category />,
      },
      {
        path: 'post/:id',
        element: <Post />,
      },
      {
        path: 'profile/:id',
        element: <Profile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

export default router;