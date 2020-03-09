
* directory構成

* storeの中

    * private
    * me
    * public
    * link
    * behind

* 画面の切り分け

    * private
        * post
        * nices
        * gotits
        * links
        * info
    * me
        * me
    * public
        * public
    * link
        * link
    * behind
        * answer
        * posted
        * detail
        * profile

* directory

* src
    * types.ts:paramList,DBの構成
    * main.tsx
    * navigations
        * authNavigation
        * homeNavigation
    * screens
        * auth
            * signin
            * signup
            * resetpass
        * inDrawer
            * nices
            * gotits
            * linked
            * info
        * inTab
            * timeline
            * mine
            * links
        * inBehind
            * post 
            * posted
            * detail
            * answer
            * profile
            * brawser
    * store
        * screenMng
            * 画面表示の際の共通化処理
        * auth
            * 認証回りの情報を持つ

* reducer切り分けの考察
    * 一つの型に対して作成できる
    * 意味的なまとまりがある方がわかりやすい？
        * private
            * nices
            * gotits
            * linked
            * info
            * mine
        * 
    * 類似処理でまとめる方がわかりやすい？
    * 処理が増えてしまう部分を認識して、そこから考える？
    * 画面の種類ごとに分ける？
        * postの一覧
        * combの一覧
        * 個人のprofile
        * postの内容
        * post-ansの詳細
        * postする
        * ansする
        * 通知
    * 一度開いた画面の情報は保持しておきたいから、画面の種類ごと案は却下

* 命名
投稿と回答の組をPinと呼ぶ

