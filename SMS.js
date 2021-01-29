
function SMS(params){

    function post(data,callback){
        var proxyURL = "https://cors-anywhere.herokuapp.com/";
        var smsGetURL = "https://api.africastalking.com/restless/send?username=ict4cop-kenya&Apikey=" + data.message + "&to=" + data.to
        var finalURL = proxyURL + smsGetURL;

        var request = new XMLHttpRequest();
        request.open('GET', finalURL, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader( 'Access-Control-Allow-Origin', '*');
        //request.setRequestHeader('Apikey', params.Apikey);
        //request.setRequestHeader('username', params.username);
        request.setRequestHeader('Accept', 'application/json');

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                console.log( "Success 1 -- " + request.response );
                //var data = JSON.parse(request.responseText);
                var data = JSON.parse(request.response);
                console.log( "Success 2 -- " + data );
                callback(null,request,data);
            } else {
                // We reached our target server, but it returned an error
                console.log( "Error 1  -- " + request.response );
                callback(request,null,null);
            }
        };
        
        request.onerror = function(e) {        
            // There was a connection error of some sort
            console.log( "Error 2  -- " + request.response );
            callback(e,null,null);

        };
        
        request.send(JSON.stringify(data));
    }

    this.sendBulk = function(msg,users,callback){

        var phones = users.reduce(function(list,obj){
            if (obj.phoneNumber && obj.phoneNumber.length>12){
                list.push(obj.phoneNumber);
            }
            return list;
        },[]).join(",");
        
        var data = {
            to:phones,
            message:msg,
            Apikey:"",
            username : "",
        };
        
        post(data,callback);
        
    }
    
    this.send = function(msg,users,callback){
     

        function sendSMS(reference,index,msg,users,callback){
            if (users.length==index){
                callback(reference)
                return
            }

            if (!users[index].phoneNumber){
                sendSMS(reference,index+1,msg,users,callback)
                return;
            }
            
            var data = {
                to:users[index].phoneNumber,
                message:msg
            };
            
            post(data,function(error,response,body){
                var res = {
                    error : false,
                    response : body,
                    user : users[index]
                }
                
                if (error){
                    res.error = true;
                }else if (body.error){
                    res.error=true;
                }

                           
                reference.push(res); 
                sendSMS(reference,index+1,msg,users,callback)
            })
        }

        sendSMS([],0,msg,users,function(reference){
            callback(reference);
        })
        
    }    
}

module.exports=SMS;
