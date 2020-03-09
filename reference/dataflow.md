# CRUD
* CREATE, DELETE
# 投稿する
## firestore

* collection('posts')
    * $postDocument
        * path
        * owner
        * thm
        * createdAt

## realtime

* rtdb.ref(postDoc).set({ nicesCount: 0, nices: {example: true} });

# 投稿削除
## firestore

* collection('posts').doc(postDoc).delete()

## realtime

* rtdb.ref(postDoc).remove();

# 回答する

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

* rtdb.ref(ansDoc).set({ gotitsCount: 0, gotits: {example: true} });

# 回答削除

## firestore

* collection('posts').doc(postDoc)

## realtime

* rtdb.ref(ansDoc).remove();

# コメントする
## firestore

* collection('posts')
* doc(postDoc)
* collection('answers')
* doc(ansDoc)
    * subcollection('comments')
        * content
        * comBy
        * comAt

## realtime

なし

# いいねを押す
## firestore

* collection('users')
    * $uid
        * subcollection('nices')
            * $postDocument
                * uri
                * postedAt

## realtime

* rtdb.ref(postDoc).set({ nicesCount: +1, nices: {uid: true} });
* rtdb.ref(postDoc).set({ nicesCount: -1, nices: {uid: null} });

# 分かるを押す
## firestore

* collection('users')
    * $uid
        * subcollection('gotits')
            * $postDocument
                * postDoc
                * uri
                * thm
                * ans
                * postedBy
                * answeredBy
                * postedAt
                * answeredBy

## realtime

* rtdb.ref(ansDoc).set({ gotisCount: +1, gotits: {uid: true} });
* rtdb.ref(ansDoc).set({ gotitsCount: -1, gotits: {uid: null} });

# リンク（した・された）
## firestore

なし

## realtime




* UPDATE
