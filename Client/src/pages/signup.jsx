import { useState } from "react"
import styles from "./login.module.css"
import { useNavigate, Link } from "react-router-dom"

const API_URL = "http://127.0.0.1:5000/auth/login"

export default function Signup() {
    const [error, setError] = useState("")
    const [userid, setUserid] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [nickname, setNickname] = useState("")
}