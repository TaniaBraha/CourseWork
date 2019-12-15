const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
/*const a=require("./public/js/modules.js");*/
var cookieParser = require('cookie-parser');
var session = require('express-session');

const fs = require("fs");
const path=require("path");
const Handlebars = require("handlebars");
const DATE_FORMATER = require( 'dateformat' );
const port = process.env.PORT;
const notifier = require('node-notifier');
import {notify} from '@heroku-cli/notifications'
notify({
  title: 'notification title',
  message: 'notification message',
})
// String

const app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}))
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.set('views',path.join(__dirname,"views"));
app.set("view engine","hbs");
app.set('view engine', 'ejs');

const pool = mysql.createPool({
  host: "zanner.org.ua",
  port: "33321",
  user: "ka7502",
  password: "snsdparty",
  database: "ka7502"
 
});
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/public"));
app.use(express.static('css'));
app.use(express.static('img'));

app.get("/",function(req, res){
      res.render("firstpage.hbs");
      
});

app.get("/create", function(req, res){
    fs.createReadStream('public/create.html').pipe(res);
});
app.get("/firstpage.html", function(req, res){
      res.render("firstpage.hbs");
});

app.get("/sign_in", function(req, res){
  var message = '';
  message='Enter fields';
  res.render('index.ejs',{message: message});
});
app.get("/sign_up", function(req, res){
  var message='';
  res.render('signup.ejs',{message:message});
});
app.get("/order", function(req, res){
  var message='';
  res.render("order.hbs");
});

/*
app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
   var userId = req.session.userId;
   console.log(userId);
});*/


app.post("/sign_in", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    var message = '';
    var post  = req.body;
      var name2= post.f1_cust_email;
      var pass2= post.f1_cust_pass;
      console.log(name2);
      console.log(pass2);
     pool.query("SELECT c_id FROM users WHERE password=? AND email=?",[pass2,name2],function(err,data){
      if(err) return console.log(err);
      if(data.length){
        pool.query("SELECT c_id,c_fname,c_lname,c_phone,c_adress FROM Customers WHERE c_id=?",[data[0].c_id],function(err,data2){
          req.session.userId=data2[0].c_id;
          req.session.user=data2[0];
          res.render("./firstpage.hbs");
          notifier.notify({
            title: 'Look here',
            message: 'You are succesfully signed in'
          });
        });
      }
      else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
     }); 
});

app.post("/sign_up", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    var message = '';
    var post  = req.body;
      var fname= post.first_name;
      var lname= post.last_name;
      var phone=post.mob_no;
      var date=post.birth_date;
      var adr=post.adress;
      var email=post.email;
      var pass1=post.password1;
      var pass2=post.password2;
      pool.query("SELECT 1 FROM Customers WHERE c_email=?",[email],function(err,data){
        if(err) return console.log(err);
        if(data.length){
          message="Email already in use";
        res.render('signup.ejs',{message: message});
        }
      else{
        if(pass1!=pass2){
        message="Passwords are different";
        res.render('signup.ejs',{message: message});
      }
      else{
        pool.query("CALL Customer_insert(?,?,?,?,?,?)",[fname,lname,phone,email,date,adr],function(err,data){
        if (err) {
        return console.error(error.message);
        }
          pool.query("CALL Users_insert(?,?,(SELECT c_id FROM Customers ORDER BY c_id DESC LIMIT 1))",[pass1,email],function(err,data){
            if (err){
              return console.error(error.message);
            }
          });
      res.redirect("/firstpage.html");
      notifier.notify({
            title: 'Look here',
            message: 'You are succesfully signed up'
          });
    });
    }}
      });
      
});

app.post("/reserv", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const date = req.body.res_date;
    const time = req.body.res_time;
    const people=req.body.res_num;
    const rest=req.body.res_res;
    const name=req.body.res_name1;
    const phone=req.body.res_phone1;
    const d=new Date(date+" "+time);
    var dm= DATE_FORMATER( d, "yyyy-mm-dd HH:MM:ss" );
    pool.query("SELECT SUM(p_count) s FROM  Reservations WHERE res_time=? and rest_id=?",[DATE_FORMATER( d, "yyyy-mm-dd HH:MM:ss" ),rest],function(error,data){
      if(error){
        return console.log(error);
      }
         pool.query("SELECT r_p_count FROM Restaurants WHERE r_id=?",[rest],function(err,data2,fields){
            if(err){ 
              return console.log(err);
            }
            var a=Number(data[0].s)+Number(people);
            if(a>data2[0].r_p_count){
              notifier.notify({
                  title: 'Look here',
                  message: 'Sorry, it is not possible to make a reservation for this time. Try another one please'
                });
              res.redirect("/firstpage.html");
            }
            else{
              pool.query("CALL Reservations_insert(?,?,?,?,?)",[rest,people,DATE_FORMATER( d, "yyyy-mm-dd HH:MM:ss" ),name,phone], function(error, results){
                if (error) {
                  return console.error(error.message);
               }
                res.redirect("/firstpage.html");//можно перенаправить на новую страничку с формой, где ввести имя и номер
                 notifier.notify({
                    title: 'Look here',
                    message: 'Your reservation is succesfull'
                  });                              //но для этого надо модифицировать базу данных(чуть-чуть) наверное 
              });
           }
    });
});
});



app.get("/menu",function(req,res){
  if(!req.session.user){
  notifier.notify({
            title: 'Look here',
            message: 'Please sign in before making an order'
          });
  }
  pool.query("SELECT * FROM Dishes WHERE dh_categ=1", function(err, data1) {
      if(err) return console.log(err);
      pool.query("SELECT * FROM Dishes WHERE dh_categ=2", function(err, data2){
        if(err) return console.log(err);
        pool.query("SELECT * FROM Dishes WHERE dh_categ=3",function(err,data3){
          if(err) return console.log(err);
          res.render("menu3.hbs", {
          d1: data1,
          d2: data2,
          d3: data3
      });
    });
    });
    });  
});

app.post("/order_info",urlencodedParser,function(req,res){
  if(!req.body) return res.sendStatus(400);
  const date = req.body.ord_date;
  const time = req.body.ord_time;
  const rest=req.body.ord_res;
  const adr=req.body.ord_adr;
  const d=new Date(date+" "+time);
  pool.query("CALL Orders_insert(?,?,?,?)",[rest,req.session.user.c_id,DATE_FORMATER( d, "yyyy-mm-dd HH:MM:ss" ),adr],function(err,data){
    if(err){
      return console.log(err);
    }
    
    notifier.notify({
            title: 'Look here',
            message: 'Your order is succesful. Wait for a phone call'
          });
  
  });
});



app.post("/try", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    if(!req.session.user){
      var message = '';
      message='Please sign in to make an order';
      res.render('index.ejs',{message: message});
    }
    const count=req.body.order_count;
    const quantity = req.body.order_item_quantity;
    const title=req.body.order_item_title;
    if(count==1)
    {
      pool.query("CALL Orderinside_insert((SELECT ord_id FROM Orders ORDER BY ord_id DESC LIMIT 1),?,(SELECT dh_id FROM Dishes where dh_name=?))",[quantity,title], function(error, results){
      if (error) {
        return console.error(error.message);
      }
      });
    }   
   else{ 
    for(var i=0;i<count;i++){
      pool.query("CALL Orderinside_insert((SELECT ord_id FROM Orders ORDER BY ord_id DESC LIMIT 1),?,(SELECT dh_id FROM Dishes where dh_name=?))",[quantity[i],title[i]], function(error, results){
      if (error) {
        return console.error(error.message);
      }
   });
    }
 }
   res.redirect("/menu");
});


/*app.get("/menu", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log("before exports");
    
    pool.query('SELECT * FROM users;', function(error, results) {
        console.log("inside exports");
        let str = '<head><title>menu</title></head><body><p>hello iasa!</p>';
        if (error) throw error
          str+='</body>';
          res.write(str);
      });

});*/


/*app.post("/firstpage.html", function(req, res){
    fs.createReadStream('public/firstpage.html').pipe(res);
});
/*
http.createServer(function(request, response){
      
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    const filePath = request.url.substr(1);
    // смотрим, есть ли такой файл
    fs.access(filePath, fs.constants.R_OK, err => {
        // если произошла ошибка - отправляем статусный код 404
        if(err){
            response.statusCode = 404;
            response.end("Resourse not found!");
        }
        else{
            fs.createReadStream(filePath).pipe(response);
        }
      });
}).listen(3000, function(){
    console.log("Server started at 3000");
});
*/
app.listen(port, function(){
  console.log("Сервер ожидает подключения...");
});
