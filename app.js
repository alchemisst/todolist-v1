const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const { list } = require("postcss");
const _ = require("lodash");


const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB");

const todoSchema = {
  name: String,
};

const Item = mongoose.model("Item", todoSchema);

app.set("view engine", "ejs");

app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

const item1 = new Item({
  name: "Buy Food",
});
const item2 = new Item({
  name: "Buy Car",
});
const item3 = new Item({
  name: "Buy Fruits",
});
const item4 = new Item({
  name: "Get Books",
});
const defaultItems = [item1, item2, item3, item4];


console.log("success added");
const listsSchema = {
  name: String,
  items: [todoSchema],
};

const List = new mongoose.model("list", listsSchema);

app.get("/", function (req, res) {
  Item.find({})
    .exec()
    .then(function (result) {
      res.render("lists", { kindOfDay: "Today", allItem: result });
    });
});

app.post("/", function (req, res) {
  const listname1 = req.body.list1;
 
  var itemm = new Item({
    name: req.body.item,
  });
  

if(listname1==="Today"){
    itemm.save()
    
    res.redirect("/")
  
}  else{ 
  List.findOne({ name: listname1 }).then(function (result){
    result.items.push(itemm);
    result.save();
   
  });
  res.redirect("/"+listname1)
} 
 


});

app.post("/delete", function (req, res){
  const itemId = req.body.checkbox;
  const listName = req.body.listName
  console.log(itemId + listName)
  if(listName==="Today"){
    Item.deleteOne({ _id: itemId }).then(function (result) {
      console.log(result);
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id: itemId }}}).then(function(result){
      
          console.log(result)
          })
          
        }
        res.redirect("/"+listName)
  
  

        });

app.get("/:listname", function (req, res) {
  const customListName = _.capitalize(req.params.listname);

  List.findOne({ name: customListName }).then(function (found1) {
    if (!found1) {
      console.log("created");
      const listName = new List({
        name: customListName,
        items: defaultItems,
      });
      listName.save();
      res.redirect("/");
    } else {
      res.render("lists", {
        kindOfDay: found1.name,
        allItem: found1.items,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server started");
});
