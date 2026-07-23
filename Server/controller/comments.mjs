import * as commentRepository from "../data/comments.mjs"

// 댓글을 작성하는 함수
export async function createComment(req, res) {
    const postId = req.params.postId
    const { text } = req.body
    const post = await commentRepository.create(text, req.id, postId)
    res.status(201).json(post)
}

// 포스트 내의 모든 댓글을 가져오는 함수
export async function getByComment(req, res) {
    const postId = req.params.postId
    const data = await (postId ? commentRepository.getByPostId(postId) : commentRepository.getByComment())
    res.status(200).json(data)
}


// 댓글을 삭제하는 함수
export async function deletePost(req, res) {
    const id = req.params.id
    const post = await commentRepository.getById(id)
    if(!post){
        return res.status(404).json({message: `${id}의 포스트가 없습니다`})
    }
    if(post.idx !== req.id){ 
        return res.sendStatus(403)
    }
    await commentRepository.remove(id)
    res.sendStatus(204)
}

// 포스트를 변경하는 함수
export async function updatePost(req, res) {
    const id = req.params.id
    const text = req.body.text
    const post = await commentRepository.getById(id)
    if(!post){
        return res.status(404).json({ message: `${id}의 포스트가 없습니다`})
    }
    if (post.idx !== req.id) {
        return res.sendStatus(403)
    }
    const updated = await commentRepository.update(id, text)
    res.status(200).json(updated)
}