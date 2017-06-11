var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    mapSize: null,
    cubeSize: null,
    mapOriginP: null,
    touchBeganP: null,
    cubeArry: [], // 保存方块
    cubeMoveV: 250, // 块的下落速度
    ctor: function () {
        this._super();
        var size = cc.winSize;
        this.initData();
        this.initUI();
        this.addTouchListener();

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
                var label = cc.LabelTTF.create("" + Map[m][n], "Arial", 40);
                label.setColor(cc.color(0, 0, 0));
                label.setPosition(cc.p(this.cubeSize.width / 2, this.cubeSize.height / 2));

                cubeSp.addChild(label);
                cubeSp.setPositionX(this.mapOriginP.x + n * this.cubeSize.width);
                cubeSp.setPositionY(this.mapOriginP.y - m * this.cubeSize.height);
                this.addChild(cubeSp);

                if (Map[m][n] == 0) {
                    cubeSp.setVisible(false);
                }
                this.cubeArry.push(cubeSp);

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
    // 获取逻辑坐标
    getCubeLogicP: function (p) {
        var mapOriginP = cc.p(this.mapOriginP.x - this.cubeSize.width / 2, this.mapOriginP.y + this.cubeSize.height / 2);

        var dpx = p.x - mapOriginP.x;
        var dpy = mapOriginP.y - p.y;
        dpx = Math.floor(dpx / this.cubeSize.width);
        dpy = Math.floor(dpy / this.cubeSize.height);
        console.log("dpx " + dpx + " dpy " + dpy);

        if (dpx < 0 || dpy < 0) {
            return null;
        }
        if (dpx >= this.mapSize.width || dpy >= this.mapSize.height) {
            return null;
        }
        return cc.p(dpx, dpy);
    },
    // 点击事件
    addTouchListener: function () {

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        }, this);
    },
    onTouchBegan: function (touch, event) {
        cc.log("onTouchBegan");

        var tag = event.getCurrentTarget();
        tag.touchBeganP = touch.getLocation();
        //tag.touchBeganP = tag.getCubeLogicP(pos);

        return true;
    },
    onTouchMoved: function (touch, event) {
        // cc.log("onTouchMoved");
        var tag = event.getCurrentTarget();
        var pos = touch.getLocation();

    },
    onTouchEnded: function (touch, event) {
        var tag = event.getCurrentTarget();
        var pos = touch.getLocation();
        if (!tag.touchBeganP) {
            return;
        }
        if (Math.abs(tag.touchBeganP.x - pos.x) >= tag.cubeSize.width / 2 || Math.abs(tag.touchBeganP.y - pos.y) >= tag.cubeSize.height / 2) {
            tag.dealSwapCube(pos);
        }
    },
    onTouchCancelled: function (touch, event) {
        var tag = event.getCurrentTarget();

    },
    dealSwapCube: function (endP) {
        var startP = this.touchBeganP;

        if (!startP) {
            return;
        }
        var logicP = this.getCubeLogicP(startP);

        if (!logicP) {
            return;
        }
        var dx = endP.x - startP.x;
        var dy = endP.y - startP.y;

        var dP = null;
        // 横向
        if (Math.abs(dx) > Math.abs(dy)) {
            //右
            if (dx > 0) {
                dP = cc.p(1, 0);
            } else {
                dP = cc.p(-1, 0);
            }
        } else {
            if (dy > 0) {
                dP = cc.p(0, -1);
            } else {
                dP = cc.p(0, 1);
            }
        }
        var swapP = cc.p(logicP.x + dP.x, logicP.y + dP.y);
        console.log("logicPx " + logicP.x + " logicPy " + logicP.y);
        console.log("swapPx " + swapP.x + " swapPy " + swapP.y);
        if (swapP && EliminateHelper.isEnableP(swapP)) {
            this.swapCube(logicP, swapP);
        }
    },
    swapCube: function (startP, endP) {

        // 先交换
        EliminateHelper.swapCube(startP, endP);
        // 没有可消除的，则换回来
        if (!EliminateHelper.isEliminate(endP)) {
            console.log("no eliminate");
            EliminateHelper.swapCube(startP, endP);
            return;
        }
        var cube1 = this.getCubeSpByP(startP);
        var cube2 = this.getCubeSpByP(endP);

        var cube1P = cube1.getPosition();
        var cube2P = cube2.getPosition();

        cube1.runAction(cc.moveTo(0.5, cube2P));
        cube2.runAction(cc.sequence(
            cc.moveTo(0.5, cube1P),
            cc.callFunc(function () {
                this.eliminateCube(endP);
            }, this)));

        this.swapCubeObject(startP, endP);
    },
    // 获取移动时间
    getMoveTime: function (logicP1, logicP2) {
        var p1 = this.getScreenP(logicP1);
        var p2 = this.getScreenP(logicP2);
        var time = Math.abs((p1.y - p2.y) / this.cubeMoveV);
        return time;
    },
    getCubeSpByP: function (p) {
        return this.cubeArry[p.x + p.y * this.mapSize.width];
    },
    setCubeSpByP: function (p, cube) {
        this.cubeArry[p.x + p.y * this.mapSize.width] = cube;
    },
    getScreenP: function (logicP) {
        var px = this.mapOriginP.x + logicP.x * this.cubeSize.width;
        var py = this.mapOriginP.y - logicP.y * this.cubeSize.height;
        return cc.p(px, py);
    },
    swapCubeObject: function (logicP1, logicP2) {
        var cube1 = this.getCubeSpByP(logicP1);
        var cube2 = this.getCubeSpByP(logicP2);

        this.setCubeSpByP(logicP1, cube2);
        this.setCubeSpByP(logicP2, cube1);
    },
    // 消除
    eliminateCube: function (p) {
        var cubeArry = EliminateHelper.getElArry(p);

        if (cubeArry.length >= 3) {
            for (var i = 0; i < cubeArry.length; i++) {
                var objP = cubeArry[i];
                var cube = this.getCubeSpByP(objP);
                cube.setVisible(false);
            }
        }
        //   EliminateHelper.debugLog();
        var mdArry = EliminateHelper.moveDownCube();
        // console.log("cubeArry.length " + cubeArry.length + " mdArry.length " + mdArry.length + " p.x " + p.x + " p.y " + p.y);
        for (var i = 0; i < mdArry.length; i++) {
            var obj = mdArry[i];
            // 交换位置
            var cube = this.getCubeSpByP(obj.beganP);
            cube.stopAllActions();
            cube.setPosition(this.getScreenP(obj.beganP));
            this.swapCubeObject(obj.beganP, obj.endP);
            cube.runAction(cc.sequence(
                cc.moveTo(this.getMoveTime(obj.beganP, obj.endP), this.getScreenP(obj.endP)),
                cc.callFunc(function (target, data) {
                    // 递归检测
                    this.eliminateCube(data);
                }, this, obj.endP)));
        }
        // EliminateHelper.debugLog();

    }
});


var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

