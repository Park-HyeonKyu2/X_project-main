import express from "express"
import { config } from "./config.mjs"
import { connectDB } from "./db/database.mjs"
import authRouter from "./router/auth.mjs"
import postsRouter from "./router/posts.mjs"
import dns from "node:dns"
import cors from "cors"

dns.setServers(["8.8.8.8", "1.1.1.1"])
const app = express()

app.use(
    cors({
        origin: config.FE_URL.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

app.use(express.json())     

app.get("/", (req, res) => {
    res.send("Node.js X_Project 서버가 정상 실행 중입니다.")
})

app.use("/auth", authRouter)
app.use("/post", postsRouter)

app.use((req, res) => {  // auth나 post 경로로 가지 않은 경우 404를 띄운다.
    res.sendStatus(404)
})

connectDB().then(() => {
    app.listen(config.host.port, () => {
        console.log("DB/웹 서버 실행 중...")
    })
}).catch(console.error)





























