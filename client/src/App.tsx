import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/site/home-page";
import CreatePostPage from "./pages/site/create-post-page";
import SinglePost from "./pages/site/single-post";
import SignInPage from "./pages/auth/signin-page";
import SignUpPage from "./pages/auth/signup-page";


export default function App() {
  return (
    <Routes>
        <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Route>
    </Routes>
  )
}
