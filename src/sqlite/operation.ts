import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export const initDb = (uid: string) => {
  console.log(FileSystem.documentDirectory + 'SQLite/');
  const db = SQLite.openDatabase('alpha_app');

  db.transaction(
    tx => {
      tx.executeSql('select * from users', null, (_, resultSet) => {
        if (resultSet.rows.length === 0) {
          tx.executeSql(
            'create table users (id integer primary key not null, isFirst boolean, uid text, userName text);',
            null,
            () => {
              console.log('success');
            },
            () => {
              console.log('fail');

              return true;
            },
          );
          tx.executeSql(
            'insert into users (isFirst, uid, userName) values (?,?,?)',
            ['1', uid, 'ああああ'],
            () => {
              console.log('success');
            },
            e => {
              console.log('fail');
              console.log(e);

              return true;
            },
          );
        } else {
          console.log('exists');
        }
      });

      tx.executeSql(
        'create table if not exists anss (id integer primary key not null, uid text, postId text, ansId text);',
        null,
        () => {
          console.log('success');
        },
        () => {
          console.log('fail');

          return true;
        },
      );

      tx.executeSql(
        'select * from anss where uid = (?)',
        [uid],
        (_, resultSet) => {
          if (resultSet.rows.length === 0) {
            tx.executeSql(
              'insert into anss (uid) values (?)',
              [uid],
              () => {
                console.log('success');
              },
              e => {
                console.log('fail');
                console.log(e);

                return true;
              },
            );
          } else {
            console.log('exists');
          }
        },
      );
    },
    () => {
      console.log('fail all');
    },
    () => {
      console.log('success');
    },
  );
};
