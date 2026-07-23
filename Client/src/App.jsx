import Login from "./pages/login"
import Signup from "./pages/signup"
import PostList from "./pages/postlist"
import Post from "./pages/post"

import { createBrowserRouter, useNavigate, RouterProvider } from "react-router-dom"
import { useEffect } from "react"

function PostRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      navigate("/post")
    } else {
      navigate("/auth/login")
    }
  }, [navigate])
  return
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PostRedirect />
  },
  {
    path: "/auth/login",
    element: <Login />
  },
  {
    path: "/auth/signup",
    element: <Signup />
  },
  {
    path: "/post",
    element: <PostList />
  },
  {
    path: "/post/:post_id",
    element: <Post />
  }
  // 이후 포스터 라우터 추가할 것
])

export default function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}