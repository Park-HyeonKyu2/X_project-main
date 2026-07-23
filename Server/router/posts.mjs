import express from "express"
import { isAuth } from "../middleware/auth.mjs"
import * as postController from "../controller/posts.mjs"
import * as commentsController from "../controller/comments.mjs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 전체 포스트 가져오기
// http://127.0.0.1:8080/post (GET)
// http://127.0.0.1:8080/post?userid=apple (GET)
router.get("/", isAuth, postController.getPosts)

// 특정 사용자 포스트 가져오기
router.get("/user/:userid", isAuth, postController.getPostsByUser)

// 글번호에 대한 포스트 가져오기
// http://127.0.0.1:8080/post/:id (GET)
router.get("/:id", isAuth, postController.getPost)

// 포스트 쓰기
// http://127.0.0.1:8080/post (POST)
router.post("/", isAuth, postController.createPost)

// 포스트 수정하기
// http://127.0.0.1:8080/post (PUT)
router.put("/:id", isAuth, postController.updatePost)

// 포스트 삭제하기
// http://127.0.0.1:8080/post/:id (DELETE)
router.delete("/:id", isAuth, postController.deletePost)

router.post("/:postId", isAuth, commentsController.createComment)

router.get("/:postId/comments", isAuth, commentsController.getByComment)

export default router







