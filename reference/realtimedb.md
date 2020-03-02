
* 良いねの表示、個人への通知
    * 数
    * 誰から
* 分かるの表示、個人への通知
* リンクの表示、

こっちで管理したいdocumentId

* 自分が良いねした投稿
* 自分が分かるした回答
* リンクされた自分の回答

jsonのカタチ

* uid
    * name
    * nices
        * $postDoc: trueみたいな
    * gotits
        * $ansDoc
            * $postDoc
    * linked---部分的に表示させたいデータはもつ
        * $ansDoc
            * postDoc
            * uri
            * thm
            * body

* $postDoc
    * nices---部分的に表示させたいデータをもつ
        * num
        * $uid

* $ansDoc
    * gotits---部分的に表示させたいデータをもつ
        * num
        * $uid
    * mutual
        * $ansDoc---部分的に表示させたいデータはもつ
            * postDoc
            * uri
            * thm
            * body
    * from
        * $ansDoc---部分的に表示させたいデータはもつ
            * postDoc
            * uri
            * thm
            * body
    * to
        * $ansDoc---部分的に表示させたいデータはもつ
            * postDoc
            * uri
            * thm
            * body

* NoSQL概要
    * RDBでは対処しづらいビッグデータに対応すべく生み出された技術
    * 機能は豊富ではない
    * データ整合性が緩い
    * 結果整合性でよいという考え

* CAP定理
    * consistency: 常に同一のデータを参照する
    * availability: 常に読み出しと書き込みができる
    * partition tolerance: ネットワークが分断されても間違った結果を引き起こさない

    * SQLはcaに分類される

* NoSQLに期待すること
    * 一台のサーバには収容できないほど膨大なデータを扱う
    * データを複数のサーバに分割して割り当てる
    * 高価なハードウェア等ではなく、安価な汎用ハードウェアの上で稼働する
    * データに紛失がなく、データは安全な状態に格納されている
    * システム全体としては、いつでも使える状態にある
    * 障害が発生しても短時間で復旧できる
    * リアルタイムに近い応答性能を備えている

* NoSQLのデータモデリングについて
    * いろいろある
        * key-value
        * document指向型
            * firebaseではfirestoreとrealtime databaseの二種類ある
                * firestore
                    * collectionにdocumentを管理
                    * 独自のrelation機能を兼ね備えた
                        * query
                        * subcollection
                * realtime database 
                    * jsonオブジェクトで管理
                    * auto sync



