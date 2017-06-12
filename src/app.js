var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    mapSize: null,
    cubeSize: null,
    mapOriginP: null,
    touchBeganP: null,
    cubeArry: [], // 保存方块
    cubeMoveV: 450, // 块的下落速度
    swapCubeT: 0.4, // 交换速度
    isMoveFlag:false, // 动画运动中
    ctor: function () {
        this._super();
        this.initData();
        this.initUI();
        this.addTouchListener();
        return true;
    },
    initUI: function () {
        // 初始地图
        //EliminateHelper.createRandMap();

        for (var m = 0; m < this.mapSize.height; m++) {
            for (var n = 0; n < this.mapSize.width; n++) {
                var cubeSp = this.createCubeSp(Map[m][n]);
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
        //console.log("dpx " + dpx + " dpy " + dpy);

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
        //cc.log("onTouchBegan");
        var tag = event.getCurrentTarget();
        tag.touchBeganP = touch.getLocation();

        // 在运动中
        if(tag.isMoveFlag){
            tag.touchBeganP = null;
        }
        return true;
    },
    onTouchMoved: function (touch, event) {
        // cc.log("onTouchMoved");
        // var tag = event.getCurrentTarget();
        // var pos = touch.getLocation();

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
        // var tag = event.getCurrentTarget();
    },
    // 获取移动时间
    getMoveTime: function (logicP1, logicP2) {
        var p1 = this.getScreenP(logicP1);
        var p2 = this.getScreenP(logicP2);
        return this.getMoveTimeBS(p1, p2);
    },
    getMoveTimeBS: function (p1, p2) {
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
        //console.log("logicPx " + logicP.x + " logicPy " + logicP.y);
        //console.log("swapPx " + swapP.x + " swapPy " + swapP.y);
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

        var cube1P = this.getScreenP(startP);
        var cube2P = this.getScreenP(endP);

        cube1.stopAllActions();
        cube2.stopAllActions();

        this.isMoveFlag = true;
        cube1.runAction(cc.moveTo(this.swapCubeT, cube2P));
        cube2.runAction(cc.moveTo(this.swapCubeT, cube1P));
        this.swapCubeObject(startP, endP);

        this.scheduleOnce(function () {
            this.isMoveFlag = false;
            this.ecInterFace([startP, endP]);
        }, this.swapCubeT);


    },
    ecInterFace: function (arry) {
        if (arry.length < 1) {
            return;
        }
        EliminateHelper.debugLog();
        // 消除
        for (var i = 0; i < arry.length; i++) {
            this.eliminateCube(arry[i]);
        }
        // 下落 maxTime 下落最大时间
        var mdArry = EliminateHelper.moveDownCube();
        var mMaxTime = this.moveDownCube(mdArry);

        var cdArry = [];

        var nCallfun = function (target, data) {
            var arryV = [];
            // 下落的
            for (var i = 0; i < mdArry.length; i++) {
                arryV.push(mdArry[i].endP);
            }
            // 生成的
            for (var i = 0; i < cdArry.length; i++) {
                var arry = cdArry[i];
                for (var j = 0; j < arry.length; j++) {
                    arryV.push(arry[j]);
                }
            }
            this.isMoveFlag = false;
            this.ecInterFace(arryV);
        }.bind(this);

        // 创建下落方块
        var downCallfun = function (target, data) {
            cdArry = EliminateHelper.createDownCube();
            var cMaxTimeM = this.createDownCube(cdArry);
            this.scheduleOnce(nCallfun, cMaxTimeM);
        }.bind(this);

        this.isMoveFlag = true;
        this.scheduleOnce(downCallfun, mMaxTime);

    },
    // 消除
    eliminateCube: function (p) {
        var cubeArry = EliminateHelper.getElArry(p);
        if (cubeArry.length < 3) {
            return;
        }
        // EliminateHelper.debugLog();
        for (var i = 0; i < cubeArry.length; i++) {
            var objP = cubeArry[i];
            var cube = this.getCubeSpByP(objP);
            cube.setVisible(false);
            cube.removeFromParent();
        }


    },
    moveDownCube: function (mdArry) {
        //   EliminateHelper.debugLog();
        // 最大时间
        var maxTime = 0;

        //console.log("cubeArry.length " + cubeArry.length + " mdArry.length " + mdArry.length + " p.x " + p.x + " p.y " + p.y);
        for (var i = 0; i < mdArry.length; i++) {
            var obj = mdArry[i];
            var cube = this.getCubeSpByP(obj.beganP);
            cube.stopAllActions();
            cube.setPosition(this.getScreenP(obj.beganP));
            // 交换位置
            this.swapCubeObject(obj.beganP, obj.endP);
            //var endScP = this.getScreenP(obj.endP);
            var time = this.getMoveTime(obj.beganP, obj.endP);
            if (time > maxTime) {
                maxTime = time;
            }
            cube.runAction(cc.moveTo(time, this.getScreenP(obj.endP)));
        }
        //EliminateHelper.debugLog();
        return maxTime;
    },
    createDownCube: function (mdArry) {
        var maxTime = 0;
        // var mdArry = EliminateHelper.createDownCube();
        for (var i = 0; i < mdArry.length; i++) {
            var arry = mdArry[i];
            for (var j = 0; j < arry.length; j++) {
                var objP = arry[j];
                var cube = this.createCubeSp(Map[objP.y][objP.x]);
                this.setCubeSpByP(objP, cube);
                this.addChild(cube);
                var screenP = this.getScreenP(objP);
                var beganP = cc.p(screenP.x, this.mapOriginP.y + (arry.length - objP.y) * this.cubeSize.height);
                cube.setPosition(beganP);
                var time = this.getMoveTimeBS(screenP, beganP);
                if (time > maxTime) {
                    maxTime = time;
                }
                cube.stopAllActions();
                cube.runAction(cc.moveTo(time, screenP));

            }
        }
        return maxTime;
    },
    createCubeSp: function (index) {
        var cubeSp = new cc.Sprite(res["cube_png" + index]);
        var label = cc.LabelTTF.create("" + index, "Arial", 40);
        label.setColor(cc.color(0, 0, 0));
        label.setPosition(cc.p(this.cubeSize.width / 2, this.cubeSize.height / 2));
        cubeSp.addChild(label);

        return cubeSp;
    }

});


var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

