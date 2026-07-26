import { useParams } from "react-router-dom"
import styles from "./post.module.css"
import PostContent from "../components/PostContent"
import ComentSection from "../components/ComentSection"

// 모달을 위한 import
import { useState, useEffect } from "react"
import LoginModal from "../components/LoginModal.jsx"

export default function Post() {
  const { post_id } = useParams()

  // 모달
  const [isLoginModalOpen, setLoginModal] = useState(false) // 모달이 열려 있냐/모달 열까 말까
  const token = localStorage.getItem("token") // 토큰 가져와서 로그인 여부 판단

  // 한 번만 띄울거임
  useEffect(() => {
    if (!token) {
      setLoginModal(true) // 여기서 isLoginModalOpen도 같이 true로 바뀜
    }
  }, [])

  const isCloseModal = () => {
    setLoginModal(false)
  }

  // isLoginModalOpen 이게 true면 모달창 띄움 그리고 onClose 넘겨줌
  return (
    <>
      {isLoginModalOpen && <LoginModal onClose={isCloseModal} />}

      <h4>post_id: {post_id}</h4>
      <section className={styles.section}>
        <PostContent post_id={post_id} />
        <ComentSection post_id={post_id} />
      </section>
    </>
  )
}