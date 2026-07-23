import { useNavigate } from "react-router-dom";

export default function PostList() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token');
    navigate("/auth/login")

  }
  return (

  <>
    <h1>메인 포스트</h1>
    <button onClick={logout}>로그아웃</button>
  </>
  )
}

