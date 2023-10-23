const bodyParser = require('body-parser');
const express = require('express');


const app = express();

app.set('view engine','ejs');

app.set('views', __dirname+"/views");
app.use(express.static(__dirname+'/public'))


app.use(bodyParser.urlencoded({extended:false}));
var items=[];





app.get('/',function(req,res){

// res.re(__dirname+'/inde.html')
// });
    
    const day= new Date();
   
    const options = {
        weekday:"long",
        day:'numeric',
        month:'long'
    }

    const today= day.toLocaleString('en-US',options);
    res.render('lists',{kindOfDay:today,newItem:items});
    
    
})


app.post('/',function(req,res){
    var item = req.body.item;

    items.push(item);
    res.redirect('/');
})

app.listen(3000,function(){
    console.log('server started');
});


  