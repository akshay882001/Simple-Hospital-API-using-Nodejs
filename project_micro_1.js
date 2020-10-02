const express = require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
let server=require('./server_project1');
let config=require('./config_project1');
let middleware=require('./middleware_project1');
const response=require('express');
const url='mongodb://127.0.0.1:27017';
const db_name='project1';//hospitalEquipment database
let db
MongoClient.connect(url,{ useUnifiedTopology:true } ,(err,client) =>
{
    if(err) return console.log(err);
    db=client.db(db_name);
    console.log('connected to database:'+url);
    console.log('database : '+db_name);
});

app.get('/hospital_table', middleware.checkToken, function(req, res) {
    var da= db.collection("hospital_table").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of hospital',da);
  });

  app.get('/Ventilator_table',middleware.checkToken, function(req, res) {
    var da= db.collection("ventilator_table").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of Ventilator',da);
  });

app.post('/search_ventilator',middleware.checkToken, (req,res) =>{
      var status=req.body.status;
      console.log(status);
      var Ventilatordetails=db.collection('ventilator_table')
      .find({"status": status}).toArray().then(result=>res.json(result));
});
app.post('/search_ventilatorn',middleware.checkToken,(req,res) => {
  var name=req.query.name;
  console.log(name);
  var Ventilatordetails= db.collection('ventilators')
  .find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
app.put('/update_ventilator',middleware.checkToken,(req,res) => {
  var vent_id={ventilatorId: req.body.ventilatorId};
  console.log(vent_id);
  var newvalues={ $set :{ status:req.body.status}};
  db.collections("ventilators_table").updateOne(vent_id,newvalues,function(err,result){
    res.json('1 document updated');
  });
});
app.post('/add_ventilator',middleware.checkToken,(req,res)=>{
  var hId=req.body.hId;
  var ventilatorId=req.body.ventilatorId;
  var status=req.body.status;
  var name=req.body.name;
  var item={
    hId:hId,ventilatorId:ventilatorId,status:status,name:name
  };
  db.collection('ventilators_table').insertOne(item,function(err,result){
    res.json('Item inserted');
  });

});
app.delete('/delete_ventilator',middleware.checkToken,(req,res)=>{
  var myquery=req.query.ventilatorId;
  console.log(myquery);
  var myquery1={ ventilatorId: myquery};
  db.collection('ventilators_table').deleteOne(myquery1,function(err,obj)
    {
      res.json("1 document deleted");
    });
});
app.listen(1000);