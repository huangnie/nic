/**
 * Created by hn on 2015/3/3.
 */

module.exports={

    editor: function(request,response,callback){
        var index_path = CONFIG.view + 'index.html';
        fs.readFile(index_path,'utf-8',function(err,data){
            response.end(data);
            //callback(req,res,data,'html');
        })
    },
    save: function(request,response,callback){
        execModel('user',function(User){
            var postdata = "";
            request.addListener("data",function(postchunk){
                postdata += postchunk;
            })

            //POST结束输出结果
            request.addListener("end",function(){

                var get_params = url.parse(request.url, true).query;
                var post_params = query.parse(postdata);

                fs.writeFile(CONFIG.data + 'test.txt',post_params['data'],function(){
                    response.write(JSON.stringify({status:1,msg:'success',content:''}));
                    response.end();
                });

                var tmpUser = {name:'huangnie',password:'1234'};
                User.find( tmpUser ,function(err,docs){
                    if(!err){
                        if(docs!=''){
                            console.log(docs);
                        } else{
                            console.log('用户名或密码不正确');
                        }
                    }else{
                        var user = new User(tmpUser);
                        user.save(function (err, user) {
                            if(!err) {
                                console.log(user);
                            }
                        });
                    }
                })

            })
        });
    },
    show:function(request,response,callback){
        execModel('user',function(User) {
            User.find({name: 'huangnie'}, function (err, docs) {
                if (!err) {
                    if (docs != '') {
                        console.log(docs);
                        response.end(JSON.stringify(docs));
                    } else {
                        console.log('用户名或密码不正确');
                    }
                } else {
                    console.log("Something happend.");
                }
            });
        });
    }

}
