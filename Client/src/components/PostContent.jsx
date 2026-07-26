import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./PostContent.module.css"

export default function PostContent({post_id}) {
  const navigate = useNavigate()
  // 에러 메시지
  const [error, setError ] = useState("")
  // 게시글 내용
  const [ post, setPost ] = useState("")
  // 게시글을 불러오는지 확인
  const [ loading, setLoading ] = useState(true)
  // 유저
  const [ user, setUser ] = useState(null)
  // 이미 가져온 게시글의 Id저장, 이미 요청한 게시글 ID를 기억해서 중복요청 방지
  const fetchedPostId = useRef(null)

  const API_URL = `http://127.0.0.1:18765/post/${post_id}`
  const token = localStorage.getItem("token")
  const AUTH_API_URL = "http://127.0.0.1:18765/auth/me"

  // 게시글 가져오기
  const fetchPosts = async () => {
    try {
      setError("")
      setLoading(true)

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}` 
        }
      })

      if (!response.ok) {
        throw new Error("게시글을 불러오지 못했습니다")
      }

      const data = await response.json()
      setPost(data)
      console.log("test: " , data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // post_id 가 변경될 때 해당 게시글을 서버에서 가져오는 역할
  useEffect (() => {
    // post_id가 없을 때 & 해당 ID의 게시글을 이미 요청했을 때
    if (!post_id || fetchedPostId.current === post_id) return

    fetchedPostId.current = post_id
    fetchPosts()
    fetchUsers()
  }, [post_id])

  // 유저 정보 가져오기
  const fetchUsers = async () => {
    try{
      const response = await fetch(AUTH_API_URL, {
        method: "GET",
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      if(!response.ok){
        throw new Error("유저 정보를 가져오지 못했습니다.")
      }
      const userData = await response.json()
      setUser(userData)
    }catch(error){
      console.error("사용자 정보 조회 오류: ", error)
      setError(error.message)
    }

  }

  // 게시글 삭제
  const handleDelete = async () => {
    try{
      setError("")
      
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      })
      navigate(`/post`)

      if(!response.ok){
        const data = await response.json()
        throw new Error (data.message || "게시글을 삭제하지 못했습니다")
      }
    }catch(error){
      console.log("게시글 삭제 오류: ", error)
    }
  }

  // URL 공유하기
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다.")
    } catch (error) {
      console.error("링크 복사에 실패했습니다.", error)
    }
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        {!loading && !error && (
          <div className={styles.profile}>
            <div className={styles.avatar} aria-hidden="true">
            {/* chatAt: 문자열에서 특정 위치의 문자 하나를 가져오는 함수 */}
            {/* 아이디나 프로필 가져오기 위해서 */}
              {post?.name?.charAt(0) || post?.userid?.charAt(0) || "U"}
            </div>

            <div className={styles.author}>
              <strong>{post?.name}</strong>
              <span>@{post?.userid}</span>
            </div>
          </div>
        )}

        <button
          className={styles.closeButton}
          type="button"
          aria-label="게시글 닫기"
          title="닫기"
          onClick={() => navigate(-1)}
        >
          ×
        </button>
      </header>

      <article className={styles.content}>
        {loading ? (
          <p role="status">게시글을 불러오는 중입니다.</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <p>{post?.text}</p>
        )}
      </article>

      <footer className={styles.actions}>
        {user?.userid === post?.userid ? (
          <>
          <button
            className={styles.actionButton}
            onClick={handleDelete}
            type="button"
            aria-label="게시글 삭제"
            title="삭제"
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M7 9h18" />
              <path d="M13 5h6l1 4h-8l1-4Z" />
              <path d="m9 9 1.5 18h11L23 9" />
              <path d="M14 14v8m4-8v8" />
            </svg>
          </button>
          <button
            className={styles.actionButton}
            type="button"
            aria-label="게시글 수정"
            title="수정"
          >
            
            <svg
              className={styles.actionIcon}
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="m7 23-1 4 4-1L25 11l-3-3L7 23Z" />
              <path d="m19.5 10.5 3 3" />
            </svg>
          </button>
          <button
            className={styles.actionButton}
            type="button"
            aria-label="게시글 공유"
            title="공유"
            onClick={handleShare}
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <rect x="10" y="5" width="15" height="19" rx="2" />
              <path d="M10 10H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1" />
              <path d="M17.5 17.5V10m0 0-3 3m3-3 3 3" />
            </svg>
          </button> 
          </>
          ) : 
          <button
            className={styles.actionButton}
            type="button"
            aria-label="게시글 공유"
            title="공유"
            onClick={handleShare}
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <rect x="10" y="5" width="15" height="19" rx="2" />
              <path d="M10 10H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1" />
              <path d="M17.5 17.5V10m0 0-3 3m3-3 3 3" />
            </svg>
          </button> 
          } 
      </footer>
    </section>
  )
}
