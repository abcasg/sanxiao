var res = {
    bg_png: "res/bg.png",
    bj01_png: "res/bj01.png",
    bj02_png: "res/bj02.png",
    leopard_ani_png: "res/leopard/leopard_ani.png",
    leopard_ani_json: "res/leopard/leopard_ani.json",
    leopard_ani_atlas: "res/leopard/leopard_ani.atlas",

    //cubebg_png: "res/cubebg.png"
};
//for (var i = 1; i <= 6; i++) {
//    res["cube_png" + i] = "res/cube" + i + ".png";
//}
for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 3; j++) {
        res["fruit" + i + j] = "res/fruit_0" + i + "_0" + j + ".png";
    }
}
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
