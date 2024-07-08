
// ------------------------------------------------------DEV_Q--------------------------------------------//


function fn_IOField(tag, IOField){
    socket.on(tag,function(data){
        document.getElementById(IOField).value = data;
    });
}
 

function fn_SymbolStatus(Tag, SymName, ObjectID){
    var imglink_0 = "images/dev_Q/" + SymName + "_0.png"; // Trạng thái tag = 0
    var imglink_1 = "images/dev_Q/" + SymName + "_1.png"; // Trạng thái tag = 1
    var imglink_2 = "images/dev_Q/" + SymName + "_2.png"; // Trạng thái tag = 2
    var imglink_3 = "images/dev_Q/" + SymName + "_3.png"; // Trạng thái tag = 3
    var imglink_4 = "images/dev_Q/" + SymName + "_4.png"; // Trạng thái tag = 4
    var imglink_5 = "images/dev_Q/" + SymName + "_5.png"; // Trạng thái tag = 5
    socket.on(Tag,function(data){
        if(data == 0){
            document.getElementById(ObjectID).src = imglink_0;
        }
        else if(data == 1){
            document.getElementById(ObjectID).src = imglink_1;
        }
        else if(data == 2){
            document.getElementById(ObjectID).src = imglink_2;
        }
        else if(data == 3){
            document.getElementById(ObjectID).src = imglink_3;
        }
        else if(data == 4){
            document.getElementById(ObjectID).src = imglink_4;
        }
        else{
            document.getElementById(ObjectID).src = imglink_5;
        }
    });
}

// ------------------------------------------------------DEV_Q--------------------------------------------//