function createInsertSql() {
  const TABLENAME = "games";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('ゲーム一覧');
  const sqlSheet = ss.getSheetByName('SQL');
  const maxRow = dataSheet.getLastRow();
  console.log(maxRow);
  const columns = {};

  // それぞれに対応するカラムの値
  columns.title = 1;
  columns.link = 2;
  columns.steamId = 3;
  columns.hardWare = 4;
  columns.category = 5;

  const hardwareList = {
        'PC': 1,
        'Switch': 2,
        'PS4': 3,
        'その他' : 99
  };
  const categoryList = {
        'シューティング': 1,
        'アクション': 2,
        'RPG': 3,
        'アドベンチャー': 4,
        'シミュレーション': 5,
        'その他': 99
  };

  let sql;
  let outputRow=1;

  // 以下SQLの作成
  for (let row=2; row <= maxRow; row++) {
    sql = "INSERT INTO " + TABLENAME + "("

    for(let column in columns) {
      sql = sql + dataSheet.getRange(1, columns[column]).getValue();
      if(column == 'category') {
        sql = sql + ") VALUE (";
      } else {
        sql = sql + ",";
      }
    }

    // 値の設定
    for(let column in columns) {
      let value = dataSheet.getRange(row,columns[column]).getValue();
      
      if (value == '') {
        // 値が入っていない場合
        switch(column) {
          case 'hardWare':
            sql = sql + 99;
            break;
          case 'category':
            sql = sql + 99;
            break;
          default:
            sql = sql + "NULL";
            break;
        } 
      } else {
        // 値がある場合
        switch(column) {
          case 'hardWare':
            value = hardwareList[value] ?? 99;
            sql = sql + value;
            break;
          case 'category':
            value = categoryList[value] ?? 99;
            sql = sql + value;
            break;
          case 'steamId':
            sql = sql + value;
            break;
          default:
            sql = sql + "'" + dataSheet.getRange(row,columns[column]).getValue() + "'";
            break;
        } 
      }

      if(column == 'category') {
        sql = sql + ");";
      } else {
        sql = sql + ",";
      }
    }
    sqlSheet.getRange(outputRow, 1).setValue(sql);
    outputRow++;
  }
}
