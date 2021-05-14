const fs= require("fs");
const express=require('express');
const app=express();
const formidable = require("formidable");
var form = new formidable.IncomingForm();
form.uploadDir = './upload';
form.keepExtensions = true;
form.maxFieldsSize = 50 * 1024*1024;
var PATH="C:\\myweb\\upload\\"
function time(str){
    var time=new Date()
    var time=time.toLocaleString()
    console.log(str+':'+time);
}
function show(response) {
    response.setHeader('Content-type','text/html;charset=utf-8')
    var html = ''
    fs.readdir('./upload', 'utf8', (err, msgArr) => {
        if(msgArr.length==0){html='<h1>暂未上传任何文件</h1>'}
        else{}
        for (let i = 0, len = msgArr.length; i < len; i++) {
            html+=(`<div class="list-group-item"><div class="pull-left filename">${msgArr[i]}</div>
            <div class="pull-right meth"><div class="aclick" onclick="aclick('dele?name=${msgArr[i]}',3) ">
            删除</div><a class="aclick" href="/down?name=${msgArr[i]}">下载</a>
            <div class="aclick" onclick="aclick('detail?name=${msgArr[i]}',1) ">
            详情</div></div></div>`)
        }
        setTimeout(function () {
            response.send(html);
        }, 100)
    })
}
    app.get('/',(request,response)=>{
        response.setHeader('Access-Control-Allow-Origin','*')
        response.setHeader('Content-type','text/html;charset=utf-8')
            fs.readFile('./cloud.html','utf-8',(e,d)=>{
                response.end(d)
            })
        })

    app.get('/refresh',(request,response)=>{
        response.setHeader('Access-Control-Allow-Origin','*')
        show(response)
    })

app.post('/up',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    form.parse(request,function(err,fields,files){
    fs.rename(files.file.path, PATH + files.file.name, () => 
        {time(`上传文件${files.file.name}成功！`) })
    })
    response.send()
})

app.get('/dele',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var url=request.url
    var name=url.replace("/dele?name=","")
    name=decodeURI(name)
    fs.unlink(PATH+name, function(err){
        time(`删除了${name}`)
   })
   response.end()
})

app.get('/down',(request,response,next)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var name=request.url.replace("/down?name=","")
    name=decodeURI(name)
    time(`下载了${name}`)
    response.download(PATH+name)
})

app.get('/detail',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*')
    var url=request.url
    var name=url.replace("/detail?name=","")
    name=decodeURI(name)
    var detail=''
    fs.stat(PATH+name, (err, d) => {
        if(err) throw err;
        setTimeout(() => {
        var size = d.size, birth = d.birthtime, modi = d.mtime;
        detail += ('文件名：' + name + '，大小：' + size/1000 + 'kb，上传日期：' + birth + '，修改日期' + modi)
        detail=detail.replace('GMT+0800 (中国标准时间)','')
        detail=detail.replace('GMT+0800 (中国标准时间)','')
        time(`查看了${name}`)
       response.send(detail)
        },100)
    })
})

app.use(express.static('mysrc'))
app.listen(80,()=>{
    console.log('Server has opened!')
})