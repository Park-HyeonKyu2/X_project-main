import { useState } from "react"
import styles from "./PostContent.module.css"
import post from "../pages/postlist"

export default function PostContent({post_id}) {
  const [error, setError ] = useState("")
  const [ post, setPost ] = useState("")

  const API_URL = `http://127.0.0.1:18765/post/${post_id}`

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(API_URL, {
        method: "GET",
        header: {
          "Content-Type" : "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("게시글을 불러오지 못했습니다")
      }

      const {data} = await response.json()
      setPosts(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <p>{post?.text}</p>
    </section>
  )
}