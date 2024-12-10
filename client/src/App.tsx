import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/site/home-page";
import CreatePostPage from "./pages/site/create-post-page";
import SinglePost from "./pages/site/single-post";
import LoginPage from "./pages/auth/login-page";
import RegisterPage from "./pages/auth/register-page";


export default function App() {
  return (
    <Routes>
        <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Route>
    </Routes>
  )
}
