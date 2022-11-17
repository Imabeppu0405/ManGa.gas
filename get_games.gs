function getGames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ゲーム一覧');

  // エラーメッセージ表示用（script上での実行の際はコメントアウト必要）
  const ui = SpreadsheetApp.getUi();
  
  // steamIdはH1に記載
  const steamId = sheet.getRange('H1').getValue();
  console.log(steamId.length);
  if(steamId.toString().length !== 17) {
    ui.alert('steamIdの桁数が不正です');
    return;
  }
  const key = 'AD3C37E9864BCEBC30315C227B231C09';

  // steamIdをもとにその人がもつゲーム情報を取得
  const response = UrlFetchApp.fetch(
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v001/?key="+　key + "&steamid=" + steamId + "&format=json&include_appinfo=true",
    {
      method: "GET",
      contentType: "application/json",
      muteHttpExceptions: true,
    }
  );
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const responseJson = JSON.parse(responseBody);

    // 空の場合
    if(!Object.keys(responseJson.response).length) {
      ui.alert('ゲームの取得に失敗しました。');
      return;
    }

    // 取得時
    const games = responseJson.response.games;
    console.log(responseJson);
    // 値をSSに記載
    games.forEach((game) => {
      const data = [game['name'], 'https://store.steampowered.com/app/' + game['appid'], game['appid'], 'PC'];
      sheet.appendRow(data);
  })
  } else {
    // エラー時
    Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody));
    ui.alert('ゲームの取得に失敗しました。');
  }
}

function clearGameList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ゲーム一覧');
  sheet.getRange("A2:E1000").clear();
}
