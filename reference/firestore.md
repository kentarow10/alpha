# 中身

## collection('posts')
* $postDocument
    * path
    * owner
    * thm
    * createdAt
    * subcollection('answers')
        * $ansDocument
            * uri
            * body
            * owner
            * createdAt
            * orderThm
            * subcollection('comment')
                * $commentDocument
                    * body
                    * owner
                    * createdAt

## collection('users')
* $uid
    * iconPath
    * siBody

# 最初の画面

* tl
    * type: post[]
    * query: db.collection('posts')

* 個人のposts
    * uid指定
    * type: post[]
    * query: db.collection('posts').where(uid)

* 個人のanss
    * uid指定
    * type: comb[]
    * query: db.collectionGroup('answers').where(uid)

* links
    * type: comb[]
    * query: ref()

* 自分のniced
    * realtime連携
    * uid指定
    * type: post[]
    * query: ref($uid/nices).once('value').でpostDocをリスト取得
    * query: .getで全docから上記docでfilter
        * サブコレクションも全部得る？

* 自分のgotit
    * uid指定
    * type: comb[]

* 自分のlinks
    * uid指定
    * type: comb[]



# 裏で待っているの画面

* posted
    * 渡される
        * subcollection('answers')までの情報
    * realtimeから取得
        * $postDoc/nices/以下のnumとuidリスト
        * $ansDoc/gotits/以下のnumとuidリスト
    
* detail
    * 渡される
        * subcollection('comment')までの情報
    * realtimeから取得
        * $ansDoc/from/
        * $ansDoc/to/





