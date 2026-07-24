import styles from "./PostContent.module.css"

export default function PostContent({post_id}) {
  return (
    <section className={styles.section}>
      <p>PostContent {post_id}</p>
    </section>
  )
}