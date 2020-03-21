
* firestoreのonSnapshotでイベントリスナーが可能なので、
こちらで何を扱うかを再考する。

* 複数ユーザーが同時に書き込む可能性、頻度が高いもの

jsonのカタチ

* uid
    * username

* $postDoc
    * nicesCount
    * nices
        * $uid

* $ansDoc
    * gCount
    * gs
        * $uid

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



