import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

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

function readPostsFromLocalStorage() {
    const posts = localStorage.getItem("posts")
    return posts ? JSON.parse(posts) : []
}

// 유저 게시물 가져오기
function getFilterItems (posts, id) {
  
}

export default function PostList () {
  const [ posts, setPosts ] = useState(() => readPostsFromLocalStorage())
  const handleAdd = (post) => setPost([...posts, post ])
  const handleUpdate = (updated) => setPosts(posts.map((p) => (p.id === updated.id ? updated : p )))
  const handleDelete = (deleted) => setPosts(posts.filter((p) => p.id !== deleted.id))

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts))
  }, [posts])

  return (
    <section className="styles.">

    </section>
  )

}