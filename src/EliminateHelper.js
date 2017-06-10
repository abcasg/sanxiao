/**
 * Created by Zack on 2017/6/9.
 */

var EliminateHelper = {
    _cArry: [],
    _disableP: {"i": -1, "j": -1}, // 不检测点
    _replaceP: {"i": -1, "j": -1}, // 检测代替点
    _directionP: [
        {"di": -1, "dj": 0}, // 下
        {"di": 1, "dj": 0},  // 上
        {"di": 0, "dj": 1},  // 右
        {"di": 0, "dj": -1}  // 左
    ],
    _directionDP: [
        [{"di": 0, "dj": -1}, {"di": 0, "dj": -2}],  // 左
        [{"di": 0, "dj": 1}, {"di": 0, "dj": 2}],  // 右
        [{"di": -1, "dj": 0}, {"di": -2, "dj": 0}],  // 上
        [{"di": 1, "dj": 0}, {"di": 2, "dj": 0}]  // 下
    ],
    _map: Map,
    _disablePointV: [], // 不可用的点
    _disableValueV: [0], // 不可用的值
    _ignorePoint: cc.p(-1, -1), // 忽略点
    _reData: function () {
        this._setDisableP(-1, -1);
        this._setReplaceP(-1, -1);
        this._cArry = [];
        this._disablePointV = [];
        this._disableValueV = [0];

    },
    // 获取消除的数组
    getElArry: function (p) {
        var j = p.x;
        var i = p.y;

        var cArry = [];
        if (this.isEliminate(cc.p(j, i))) {
            cArry.push(cc.p(j, i))
            var value = this._map[i][j];

            for (var n = 0; n < this._directionP.length; n++) {
                var dp = this._directionP[n];
                var dPoint = cc.p(j + dp.dj, i + dp.di);
                var offsetP = cc.p(dp.dj, dp.di);
                this._searchEArry(dPoint, offsetP, value, cArry);
            }
        }
        return cArry;
    },
    _searchEArry: function (p, dp, value, cArry) {
        if (!this._checkP(p)) {
            return;
        }
        if (value == this._map[p.y][p.x]) {
            cArry.push(p);
        }
        var nextP = cc.p(p.x + dp.x, p.y + dp.y);
        this._searchEArry(nextP, dp, value, cArry);
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
        //this._ignorePoint = cc.p(j, i);
        var cP = cc.p(j, i);

        for (var n = 0; n < this._directionP.length; n++) {
            var dp = this._directionP[n];
            var dPoint = cc.p(j + dp.dj, i + dp.di);
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
        var j = p.x;
        var i = p.y;
        var map = this._map;
        var cP = cc.p(j, i);

        // 比较上下左右 两个点的值
        for (var m = 0; m < this._directionDP.length; m++) {
            var objP = this._directionDP[m];
            var objP0 = cc.p(objP[0].dj + j, objP[0].di + i);
            var objP1 = cc.p(objP[1].dj + j, objP[1].di + i);

            // 不在忽略点
            if (this._compareP(objP0, this._ignorePoint) || this._compareP(objP1, this._ignorePoint)) {
                continue;
            }
            // map[i + objP0.di][j + objP0.dj]
            if (this._checkP(objP0) && this._checkP(objP1)) {
                if (this._compareMapValue(cP, objP0) && this._compareMapValue(cP, objP1)) {
                    return true;
                    break;
                }
            }
        }

        // 比较中心十字点的值
        // 左右
        var pLeft = cc.p(cP.x - 1, cP.y);
        var pRight = cc.p(cP.x + 1, cP.y);
        if (!(this._compareP(pLeft, this._ignorePoint) || this._compareP(pRight, this._ignorePoint))) {
            if (this._checkP(pLeft) && this._checkP(pRight)) {
                if (this._compareMapValue(cP, pLeft) && this._compareMapValue(cP, pRight)) {
                    return true;
                }
            }
        }


        // 上下
        var pUp = cc.p(cP.x, cP.y - 1);
        var pDown = cc.p(cP.x, cP.y + 1);

        if (!(this._compareP(pUp, this._ignorePoint) || this._compareP(pDown, this._ignorePoint))) {
            if (this._checkP(pUp) && this._checkP(pDown)) {
                if (this._compareMapValue(cP, pUp) && this._compareMapValue(cP, pDown)) {
                    return true;
                }
            }
        }
        return false;
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
                while (true){
                    var randnum = this.getRandNum(1, 6);
                    this._map[m][n] = randnum;
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
    }

}