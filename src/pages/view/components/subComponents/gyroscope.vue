<template>
    <div>
        <i class="iconfont icon-rotate icon-lifangti" @click="detail">
            <div v-show="isShowDetail" class="detail">
                <div class="simpleicon" @click="direction($event,'Top')">
                     <i class="iconfont bim-icon-viewtop"></i>
                </div>
                <div class="simpleicon" @click="direction($event,'Bottom')">
                    <i class="iconfont bim-icon-viewbottom"></i>
                </div>
                <div class="simpleicon" @click="direction($event,'Left')">
                    <i class="iconfont bim-icon-viewleft"></i>
                </div>
                <div class="simpleicon" @click="direction($event,'Right')">
                    <i class="iconfont bim-icon-viewright"></i>
                </div>
                <div class="simpleicon" @click="direction($event,'Front')">
                    <i class="iconfont bim-icon-viewfront"></i>
                </div>
                <div class="simpleicon"  @click="direction($event,'Back')">
                    <i class="iconfont bim-icon-viewback"></i>
                </div>
                <div class="simpleicon" @click="direction($event,'Iso')">
                    <i class="iconfont bim-icon-viewisoleft"></i>
                    
                </div>
                <div class="simpleicon" @click="direction($event,'RightIso')">
                    <i class="iconfont bim-icon-viewisoright"></i>
                </div>
            </div>
        </i>
    </div>
</template>

<script>
//import * as frontend_1 from "@bentley/imodeljs-frontend/lib/frontend"
import { StandardViewId, AccuDraw,IModelApp } from '@bentley/imodeljs-frontend';
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
            this.isShowDetail = !this.isShowDetail;
        },
        direction (e,dir) {
            let theViewport = IModelApp.viewManager.selectedView;
            e.stopPropagation();
            this.isShowDetail = false;
            if (undefined === theViewport)
            return;

            let  rotationId = StandardViewId[dir];

            if (StandardViewId.Top !== rotationId && !theViewport.view.allow3dManipulations())
                return;

            const rMatrix = AccuDraw.getStandardRotation(rotationId, theViewport, theViewport.isContextRotationRequired);
            const inverse = rMatrix.inverse();
            if (undefined === inverse)
                return;

            const targetMatrix = inverse.multiplyMatrixMatrix(theViewport.rotation);
            const rotateTransform = Transform.createFixedPointAndMatrix(theViewport.view.getTargetPoint(), targetMatrix);
            const startFrustum = theViewport.getFrustum();
            const newFrustum = startFrustum.clone();
            newFrustum.multiply(rotateTransform);

            theViewport.animateFrustumChange(startFrustum, newFrustum,{});
            theViewport.view.setupFromFrustum(newFrustum);
            theViewport.synchWithView(true);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.icon-lifangti{
    position: relative;
    .detail{
        position: absolute;
        width: 200px;
        padding-left: 3px;
        padding-top: 3px;
        z-index: 999;
        top: 38px;
        left: -1px;
        border-color: gray;
        border-style: solid;
        border-width: 1px;
        background-color: #fff;
        .simpleicon{
            float: left;
            position: relative;
            background-color: #E9F2F9;
            padding-left: 4px;
            padding-right: 3px;
            padding-top: 4px;
            padding-bottom: 3px;
            margin-left: 3px;
            margin-top: 3px;
            margin-right: 3px;
            margin-bottom: 4px;
            width: 35px;
            height: 35px;
            cursor: pointer;
            font-size: 12px;
           i{
               margin-left: -5px;
               font-family: 'Bentley-Cesium-Web-Viewer-Icons' !important;
           }
           &:hover{
                color: #409EFF !important;
                // border:1px solid #409EFF !important
           }
        }
    }
}

</style>