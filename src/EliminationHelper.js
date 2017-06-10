/**
 * Created by Zack on 2017/6/9.
 */

var EliminationHelper = {
    _cArry: [],
    _disableP: {"i": -1, "j": -1}, // 不检测点
    _replaceP: {"i": -1, "j": -1}, // 检测代替点
    _directionP: [
        {"di": -1, "dj": 0}, // 下
        {"di": 1, "dj": 0},  // 上
        {"di": 0, "dj": 1},  // 右
        {"di": 0, "dj": -1}  // 左
    ],

    _reData: function () {
        this._setDisableP(-1, -1);
        this._setReplaceP(-1, -1);
        this._cArry = [];

    },
    // 递归检测
    _searchOther: function (i, j, v, map) {

        if ((map[i][j] != 0 && map[i][j] == v) || this._checkReplaceP(i, j)) {
            this._cArry.push({"i": i, "j": j});
            console.log("i: " + i + " j :" + j);
        } else {
            return;
        }

        if (i - 1 >= 0 && this._check(i - 1, j, map)) {
            this._searchOther(i - 1, j, v, map);
        }

        if (i + 1 < map.length && this._check(i + 1, j, map)) {
            this._searchOther(i + 1, j, v, map);
        }

        if (j - 1 >= 0 && this._check(i, j - 1, map)) {
            this._searchOther(i, j - 1, v, map);
        }

        if (j + 1 <= map[0].length && this._check(i, j + 1, map)) {
            this._searchOther(i, j + 1, v, map);
        }
    },
    _check: function (i, j, map) {
        return map[i][j] != 0 && !this._checkDisableP(i, j) && !this._checkArry(i, j);
    },

    _checkReplaceP: function (i, j) {
        if (this._replaceP.i == i && this._replaceP.j == j) {
            return true;
        }
        return false;
    },
    _checkDisableP: function (i, j) {
        if (this._disableP.i == i && this._disableP.j == j) {
            return true;
        }
        return false;
    },
    // 判断是否在数组中
    _checkArry: function (i, j) {
        for (var i = 0; i < this._cArry.length; i++) {
            var obj = this._cArry[i];
            if (obj.i == i && obj.j == j) {
                return true;
            }
        }
        return false;
    },
    // 获取消除的元素列表
    getEArry: function (i, j, v, map) {
        this._cArry = [];
        this._searchOther(i, j, v, map);
        return this._cArry;
    },
    //getEArryBool: function (i, j) {
    //    this._reData();
    //    this.getEArry(i, j);
    //    return this._cArry.length > 0;
    //},
    _setDisableP: function (i, j) {
        this._disableP.i = i;
        this._disableP.j = j;
    },
    _setReplaceP: function (i, j) {
        this._replaceP.i = i;
        this._replaceP.j = j;
    },

    // 判断是否有可消除
    haveElimination: function (map) {
        this._reData();
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[0].length; j++) {
                if (map[i][j] != 0 && this._moveSearch(i, j, map[i][j], map)) {
                    return true;
                }
            }
        }
        return false;
    },
    _moveSearch: function (i, j, v, map) {
        console.log("_moveSearch i: " + i + " j :" + j);
        this._setDisableP(i, j);
        for (var n = 0; n < this._directionP.length; n++) {
            var dp = this._directionP[n];
            var dpi = i + dp.di;
            var dpj = j + dp.dj;

            console.log("_moveSearch dpi: " + dpi + " dpj :" + dpj);
            if (!this._checkP(dpi, dpj, map)) {
                continue;
            }

            this._setReplaceP(dpi, dpj);
            this.getEArry(dpi, dpj, v, map);
            if (this._cArry.length >= 3) {
                // return true;
                console.log("dsdsd");
            }
        }

        return false;

    },
    _checkP: function (i, j, map) {
        if (i < 0 || i >= map.length) {
            return false
        }
        if (j < 0 || j >= map[0].length) {
            return false
        }
        return true;
    },
    // 判断数组是否是可三消
    _checkEArry: function (arry) {
        if (arry.length >= 6) {
            return true;
        }

        if (arry.length < 3) {
            return false;
        }


        return false;
    },
    // 放在 9 X 9格子中,横向和纵向判断
    _dealwithArry: function (arry,map) {
        var maxi = arry[0].i;
        var maxj = arry[0].j;
        for (var n = 1; n < arry.length; n++) {
            var obj = arry[n];
            if (obj.i > maxi) {
                maxi = obj.i;
            }

            if (obj.j > maxj) {
                maxj = obj.j;
            }
        }



    }

}