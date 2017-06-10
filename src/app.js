var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    mapSize: null,
    cubeSize: null,
    mapOriginP: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;
        this.initData();
        this.initUI();

        //var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        //helloLabel.x = size.width / 2;
        //helloLabel.y = size.height / 2 + 200;
        //// add the label as a child to this layer
        //this.addChild(helloLabel, 5);
        //
        //// add "HelloWorld" splash screen"
        //this.sprite = new cc.Sprite(res.cube_png1);
        //this.sprite.attr({
        //    x: size.width / 2,
        //    y: size.height / 2
        //});
        //this.addChild(this.sprite, 0);
        //
        //var label = cc.LabelTTF.create("Main Menu", "Arial", 20);
        //
        //if (EliminateHelper.haveEliminate()) {
        //    console.log("have");
        //} else {
        //    console.log("not have");
        //
        //}
        //
        //var carry = EliminateHelper.getElArry(cc.p(3, 4));
        //console.log("end");

        return true;
    },
    initUI: function () {
        // 初始地图
        EliminateHelper.createRandMap();

        for (var m = 0; m < this.mapSize.height; m++) {
            for (var n = 0; n < this.mapSize.width; n++) {
                var cubeSp = new cc.Sprite(res["cube_png" + Map[m][n]]);
                cubeSp.setPositionX(this.mapOriginP.x + n * this.cubeSize.width);
                cubeSp.setPositionY(this.mapOriginP.y - m * this.cubeSize.height);
                this.addChild(cubeSp);
            }
        }
    },
    initData: function () {
        var cubeSp = new cc.Sprite(res.cbue_png1);
        this.cubeSize = cc.size(71, 71);
        this.mapSize = cc.size(Map[0].length, Map.length);

        var centerP = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);

        var offsetP = cc.p(0, 0);
        if (this.mapSize.width % 2 == 0) {
            offsetP.x = 0.5;
        }
        if (this.mapSize.height % 2 == 0) {
            offsetP.y = 0.5;
        }


        var mapOriginPx = centerP.x - (this.mapSize.width / 2 - offsetP.x) * this.cubeSize.width;
        var mapOriginPy = centerP.y + (this.mapSize.height / 2 - offsetP.y) * this.cubeSize.height;

        this.mapOriginP = cc.p(mapOriginPx, mapOriginPy);

    },
});


var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

