import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./ComentSection.module.css"


export default function ComentSection({ post_id }) {
    const [loading, setLoading] = useState("")
    const [error, setError] = useState("")
    const [text, setText] = useState("")
    const [comments, setComments] = useState([])
    const [user, setUser] = useState([])
    const [isEditing, setIsEditing] = useState(false)

    const COMMENT_API_URL = `http://127.0.0.1:18765/post/${post_id}/comments`
    const AUTH_API_URL = 'http://127.0.0.1:18765/auth/me'

    const navigate = useNavigate()

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
            throw new Error(data.message || "게시물 조회에 실패했습니다.")
        }

        setUser(data)
    }

    const getComment = async () => {
        const token = localStorage.getItem("token")

        if (!token) {
            throw new Error("로그인이 필요합니다.")
        }

        const response = await fetch(COMMENT_API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "게시물 조회에 실패했습니다.")
        }

        setComments(data)
    }

    useEffect(() => {
        Promise.all([
            getUser(),
            getComment()
        ]).catch((error) => {
            console.error(error)
            setError(error.message)
        })
    }, [post_id])

    const handleEdit = (state) => {
        console.log("state: ", state)
        setisEditing(!state)
    }

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

            const response = await fetch(COMMENT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    text: text.trim()
                })
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error("댓글 등록을 실패했습니다.")
            }
            await getComment()
            return data
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    return (
        <section className={styles.section}>
            <ul>
                {console.log(user.userid)}
                userid: {user.userid}
                {comments.length === 0 ? (
                    <p>첫 번째 댓글을 달아보세요!</p>
                ) : (
                    comments.map((comment) => (
                        <li className={styles.commentItem} key={comment._id}>   
                            {isEditing === false ? <span>{comment.text}</span> : <textarea/>}
                            {user.userid === comment.userid ? (
                                isEditing ? (
                                    <button onClick={() => setIsEditing(false)}>저장</button>
                                ) : (
                                    <button onClick={() => setIsEditing(true)}>수정</button>
                                )
                                ) : (
                                ""
                            )}
                        </li>
                    ))
                )}
            </ul>
            <form onSubmit={handleSubmit}>
                <textarea className={styles.input} type="text" placeholder="댓글을 작성해주세요" value={text} onChange={(e) => setText(e.target.value)} />
                {error && <p>{error}</p>}
                <button className={styles.button} type="submit">POST</button>
            </form>
        </section>
    )
}