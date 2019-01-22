<template>
    <div>
        <i class="iconfont icon-rotate gyroscope" @click="detail">
            <div v-show="isShowDetail" class="detail">
                <div class="simpleicon" @click="direction($event,'Top')">
                    Top
                </div>
                <div class="simpleicon" @click="direction($event,'Bottom')">
                    Bottom
                </div>
                <div class="simpleicon" @click="direction($event,'Left')">
                    left
                </div>
                <div class="simpleicon" @click="direction($event,'Right')">
                    right
                </div>
                <div class="simpleicon" @click="direction($event,'Front')">
                    front
                </div>
                <div class="simpleicon"  @click="direction($event,'Back')">
                    back
                </div>
                <div class="simpleicon" @click="direction($event,'Iso')">
                    iso
                </div>
                <div class="simpleicon" @click="direction($event,'RightIso')">
                    rightiso
                </div>
            </div>
        </i>
    </div>
</template>

<script>
import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import { Transform } from "@bentley/geometry-core/lib/geometry-core";
export default {
    name: 'gyroscope',
    data () {
        return {
            isShowDetail:false
        };
    },
    components: {
        
    },
    created () {},
    methods: {
        detail() {
            this.isShowDetail = true;
        },
        direction (e,dir) {
            // this.GLOBAL_DATA.theViewPort;
            let theViewport = this.GLOBAL_DATA.theViewPort;
            e.stopPropagation();
            this.isShowDetail = false;
            if (undefined === theViewport)
            return;

            let  rotationId = frontend_1.StandardViewId[dir];

            if (frontend_1.StandardViewId.Top !== rotationId && !theViewport.view.allow3dManipulations())
                return;

            const rMatrix = frontend_1.AccuDraw.getStandardRotation(rotationId, theViewport, theViewport.isContextRotationRequired);
            const inverse = rMatrix.inverse();
            if (undefined === inverse)
                return;

            const targetMatrix = inverse.multiplyMatrixMatrix(theViewport.rotation);
            const rotateTransform = Transform.createFixedPointAndMatrix(theViewport.view.getTargetPoint(), targetMatrix);
            const startFrustum = theViewport.getFrustum();
            const newFrustum = startFrustum.clone();
            newFrustum.multiply(rotateTransform);

            theViewport.animateFrustumChange(startFrustum, newFrustum);
            theViewport.view.setupFromFrustum(newFrustum);
            theViewport.synchWithView(true);
            
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.gyroscope{
    position: relative;
    .detail{
        position: absolute;
        width: 200px;
        padding-left: 3px;
        padding-top: 3px;
        z-index: 999;
        top: 45px;
        left: -1px;
        border-color: gray;
        border-style: solid;
        border-width: 1px;
        background-color: #fff;
        .simpleicon{
            float: left;
            position: relative;
            background-color: #E9F2F9;
            border-color: gray;
            border-style: solid;
            border-width: 1px;
            padding-left: 3px;
            padding-right: 3px;
            padding-top: 3px;
            padding-bottom: 3px;
            margin-left: 3px;
            margin-top: 3px;
            margin-right: 3px;
            margin-bottom: 3px;
            width: 35px;
            height: 35px;
            cursor: pointer;
           font-size: 12px;
        }
    }
}
</style>