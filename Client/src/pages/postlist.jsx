import { useState } from "react"
import styles from "./postlist.module.css"
import { useEffect } from "react"
const API_URL = "http://127.0.0.1:5001/post"

export default function Post() {
  const [error, setError] = useState("")
  const [post, setPost] = useState([])
  const [posts, setPosts] = useState([])

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

  useEffect(() => {
    getPost().catch((error) => {
      console.error(error)
      setError(error.message)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!text.trim()) {
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text.trim()
        })
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error("게시물 등록을 실패했습니다.")
      }
      alert("게시물 등록을 완료했습니다")
      return data
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea className={styles.input} type="text" placeholder="글을 작성해주세요" value={post} onChange={(e) => setPost(e.target.value)} />
        {error && <p>{error}</p>}
        <button className={styles.button} type="submit">POST</button>
      </form>

      <ul>
        {posts.length === 0 ? (
          <p>등록된 게시물이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <li key={post._id}>
              <span>{post.name}</span>
              <span>@{post.userid}</span>
              <p>{post.text}</p>
            </li>
          ))
        )}
      </ul>
    </>
  )

}