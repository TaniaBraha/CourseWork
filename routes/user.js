exports.index = function(req, res){
    var message = '';
  res.render('index',{message: message});

exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      //post data
 
   } else {
      res.render('signup');
   }
};