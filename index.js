const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const i18n = require("i18n");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const indexRouter = require('./routes/indexRouter');

const app = express();

//.ENV
dotenv.config();

app.use(express.static("public"));
app.use(express.json()); //phản hồi ở dạng json
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set("views", "./views");
app.set('views', path.resolve(__dirname, 'views'));
app.use(i18n.init);

var server = require("http").Server(app);
var io = require("socket.io")(server);

//CONECT SERVER
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

//LANGUAGE
i18n.configure({
  locales:['en', 'vi'],
  directory: __dirname + '/locales',
 cookie: 'lang',
 });
app.use('/change-lang/:lang', (req, res) => { 
  res.cookie('lang', req.params.lang, { maxAge: 900000 });
  res.redirect('back');
});

//ROUTES
// app.use(authRouter);
app.use(indexRouter);

const {fn_tag, plc_tag } = require('./public/js/fn_tag.js');
fn_tag();
plc_tag();

// HÀM GHI DỮ LIỆU XUỐNG PLC
function valuesWritten(anythingBad) {
  if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
  console.log("Done writing.");
}

// Nhận các bức điện được gửi từ trình duyệt
io.on("connection", function(socket){
  // Bật tắt động cơ M1
      socket.on("Trig_Data", function(data){
      conn_plc.writeItems('Trig_Data', data, valuesWritten);
});
});
