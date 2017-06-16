var effectType = ["hong", "lv", "lan", "huang", "zi"];

var res = {
    bj01_png: "res/bj01.png",
    bj02_png: "res/bj02.png",
    bj03_png: "res/bj03.png",
    jcx_png: "res/jcx.png",
    leo_png: "res/leo.png",
    leopard_png: "res/leopard.png",
    leopard_ani_png: "res/H5_Export/leopard/leopard_ani.png",
    leopard_ani_json: "res/H5_Export/leopard/leopard_ani.json",
    leopard_ani_atlas: "res/H5_Export/leopard/leopard_ani.atlas",

    spineboy_png: "res/H5_Export/jnx/jnx_huang.png",
    spineboy_json: "res/H5_Export/jnx/jnx_huang.json",
    spineboy_atlas: "res/H5_Export/jnx/jnx_huang.atlas",

    //cubebg_png: "res/cubebg.png"
};
//for (var i = 1; i <= 6; i++) {
//    res["cube_png" + i] = "res/cube" + i + ".png";
//}
for (var i = 1; i <= 5; i++) {
    for (var j = 1; j <= 5; j++) {
        res["fruit" + i + j] = "res/fruit_0" + i + "_0" + j + ".png";
    }
}

res["fruit111"] = "res/fruit_11_01.png";

for (var i = 0; i < 5; i++) {
    res[effectType[i] + "_png"] = "res/fruitEle/" + effectType[i] + ".png";
    res[effectType[i] + "_json"] = "res/fruitEle/" + effectType[i] + ".json";
    res[effectType[i] + "_atlas"] = "res/fruitEle/" + effectType[i] + ".atlas";
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
