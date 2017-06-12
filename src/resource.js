var res = {
    //HelloWorld_png : "res/HelloWorld.png",
};
for(var i = 1;i<=6;i++){
    res["cube_png" + i] = "res/cube" + i + ".png";
}
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
