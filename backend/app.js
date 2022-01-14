/* 모듈 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const WebSocket = require('ws');
const url = require('url');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


/* 웹소켓 생성 */
const wss_monitor = new WebSocket.Server({ server });


/* Static 폴더 지정 */
app.use(express.static(path.join(__dirname, '/../www')));


/* 라우터 설정 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

app.get('/Aaa/aaa', (req, res) => {
  res.sendFile(path.join(__dirname + '/../www/sensor.html'));
});


/* 404 에러처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});


/* 모니터 웹소켓 */
wss_monitor.on('connection', (ws, req) => { // Connection Generate
  ws.on('message', (message) => { // 클라이언트로부터 받은 메세지
    var data = JSON.parse(message);
    console.log(data);
  });

  ws.on('error', (err) => { // 에러처리
    console.error(err);
  });

  ws.on('close', () => { // 종료
    console.log('클라이언트 접속 해제');
    clearInterval(ws.interval);
  });

  const intervalObj = setInterval(() => { // 1초 주기로 0~9 정수 데이터 전송 
    var sensor_data = {
      wearable_band_num: 1,
      tmp: Math.floor(Math.random() * 41), 
      hum: Math.floor(Math.random() * 101), 
      CO2: Math.floor(Math.random() * 41), //수치 조정
      TVOC: Math.floor(Math.random() * 41), //수치 조정
      pm_1_0: Math.floor(Math.random() * 41),
      pm_2_5: Math.floor(Math.random() * 41),
      pm_10: Math.floor(Math.random() * 41)
    }
  
    ws.send(JSON.stringify(sensor_data));
  }, 1000);
});

module.exports = app;
