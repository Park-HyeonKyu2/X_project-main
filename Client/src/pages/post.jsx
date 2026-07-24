import { useParams } from "react-router-dom"
import styles from "./post.module.css"
import PostContent from "../components/PostContent"
import ComentSection from "../components/ComentSection"

export default function Post() {
  const { post_id } = useParams()

  return (
    <>
      <h4>post_id: {post_id}</h4>
      <section className={styles.section}>
          <PostContent post_id={post_id} />
          <ComentSection post_id={post_id} />
      </section>
    </>
  )
}