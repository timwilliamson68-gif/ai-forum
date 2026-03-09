import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Category from '../pages/Category';
import Post from '../pages/Post';
import Profile from '../pages/Profile';
import Login from '../pages/Login';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98 }
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

export default function Router() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="category/:id" element={<PageWrapper><Category /></PageWrapper>} />
          <Route path="post/:id" element={<PageWrapper><Post /></PageWrapper>} />
          <Route path="user/:id" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="login" element={<PageWrapper><Login /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}