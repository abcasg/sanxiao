/**
 * Created by Zack on 2017/6/9.
 */

var EliminateHelper = {
    _replaceP: {"i": -1, "j": -1}, // 检测代替点
    _directionP: [
        cc.p(0, -1), // 上
        cc.p(0, 1),  // 下
        cc.p(1, 0),  // 右
        cc.p(-1, 0)  // 左
    ],
    _dType: [
        "Up", // 上
        "Down",  // 下
        "Right",  // 右
        "Left"  // 左
    ],
    _directionOblP: [
        cc.p(-1, -1), // 上左
        cc.p(-1, 1),  // 下左
        cc.p(1, -1),  // 上右
        cc.p(1, 1)    // 下右
    ],
    _dOblType: [
        "UpLeft",   // 上左
        "DownLeft", // 下左
        "UpRight", // 上右
        "DownRight"  // 下右
    ],
    _directionDP: [
        [cc.p(0, -1), cc.p(0, -2)],  // 上
        [cc.p(0, 1), cc.p(0, 2)],  // 下
        [cc.p(1, 0), cc.p(2, 0)],  // 右
        [cc.p(-1, 0), cc.p(-2, 0)],  // 左

    ],
    _map: Map,
    _disablePointV: [], // 不可用的点
    _disableValueV: [0], // 不可用的值
    _emptyType: 0,
    _eliminateType: {"None": -1, "El3": 0, "El4h": 1, "El4s": 1, "ElTian": 2, "ElL": 3, "ElT": 4, "El5": 5}, // 消除类型 //直线5消>T字消>L字消>田字消>直线4消>3消
    // 获取消除的数组
    getElArry: function (p) {
        var cubeArry = [];
        var value = this._map[p.y][p.x];
        if (this._emptyType == value) {
            return cubeArry;
        }
        if (this.isEliminate(p)) {
            this._searchEnableCube(p, value, cubeArry);
        }
        // 获取最大长度的数组，解决下落问题
        var maxLArry = [];
        for (var i = 0; i < cubeArry.length; i++) {
            var arryItem = [];
            if (this.isEliminate(p)) {
                this._searchEnableCube(p, value, arryItem);
            }
            if (arryItem.length > maxLArry.length) {
                maxLArry = arryItem;
            }
        }
        if (maxLArry.length > cubeArry.length) {
            cubeArry = maxLArry;
        }
        this.setMapEmptyCube(cubeArry);

        return cubeArry;
    },
    // 创建下落的方块
    createDownCube: function () {
        var map = this._map;
        var mdArry = [];
        for (var n = 0; n < map[0].length; n++) {
            var arry = [];
            for (var m = map.length - 1; m >= 0; m--) {
                if (map[m][n] == this._emptyType) {
                    map[m][n] = this.getRandNum(1, 5);
                    //map[m][n] = 4;
                    arry.push(cc.p(n, m));
                }
            }
            mdArry.push(arry);
        }
        return mdArry;
    },
    // 下落方块
    moveDownCube: function () {
        var map = this._map;
        var mdArry = [];
        for (var n = 0; n < map[0].length; n++) {
            for (var m = map.length - 1; m >= 0; m--) {
                if (map[m][n] == this._emptyType) {
                    var cObj = this._searchDownCube(cc.p(n, m));
                    if (cObj) {
                        mdArry.push(cObj);
                    }
                }
            }
        }
        return mdArry;
    },
    _searchDownCube: function (p) {
        var map = this._map;
        var cObj = null;
        var nextP = p;
        while (true) {
            nextP = cc.p(nextP.x, nextP.y - 1);
            if (!this._checkP(nextP)) {
                break;
            }
            if (map[nextP.y][nextP.x] != this._emptyType) {
                cObj = {"beganP": nextP, "endP": p};
                this._swapPValue(nextP, p);
                break;
            }
        }
        return cObj;
    },
    setMapEmptyCube: function (cubeArry) {
        for (var i = 0; i < cubeArry.length; i++) {
            var objP = cubeArry[i];
            this._map[objP.y][objP.x] = this._emptyType;
        }
    },
    _searchEnableCube: function (p, value, cArry) {
        if (!this._checkP(p)) {
            return;
        }
        if (value != this._map[p.y][p.x]) {
            return;
        }
        if (this._isInArry(p, cArry)) {
            return;
        }
        if (!this._checkNearCube(p)) {
            return;
        }
        cArry.push(p);
        //console.log("px " + p.x + " py " + p.y);
        for (var i = 0; i < this._directionP.length; i++) {
            var objP = this._directionP[i];
            var nextP = cc.p(p.x + objP.x, p.y + objP.y);
            this._searchEnableCube(nextP, value, cArry);
        }
    },
    // 检测是否是相邻可用点
    _checkNearCube: function (p) {
        var near1Dobj = this._getNear(p, 1);
        var near2Dobj = this._getNear(p, 2);
        var near1OblDobj = this._getNearOblique(p, 1);
        return this._isEffectLine(near1Dobj, near2Dobj) || this._isEffectTian(near1Dobj, near1OblDobj);
    },
    _searchEArry: function (p, dp, value, cArry, findN) {
        if (findN && cArry.length >= findN) {
            return;
        }

        if (!this._checkP(p)) {
            return;
        }
        if (value == this._map[p.y][p.x]) {
            cArry.push(p);
        } else {
            return;
        }
        var nextP = cc.p(p.x + dp.x, p.y + dp.y);
        this._searchEArry(nextP, dp, value, cArry, findN);
    },

    // 是否有可消除
    haveEliminate: function () {
        var map = this._map;
        for (var m = 0; m < map.length; m++) {
            for (var n = 0; n < map[0].length; n++) {
                if (!this._checkDisableValue(cc.p(n, m)) && this._moveSearch(m, n)) {
                    return true;
                }
            }
        }
        return false;
    },
    _moveSearch: function (i, j) {
        console.log("i " + i + " j " + j);
        var cP = cc.p(j, i);

        for (var n = 0; n < this._directionP.length; n++) {
            var dPoint = this._directionP[n];
            if (this._checkP(dPoint)) {
                // 先交换值
                this._swapPValue(dPoint, cP);
                var elFlag = this.isEliminate(dPoint);
                this._swapPValue(dPoint, cP);

                if (elFlag) {
                    return true;
                }
            }
        }

        return false;
    },
    // 可消除
    isEliminate: function (p) {
        return this._isEliminateType(p);
    },
    _isEliminateType: function (p) {
        var eliType = this._getEliType(p);
        if (eliType >= 0) {
            console.log("eliType : " + eliType);
            return true;
        }
        return false;
    },
    _getEliType: function (p) {

        //直线5消>T字消>L字消>田字消>直线4消
        var value = this._map[p.y][p.x];

        var near1Dobj = this._getNear(p, 1);
        var near2Dobj = this._getNear(p, 2);
        var near1OblDobj = this._getNearOblique(p, 1);

        if (this._isEffectRainbow(p, value)) {
            return this._eliminateType.El5;
        }
        if (this._isEffectT(near1Dobj, near2Dobj)) {
            return this._eliminateType.ElT;
        }
        if (this._isEffectL(near1Dobj, near2Dobj)) {
            return this._eliminateType.ElL;
        }
        if (this._isEffectTian(near1Dobj, near1OblDobj)) {
            return this._eliminateType.ElTian;
        }
        var effectLineType = this._isEffectLine(near1Dobj, near2Dobj);
        if (effectLineType && effectLineType >= 0) {
            return effectLineType;
        }
        return this._eliminateType.None;
    },
    _isEffectRainbow: function (p, value) {
        // 直线5消
        var dObj = {};
        // 找到四个方向的长度
        for (var i = 0; i < this._directionP.length; i++) {
            var arry = [];
            var objP = this._directionP[i];
            this._searchEArry(cc.p(p.x + objP.x, p.y + objP.y), objP, value, arry, null);
            dObj[this._dType[i]] = arry.length;
        }
        // 竖
        if (dObj.Up + dObj.Down + 1 >= 5) {
            return true;
        }
        // 横
        if (dObj.Left + dObj.Right + 1 >= 5) {
            return true;
        }
        return false;
    },
    _isEffectT: function (near1Dobj, near2Dobj) {
        // 上下T
        if (near1Dobj.Left && near1Dobj.Right) {
            if (near2Dobj.Up || near2Dobj.Down) {
                return true;
            }
        }
        // 左右T
        if (near1Dobj.Up && near1Dobj.Down) {
            if (near2Dobj.Left || near2Dobj.Right) {
                return true;
            }
        }
        return false;

    },
    _isEffectL: function (near1Dobj, near2Dobj) {
        if (near1Dobj.Left && near2Dobj.Up) {
            return true;
        }
        if (near1Dobj.Right && near2Dobj.Up) {
            return true;
        }
        if (near1Dobj.Left && near2Dobj.Down) {
            return true;
        }
        if (near1Dobj.Right && near2Dobj.Down) {
            return true;
        }
        return false;
    },
    _isEffectTian: function (near1Dobj, near1OblDobj) {
        if (near1Dobj.Up && near1Dobj.Left && near1OblDobj.UpLeft) {
            return true;
        }
        if (near1Dobj.Up && near1Dobj.Right && near1OblDobj.UpRight) {
            return true;
        }
        if (near1Dobj.Down && near1Dobj.Left && near1OblDobj.DownLeft) {
            return true;
        }
        if (near1Dobj.Down && near1Dobj.Right && near1OblDobj.DownRight) {
            return true;
        }
        return false;
    },
    _isEffectLine: function (near1Dobj, near2Dobj) {
        // 横
        if ((near1Dobj.Left && near1Dobj.Right) || near2Dobj.Left || near2Dobj.Right) {
            return this._eliminateType.El4h;
        }
        // 竖
        if ((near1Dobj.Up && near1Dobj.Down) || near2Dobj.Up || near2Dobj.Down) {
            return this._eliminateType.El4s;
        }
        return null;
    },
    _getNear: function (p, nearN) {
        var value = this._map[p.y][p.x]

        // 上下右左
        var dObj = {};
        for (var i = 0; i < this._directionP.length; i++) {
            var arry = [];
            var objP = this._directionP[i];
            this._searchEArry(cc.p(p.x + objP.x, p.y + objP.y), objP, value, arry, nearN);
            if (nearN == arry.length) {
                dObj[this._dType[i]] = true;
            }
        }
        return dObj;
    },
    _isInArry: function (p, arry) {
        for (var i = 0; i < arry.length; i++) {
            var objP = arry[i];
            if (p.x == objP.x && p.y == objP.y) {
                return true;
            }
        }
        return false;
    },
    _getNearOblique: function (p, nearN) {
        var value = this._map[p.y][p.x]
        // 上左 // 下左// 上右 // 下右
        var dObj = {};
        for (var i = 0; i < this._directionOblP.length; i++) {
            var arry = [];
            var objP = this._directionOblP[i];
            this._searchEArry(cc.p(p.x + objP.x, p.y + objP.y), objP, value, arry, nearN);
            if (nearN == arry.length) {
                dObj[this._dOblType[i]] = true;
            }
        }
        return dObj;
    },

    // 不重复添加到数组
    pushArryUnique: function (carry, p) {
        for (var i = 0; i < carry.length; i++) {
            var objP = carry[i];
            if (this._compareP(objP, p)) {
                return;
            }
        }
        carry.push(p);
    },
    _swapPValue: function (p1, p2) {
        var map = this._map;
        var p1Value = map[p1.y][p1.x];
        map[p1.y][p1.x] = map[p2.y][p2.x];
        map[p2.y][p2.x] = p1Value;
    },
    _compareP: function (p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y) {
            return true;
        }
        return false;
    },
    _compareMapValue: function (p1, p2) {
        var map = this._map;
        if (map[p1.y][p1.x] == map[p2.y][p2.x]) {
            return true;
        }
        return false;
    },
    isEnableP: function (p) {
        if (this._map[p.y][p.x] == this._emptyType) {
            return false;
        }
        return this._checkP(p);
    },
    _checkP: function (p) {
        var i = p.y;
        var j = p.x;

        if (i < 0 || i >= this._map.length) {
            return false
        }
        if (j < 0 || j >= this._map[0].length) {
            return false
        }
        return true;
    },
    _checkDisablePoint: function (p) {
        for (var n = 0; n < this._disablePointV.length; n++) {
            var obj = this._disablePointV[n];
            if (this._compareP(obj, p)) {
                return true;
            }
        }

        return false;
    },
    _checkDisableValue: function (p) {
        for (var n = 0; n < this._disableValueV.length; n++) {
            var obj = this._disableValueV[n];
            if (this._map[p.y][p.x] == obj) {
                return true;
            }
        }

        return false;
    },
    // 生成随机地图
    createRandMap: function () {
        this.clearMap();
        for (var m = 0; m < this._map.length; m++) {
            for (var n = 0; n < this._map[0].length; n++) {
                while (true) {
                    var randnum = this.getRandNum(1, 5);
                    this._map[m][n] = randnum;
                    //this._map[m][n] = 4;
                    if (!this.isEliminate(cc.p(n, m))) {
                        break;
                    }
                }
            }
        }
    },
    clearMap: function () {
        for (var m = 0; m < this._map.length; m++) {
            for (var n = 0; n < this._map[0].length; n++) {
                this._map[m][n] = 0;
            }
        }
    },
    getRandNum: function (min, max) {
        var randnum = Math.random() * max + min;
        var num = Math.floor(randnum);
        return num;
    },
    swapCube: function (p1, p2) {
        if (!(this.isEnableP(p1) && this.isEnableP(p2))) {
            return;
        }
        var value = this._map[p1.y][p1.x];
        this._map[p1.y][p1.x] = this._map[p2.y][p2.x];
        this._map[p2.y][p2.x] = value;
    },
    debugLog: function () {
        //var map = this._map;
        //cc.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        //for (var m = 0; m < this._map.length; m++) {
        //    var str = "[ ";
        //    for (var n = 0; n < this._map[0].length; n++) {
        //        str = str + map[m][n] + " , ";
        //    }
        //    console.log(str + "],");
        //}
    }
}