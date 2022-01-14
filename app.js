/* 모듈 */
const WebSocket = require('ws');
const path = require('path');
const url = require('url');
const express = require('express');
const app = express();
var qs = require('querystring');
var mysql = require('mysql');


/* MySQL Connection Info */
const dbInfo = {
  host:'192.168.1.127'
  ,user:'aiot'
  ,password:''
  ,database:'test'
}

var conn = mysql.createConnection(dbInfo);

conn.query('select * from code_manage', (err, row)=> {
  if(err) throw err;
  console.log({success: true, data: row});
})


/* Port setting */
app.set('port', process.env.PORT || 8083);


/* 서버와 포트 연결 */
const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});


/* 웹소켓 생성 */
const wss_monitor = new WebSocket.Server({ server });


/* Static 폴더 지정 */
app.use(express.static(path.join(__dirname, '/../www')));


/* 전역 변수 */
var data_from_iaq = {
  id: null,
  pm_1_0: null,
  pm_2_5: null,
  pm_10_0: null,
  temp_c: null,
  temp_f: null,
  humi: null,
  co_2: null,
  tvoc: null,
  score: null,
  date: null,
}


/* 시간 포맷에 맞도록 변경하는 함수 */
// function get_now(){
//   var today = new Date();

//   var year = String(today.getFullYear()).slice(-2);
//   var month = ('0' + (today.getMonth() + 1)).slice(-2);
//   var day = ('0' + today.getDate()).slice(-2);
  
//   var hours = ('0' + today.getHours()).slice(-2); 
//   var minutes = ('0' + today.getMinutes()).slice(-2);
  
//   // var dateString = year + month  + day + hours + minutes;
//   var dateString = year + month  + day;
//   return dateString;
// }


/* MySQL로 데이터 보내는 함수 */
function send_data_to_DB(body) {
  try {
    console.log('type: ', body['type']);
  }
  catch (error) {
    console.log(body);
  }

  if (body['type'] === 'IAQ' && body['devices'].length >= 1 && body['devices'][0]['name'] !== 'IAQ_PuaKTI1m') {
    console.log(body['devices'].length);
    try {
      data_from_iaq = {
        id: body['devices'][0]['id'],
        pm_1_0: body['devices'][0]['pm_1_0'],
        pm_2_5: body['devices'][0]['pm_2_5'],
        pm_10_0: body['devices'][0]['pm_10_0'],
        temp_c: body['devices'][0]['temp_c'],
        temp_f: body['devices'][0]['temp_f'],
        humi: body['devices'][0]['humi'],
        co_2: body['devices'][0]['co_2'],
        tvoc: body['devices'][0]['tvoc'],
        score: body['devices'][0]['score'],
      }

      console.log(data_from_iaq);
      console.log(Object.values(data_from_iaq).length);

      // 쿼리문 작성
      var sql_string = "";
      for (var i = 0; i < Object.values(data_from_iaq).length; i++) {
        if (i === 0) {                                                        // 첫 번째 데이터 id(CD:E2:AE:DE:C0:56)가 문자열이기 때문에 작은 따옴표 추가
          sql_string += "'" + Object.values(data_from_iaq)[i] + "'" + ',';
        } else {                                                              // 첫 번째 데이터가 아닌 경우
          sql_string += Object.values(data_from_iaq)[i] + ',';
        }
      }
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('sql_string : ', sql_string);                               // 쿼리 문 출력
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

      // MySQl서버에 쿼리문 전송
      conn.query('insert into iaq_manage values(' + sql_string + "DATE_FORMAT(now(), '%y%m%d%H%i'));"  , (err, row)=> {
        if(err) throw err;
        console.log('query result: ', row);
      })

      console.log('-----------------------Data from Sensors--------------------------');
      console.log('tvoc:   ', body['devices'][0]['tvoc'], 
                  'humi:   ', body['devices'][0]['humi'], 
                  'co_2:   ', body['devices'][0]['co_2'], 
                  'temp_c: ', body['devices'][0]['temp_c']);
      console.log('--------------------------End of Data-----------------------------');
      
      if (web_socket !== null) {
        web_socket.send(JSON.stringify(data_from_iaq));
        console.log('data sent');
      } else {
        console.log('web_socket is null');
      }

    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}


/* 라우터 설정 */
app.get('/', (req, res) => {

});

app.post('/Aaa/a(a)?a', (req, res) => {
  console.log('\n', '\n', '/Aaa/a(a)?a');
  var body = "";                          // 받은 데이터를 저장할 변수선언

  req.on('data', function (data) {
    body += data;                         // 받은 데이터들을 모두 합쳐준다.
  });

  req.on('end', function () {
    json_data = JSON.parse(body);         // 들어온 내용들을 JSON으로 들어온 내용들을 파싱해준다.
    var post = qs.parse(body);            // qs로 파싱해서 보여줘야 array들의 내용들이 보인다.
    console.log(post);
    send_data_to_DB(json_data);           // mysql 데이터 보내는 함수 호출
  });

  res.writeHead(200);
  res.end("Success");
});


app.post('/Bbb/b(b)?b', (req, res) => {
  console.log('\n', '\n', '/Bbb/b(b)?b');
  var body = "";

  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    json_data = JSON.parse(body);
    var post = qs.parse(body);
    console.log(post);
    send_data_to_DB(json_data);
  });

  res.writeHead(200);
  res.end("Success");
});


/* 404 에러처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});


/* 모니터 웹소켓 */
var web_socket = null;                        // 웹소켓 저장할 전역변수
wss_monitor.on('connection', (ws, req) => {   // Connection Generate
  web_socket = ws;                            // 연결된 소켓을 전역변수에 할당해서 사용
  ws.on('message', (message) => {             // 클라이언트로부터 받은 메세지
    var data = JSON.parse(message);
    console.log(data);
  });

  ws.on('error', (err) => {                   // 에러처리
    console.error(err);
  });

  ws.on('close', () => {                      // 종료
    console.log('클라이언트 접속 해제');
    clearInterval(ws.interval);
  });
});