// 1. 프론트엔드 삭제 기능 구현
// 2. 백엔드 댓글 수정 기능 구현
// 3. 백엔드 댓글 삭제 기능 구현

import { useState, useEffect } from "react"
import styles from "./ComentSection.module.css"

export default function ComentSection({ post_id }) {
    // 에러 메세지
    const [error, setError] = useState("")
    // 댓글 작성 메세지
    const [text, setText] = useState("")
    // 댓글 객체 여러 개를 담은 배열
    const [comments, setComments] = useState([])
    // 현재 로그인한 사용자 정보를 저장 
    const [user, setUser] = useState([])
    // 현재 수정 중인 댓글의 ID
    const [editingCommentId, setEditingCommentId] = useState(null)
    // 수정할 댓글의 내용
    const [editText, setEditText] = useState("")

    // 해당 게시글의 댓글 조회·작성·수정·삭제 API 주소
    const COMMENT_API_URL = `http://127.0.0.1:18765/post/${post_id}/comments`
    // 현재 로그인한 사용자 정보를 조회하는 API 주소
    const AUTH_API_URL = 'http://127.0.0.1:18765/auth/me'

    /**
     * 현재 로그인한 사용자 정보를 조회해 user에 저장
     */
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

    /** 현재 게시글의 댓글 목록을 조회해 comments에 저장 */
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
            throw new Error(data.message || "댓글 조회에 실패했습니다.")
        }

        setComments(data)
    }

    // 컴포넌트가 처음 렌더링되거나 post_id가 변경될 때 
    // 로그인 사용자 정보와 현재 게시글의 댓글 목록을 조회
    useEffect(() => {
        // Promise.all : 여러 비동기 작업을 동시에 실행하고, 전부 끝날 때까지 기다리는 기능
        // getUser()와 getComment()를 동시에 실행
        Promise.all([
            getUser(),
            getComment()
        ]).catch((error) => {
            console.error(error)
            setError(error.message)
        })
        // 새 게시글로 이동할 때마다 useEffect를 다시 실행시킨다.
    }, [post_id])

    /**
     * 선택한 댓글의 내용을 수정하고
     * 수정된 댓글 목록을 다시 불러오는 함수
     */
    const handleUpdate = async (commentId) => {
        // 이전에 표시된 에러 메시지 초기화
        setError("")

        // 수정 내용이 비어 있거나 공백만 있는 경우 요청 중단
        if (!editText.trim()) {
            setError("수정할 내용을 입력해주세요")
            return
        }
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("로그인이 필요합니다")
            }

            // 수정할 댓글 ID를 주소에 추가해 PUT 요청 전송
            const response = await fetch(
                `${COMMENT_API_URL}/${commentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text: editText.trim(),
                    }),
                }
            )

            if (!response.ok) {
                throw new Error("댓글 수정에 실패했습니다.")
            }

            // 수정된 댓글을 화면에 반영하기 위해 댓글 목록 다시 조회
            await getComment()
            // 수정 모드를 종료하고 수정 입력값 초기화
            setEditingCommentId(null)
            setEditText("")
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    /**
     * 작성한 댓글을 서버에 등록하는 함수
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        // 에러 메세지 초기화
        setError("")

        // 입력값이 비어 있거나 공백만 있는 경우 등록 중단
        if (!text.trim()) {
            setError("텍스트를 입력해주세요")
            return
        }

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("로그인이 필요합니다")
            }

            // 현재 게시글의 댓글 API로 POST 요청 전송
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
                throw new Error("댓글 등록에 실패했습니다.")
            }
            // 등록된 댓글을 화면에 반영하기 위해 댓글 목록 다시 조회
            await getComment()

            // 댓글 등록 후 입력창 초기화
            setText("")
            return data
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    const handleDelete = async (commentId) => {
        const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?")

        if (!isConfirmed) {
            return
        }

        setError("")

        try {
            const token = localStorage.getItem("token")
            console.log("token: ", token)

            if (!token) {
                throw new Error("로그인이 필요합니다.")
            }

            const response = await fetch(`${COMMENT_API_URL}/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

               
            if (response.status === 403) {
                throw new Error("자신이 작성한 댓글만 삭제할 수 있습니다.")
            }

            if (response.status === 404) {
                throw new Error("이미 삭제되었거나 존재하지 않는 댓글입니다.")
            }

            if (!response.ok) {
                throw new Error("댓글 삭제에 실패했습니다.")
            }

            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment._id !== commentId
                )
            )

            if (editingCommentId === commentId) {
                setEditingCommentId(null)
                setEditText("")
            }
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }


    return (
        <section className={styles.section}>
            <ul>
                {comments.length === 0 ? (
                    <p>첫 번째 댓글을 달아보세요!</p>
                ) : (
                    // 댓글 배열을 순회하며 각 댓글을 화면에 출력
                    comments.map((comment) => (
                        <li className={styles.commentItem} key={comment._id}>
                            {/* 댓글 작성자의 프로필 영역 */}
                            <div className={styles.commentHeader}>
                                {/* 작성자에게 등록된 프로필 이미지가 있는지 확인 */}
                                {comment.profileImage ? (
                                    // 프로필 이미지가 있으면 실제 이미지를 표시
                                    <img
                                        className={styles.commentAvatar}
                                        src={comment.profileImage}
                                        alt={`${comment.name} 프로필`}
                                    />
                                ) : (
                                    // 프로필 이미지가 없으면 닉네임 또는 아이디의 첫 글자를 표시
                                    <div className={styles.commentAvatarFallback}>
                                        {comment.name?.charAt(0) || comment.userid?.charAt(0) || "U"}
                                    </div>
                                )}
                                {/* 댓글 작성자의 닉네임과 아이디 영역 */}
                                <div className={styles.commentAuthorInfo}>
                                    <strong>{comment.name}</strong>
                                    <span>@{comment.userid}</span>
                                </div>
                            </div>

                            {/* 현재 수정 중인 댓글만 textarea로 표시 */}
                            {editingCommentId === comment._id ? (
                                <textarea
                                    className={styles.editInput}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                            ) : (
                                <p className={styles.commentText}>{comment.text}</p>
                            )}

                            {/* 현재 로그인한 사용자가 작성한 댓글에만 버튼 표시 */}
                            {/* type="button" 추가*/}
                            {user.userid === comment.userid && (
                                <div className={styles.commentActions}>
                                    {editingCommentId === comment._id ? (
                                        <>
                                            <button type="button" onClick={() => handleUpdate(comment._id)}>저장</button>
                                            <button type="button" onClick={() => {
                                                setEditingCommentId(null)
                                                setEditText("")
                                            }}>취소</button>
                                        </>
                                    ) : (
                                        <>
                                            <button type="button" onClick={() => {
                                                setEditingCommentId(comment._id)
                                                setEditText(comment.text)
                                            }}>수정</button>
                                            <button type="button" onClick={() => handleDelete(comment._id)}>삭제</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
            {/* 새 댓글 작성 */}
            <form onSubmit={handleSubmit}>
                <textarea className={styles.input} placeholder="댓글을 작성해주세요" value={text} onChange={(e) => setText(e.target.value)} />
                {error && <p>{error}</p>}
                <button className={styles.button} type="submit">POST</button>
            </form>
        </section>
    )
}