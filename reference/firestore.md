# 中身

## collection('links')
* :ansDocument
    * subcollection('from')
        * :ansDocument
            * ansDoc(参照用)
            * postDoc
            * uri
            * thms
            * order
            * body
            * ansAt
            * parent(参照用)
    * subcollection(to')
        * :ansDocument
            * ansDoc(参照用)
            * postDoc
            * uri
            * thms
            * order
            * body
            * ansAt
            * parent(参照用)
    * subcollection('mutual')
        * :ansDocument
            * ansDoc(参照用)
            * postDoc
            * uri
            * thms
            * order
            * body
            * ansAt
            * parent(参照用)

## collection('posts')
* $postDocument
    * path
    * w
    * h
    * postBy
    * thms
    * postAt
    * subcollection('answers')
        * $ansDocument
            * postDoc
            * uri
            * body
            * ansBy
            * ansAt
            * order
            * w
            * h
            * tate
            * postBy
            * thms
            * postAt
            * subcollection('comments')
                * $commentDocument
                    * com
                    * comBy
                    * comAt

## collection('users')
* $uid
    * name
    * iconPath
    * siBody
    * subcollection('nices')：一覧表示で必要になる情報
        * $postDocument(自動生成でなく指定する)
            * uri
            * postBy
            * postAt
            * postDoc(参照用)
            * parent(参照用)
    * subcollection('gotits')：一覧表示で必要になる情報
        * $ansDocument(自動生成でなく指定する)
            * postDoc
            * uri
            * thms
            * order
            * body
            * ansBy
            * ansAt
            * ansDoc(参照用)
            * parent(参照用)
    
* onSnapshot()でドキュメントをリスンできる

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





