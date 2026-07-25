import { useState, useEffect } from "react"
import styles from "./postlist.module.css"
const API_URL = "http://127.0.0.1:18765/post"
const AUTH_API_URL = "http://127.0.0.1:18765/auth/me"
import { useNavigate } from "react-router-dom"

export default function Post() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState("")
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})

  const navigate = useNavigate()

  const getPost = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("로그인이 필요합니다.")
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "게시물 조회에 실패했습니다.")
    }

    setPosts(data)
  }

  // 현재 로그인한 사용자의 프로필 정보를 조회
  const getUser = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("로그인이 필요합니다.")
    }

    const response = await fetch(AUTH_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "사용자 정보 조회에 실패했습니다.")
    }

    setUser(data)
  }

  useEffect(() => {
    Promise.all([getPost(), getUser()]).catch((error) => {
      console.error(error)
      setError(error.message)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!post.trim()) {
      setError("텍스트를 입력해주세요")
      return
    }

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: post.trim()
        })
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error("게시물 등록을 실패했습니다.")
      }
      alert("게시물 등록을 완료했습니다")

      setPost("")
      await getPost()

      return data
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const logout = async (e) => {
    localStorage.removeItem("token")
    navigate("/auth/login")
  }

  const movingPost = async (post_id) => {
    navigate(`/post/${post_id}`)
  }

  return (
    <>
      <button onClick={logout}>logout</button>
      <form onSubmit={handleSubmit}>
        {/* 현재 로그인한 사용자의 프로필 */}
        <div className={styles.composerProfile}>
          {user.profileImage ? (
            <img
              className={styles.composerAvatar}
              src={user.profileImage}
              alt={`${user.name || user.userid} 프로필`}
            />
          ) : (
            <div className={styles.composerAvatarFallback}>
              {user.name?.charAt(0) || user.userid?.charAt(0) || "U"}
            </div>
          )}

          <div className={styles.composerAuthor}>
            <strong>{user.name || user.userid}</strong>
            <span>@{user.userid}</span>
          </div>
        </div>

        <textarea className={styles.input} type="text" placeholder="글을 작성해주세요" value={post} onChange={(e) => setPost(e.target.value)} />
        {error && <p>{error}</p>}
        <button className={styles.button} type="submit">POST</button>
      </form>

      <ul>
        {posts.length === 0 ? (
          <p>등록된 게시물이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <li className={styles.postItem} key={post._id} onClick={() => movingPost(post._id)}>
              <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                  {post.name?.charAt(0) || post.userid?.charAt(0) || "U"}
                </div>
                
                <div className={styles.postAuthor}>
                  <strong>{post.name}</strong>
                  <span>@{post.userid}</span>
                </div>
              </div>
              <p className={styles.postText}>{post.text}</p>

              {/* 작성 날짜 */}
              {post.createdAt && (
                <time className={styles.postData}>
                  {new Date(post.createdAt).toLocaleString("ko-KR")}
                </time>
              )}
            </li>
          ))
        )}
      </ul>
    </>
  )

}
