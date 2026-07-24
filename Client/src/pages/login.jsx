import { useState } from "react"
import styles from "./login.module.css"
import { useNavigate, Link } from "react-router-dom"

const API_URL = "http://127.0.0.1:18765/auth/login"

export default function Login() {
    const [error, setError] = useState("")
    const [userid, setUserid] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const fetchLogin = async () => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid,
                password,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error("계정 정보를 불러오지 못했습니다.")
        }
        return data

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const data = await fetchLogin()
            localStorage.setItem("token", data.token)
            navigate("/post")
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }
    return (
        <>
            <div className={styles.container}>
                <form onSubmit={handleSubmit}>
                    <p>로그인</p>
                    <input className={styles.input} type="text" placeholder="아이디를 입력해주세요" value={userid} onChange={(e) => setUserid(e.target.value)} />
                    <p>비밀번호</p>
                    <input className={styles.input} type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p>{error}</p>}
                    
                    <button className={styles.button}>로그인</button>
                    
                    <p>아이디가 아직 없으신가요?</p><Link to="/auth/signup">회원가입</Link>
                </form>
            </div>
        </>
    )
}