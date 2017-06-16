/**
 * Created by Zack on 2017/6/16.
 */
var Tool = {

    initAnimation: function () {
        var animFrames = [];
        // 爆炸
        var jcxSize = cc.size(113, 112);
        for (var j = 0; j < 4; j++) {
            var frame = new cc.SpriteFrame(res.jcx_png, cc.rect(j * jcxSize.width, 0, jcxSize.width, jcxSize.height));
            animFrames.push(frame);
        }
        for (var j = 0; j < 4; j++) {
            var frame = new cc.SpriteFrame(res.jcx_png, cc.rect(j * jcxSize.width, jcxSize.height, jcxSize.width, jcxSize.height));
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.05);
        cc.animationCache.addAnimation(animation, "jcx");

        // 猎豹
        animFrames = [];
        var leoSize = cc.size(160, 191);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 5; j++) {
                var frame = new cc.SpriteFrame(res.leo_png, cc.rect(j * leoSize.width, (i + 0) * leoSize.height, leoSize.width, leoSize.height));
                animFrames.push(frame);
            }
        }

        var animation = new cc.Animation(animFrames, 0.1);
        cc.animationCache.addAnimation(animation, "leo");
    },
    getAnimateByName: function (sName) {
        var animate = cc.animate(cc.animationCache.getAnimation(sName));
        return animate;

    },

}
