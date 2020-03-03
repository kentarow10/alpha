# 投稿
## firestore

* collection('posts')
    * $postDocument
        * path
        * owner
        * thm
        * createdAt

## realtime

操作なし

# 投稿削除
## firestore

* collection('posts')
    * $postDocument
        * path
        * owner
        * thm
        * createdAt

## realtime

操作なし

# 回答

## firestore

* collection('posts')
* doc(postDoc)
* collection('answers')
    * $ansDoc
        * postDoc
        * uri
        * body
        * owner
        * createdAt
        * orderThm

## realtime

操作なし

# 回答削除

## firestore

* collection('posts')
* doc(postDoc)
* collection('answers')
    * $ansDoc
        * postDoc
        * uri
        * body
        * owner
        * createdAt
        * orderThm

## realtime

操作なし

# コメント
## firestore
## realtime

# いいね
## firestore
## realtime

# 分かる
## firestore
## realtime

# リンク（した・された）
## firestore
## realtime
