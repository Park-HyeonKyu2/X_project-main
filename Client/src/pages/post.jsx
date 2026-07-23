import { useParams } from "react-router-dom"
import PostContent from "../components/PostContent"
import ComentSection from "../components/ComentSection"

export default function Post() {
  const { post_id } = useParams()

  return (
    <>
    <h1>post_id: {post_id}</h1>
      <PostContent post_id={post_id} />
      <ComentSection post_id={post_id} />
    </>
  )


}