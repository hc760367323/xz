const express=require('express');
const pool=require('../pool.js')
const r=express.Router();
r.post('/reg',(req,res)=>{ 
    var obj=req.body;  
    console.log(obj);
    //验证各项数据是否为空
    var i=400;
    for(var k in obj){
        i++;
        if(!obj[k]){
            res.send({code:i,msg:k+'不能为空'})
            return
        }
    }
    pool.query('insert into xz_user set ?',[obj],(err,result)=>{
        if(err){
            res.send({code:500,mgs:'服务器端错误'})
            return
        }
        res.send({code:200,msg:'注册成功'})
    })
})
r.post('/login',(req,res)=>{
    var obj=req.body
    console.log(obj);
    if(!obj.uname){
        res.send({code:401,msg:'uname用户名为空'})
        return;
    }
    if(!obj.upwd){
        res.send({code:402,mgs:'upwd密码不能为空'})
        return;
    }
    pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err){
            console.log(err);
            res.send({code:500,msg:'服务器端错误'})
            return;
        }
        console.log(result);
        //返回结果为数组,数据长度为0说明登陆失败,否则登陆成功
        if(result.length===0){
            res.send({code:201,msg:'登陆失败'})
        }else{
            res.send({code:200,msg:'登陆成功'})
        }
    })

})
r.put('/:uid',(req,res)=>{
    var obj1=req.params;
    var obj2=req.body;
    console.log(obj1,obj2);
    var i=400;
    for(var k in obj2){
        i++;
    if(!obj2[k]){
        res.send({code:i,msg:k+'不能为空'});
        return;
    }
    }
    pool.query('update  xz_user  set  ? where uid=?',[obj2,obj1.uid],(err,result)=>{
        if(err){
            res.send({code:500,mgs:'服务器错误'})
        }
        console.log(result);
        //如果返回的 affectedRows的属性为0,修改失败,否则修改成功
        if(result.affectedRows===0){
            res.send({code:201,msg:'修改失败'})
        }else{
            res.send({code:200,msg:'修改成功'})
        }
    })
})
r.get('/',(req,res)=>{
    var obj=req.query
    console.log(obj);
    if(!obj.pno)obj.pno=1
    if(!obj.count)obj.count=2
    var a=(obj.pno-1)*obj.count
    obj.count=parseInt(obj.count)
    pool.query('select uid,uname from xz_user limit ?,? ',[a,obj.count],(err,result)=>{
        if(err){
        res.send({code:500,mgs:'服务器端错误'})
        return;
        }
        console.log(result);
        if(result.length>=1){
            res.send({code:201,msg:'获取成功',data:result})
        }else{
            res.send({code:200,msg:'获取失败'})
        }     
    })
})
r.get('/checkuname',(req,res)=>{
    var obj=req.query
    console.log(obj)
    pool.query('select * from xz_user where uname=?',[obj.uname],(err,result)=>{
        if(err){
            res.send({code:500,mgs:'服务器端错误'})
            return;
        }
        console.log(result);
        if(result.length===1){
            res.send({code:201,msg:'该用户已注册'})
        }else{
            res.send({code: 200,msg:'该用户可以使用'})
        }  
    })
   
})
r.delete('/:uid',(req,res)=>{
    var c=req.query
    console.log(c);
        var a=req.params//路由传参返回的数据
    // var obj=req.body
    console.log(a.uid);
    pool.query('delete from xz_user where uid=? ',[a.uid],(err,result)=>{
        if(err){
            res.send({code:500,mgs:'服务器错误'})
        }
        console.log(result);
        if(result.affectedRows===1){
            res.send({code:200,mgs:'删除成功'})
        }else{
            res.send({code:200,mgs:'删除失败'})
        }
    })    
})
module.exports=r;

