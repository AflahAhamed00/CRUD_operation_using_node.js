const http=require('http');
const fs = require('fs');
require('dotenv').config();
const filepath = "./data.json";
const fileContents = fs.readFileSync(filepath, 'utf-8');
const jsonData = JSON.parse(fileContents);
const controller=require('./controller');

const PORT=process.env.PORT||8080;


let startpage=fs.readFileSync('./index.html','utf-8');
let userlistpage=fs.readFileSync('./userlist.html','utf-8');
let addUserpage=fs.readFileSync('./add-user.html','utf-8');
let updateUserPage=fs.readFileSync('./update-user.html','utf-8');

http.createServer((req,res)=>{
    if(req.method=='GET' && req.url=="/"){
        res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          let userDataArray=jsonData.map(item=>{
            let output=userlistpage.replace('{{%Name%}}',item.Name);
            output=output.replace('{{%Place%}}',item.Place);
            output=output.replace('{{%Phone%}}',item.Phone);
            output=output.replace('{{%id%}}',item.id);
            output=output.replace('{{%did%}}',item.id);
            return output;
          });
          let finalOutputHtml=startpage.replace('{{%content%}}',userDataArray.join(''));
          
          res.end(finalOutputHtml);
    }
    if(req.method=='GET' && req.url=="/add-user"){
        res.end(addUserpage);
    }
    if(req.method=='POST' && req.url=="/add-user/add"){
        controller.create(req,res);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(addUserpage); 
    }
    if(req.url.match(/\/update\/([0-9]+)/) && req.method === "GET") {
        const id = req.url.split("/")[2];
        const userData=controller.getUpdateDetails(id,res);

        let output=updateUserPage.replace('{{%id%}}',userData.id);
            output=output.replace('{{%Name%}}',userData.Name);
            output=output.replace('{{%Place%}}',userData.Place);
            output=output.replace('{{%Phone%}}',userData.Phone);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(output); 
    
        
    }
    
    if(req.url.match(/\/update\/([0-9]+)/) && req.method === "PUT"){
        const id = req.url.split("/")[2];
       controller.update(id,req,res);
        res.end();
    }

    if(req.url.match(/\/delete\/([0-9]+)/) && req.method === "DELETE"){
        const id = req.url.split("/")[2];
       controller.delete(id,req,res);
        res.end();

    }
}).listen(PORT,()=>{
    console.log(`Server listening from ${PORT}`);
});