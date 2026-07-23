import {ObjectId} from "mongodb"
import * as UserRepository from "./auth.mjs"
import { getComments } from "../db/database.mjs"

// 댓글 작성
export async function create(text, userId, postId) {
  const user = await UserRepository.findById(userId)

  const comment = {
    text: text.trim(),
    createdAt: new Date(),

    // 댓글이 속한 게시글
    postId: new ObjectId(postId),

    // 댓글 작성자 정보
    authorId: user._id,
    name: user.name,
    userid: user.userid,
  }

  const result = await getComments().insertOne(comment)

  return getComments().findOne({
    _id: result.insertedId,
  })
}

// 특정 게시글 안의 모든 댓글을 리턴
export async function getByPostId(postId) {
    return getComments().find({postId : new ObjectId(postId)}).sort({createdAt:-1}).toArray()
}

// 댓글 삭제
export async function remove(id) {
    return getComments().deleteOne({ _id: new ObjectId(id) })
}

// 댓글 변경
export async function update(id, text) {
    return getComments().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { text } },
        {returnDocument: "after"}
    ).then((result) => result)
}