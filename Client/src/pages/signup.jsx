import { useState } from "react"
import styles from "./login.module.css"
import { useNavigate, Link } from "react-router-dom"

const API_URL = "http://127.0.0.1:5001/auth/signup"

export default function Signup() {
    const [error, setError] = useState("")
    const [userid, setUserid] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userid,
                password,
                name,
                email
            })
        })
        

        const data = await response.json()

        if (!response.ok) {
            throw new Error("회원가입을 실패했습니다.")
        }
        alert("회원가입이 완료되었습니다.")
        navigate("/auth/login")
        return data
        }
    


    return (
        <form onSubmit={handleSubmit}>
            <input className={styles.input} type="text" placeholder="닉네임을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
            <input className={styles.input} type="text" placeholder="아이디를 입력해주세요" value={userid} onChange={(e) => setUserid(e.target.value)} />
            <input className={styles.input} type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className={styles.input} type="text" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />


            {error && <p>{error}</p>}
            <button className={styles.button}>회원가입</button>
            <Link to="/auth/login">로그인</Link>
        </form>
    )
}