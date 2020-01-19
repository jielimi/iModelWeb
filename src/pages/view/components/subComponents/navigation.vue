<template>
    <div>
        <i class="iconfont icon-iosredooutline" @click="turnRight"></i>
        <div class="nav">
            <div class="direction up" @click="changeDirection('up')"></div>
            <div class="direction down" @click="changeDirection('down')"></div>
            <div class="direction left" @click="changeDirection('left')"></div>
            <div class="direction right" @click="changeDirection('right')"></div>
            <div id=navigation>
                <div id="a" @mousedown="down($event)" >
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { IModelApp,ToolSettings } from "@bentley/imodeljs-frontend";
import {Matrix3d,Vector3d,Angle,Transform,Vector2d,AxisIndex} from "@bentley/geometry-core";
import {NpcCenter} from "@bentley/imodeljs-common"
export default {
    name: 'navigation',
    data () {
        return {
            endRotMatrix: Matrix3d.createIdentity(),
            _lastTargetPoint:undefined,
            x:0,
            y:0,
            mousedown:false,
            _lastClientXY:Vector2d.createZero(),
            _start:Vector2d.createZero()
        };
    },
    components: {
        
    },
    created () {
    },
    methods: {
        down(ev){
            ev.preventDefault()
            this.x=ev.clientX;        //获取当前鼠标的位置
            this.y=ev.clientY;
            this.mousedown = true;

            window.addEventListener("mousemove", this.move, false);
            window.addEventListener("mouseup", this.up, false);

            this._lastClientXY = Vector2d.create(ev.clientX, ev.clientY);
            this._start = this._lastClientXY;
        },
        move(ev){
            // if(!this.mousedown) return;
            let x1=ev.clientX-this.x 
            let y1=ev.clientY-this.y
            let a = document.getElementById("a")
　　　　　　　　　　　　　　　　　　　
            a.style.transform="perspective(1000px) rotateY("+ x1 +"deg) rotateX("+ -(y1) +"deg)";

            const mousePos = Vector2d.create(ev.clientX, ev.clientY);
            this._processDrag(mousePos);
        },
        up(ev){
        //    this.mousedown = false;
           window.removeEventListener("mousemove", this.move);
           window.removeEventListener("mouseup", this.up);
        },
        _processDrag(mousePos){
            if (!this._start.isAlmostEqual(mousePos)) {
                const movement = mousePos.minus(this._lastClientXY);
                
                const diff = movement.scale(0.05);
                const yaw = Angle.createRadians(diff.x);
                const pitch = Angle.createRadians(diff.y);
                const matX = Matrix3d.createRotationAroundAxisIndex(AxisIndex.X, pitch);
                const matZ = Matrix3d.createRotationAroundAxisIndex(AxisIndex.Z, yaw);
                const mat = matX.multiplyMatrixMatrix(this.endRotMatrix).multiplyMatrixMatrix(matZ);
                
                this.setRotation(mat)
            }
            this._lastClientXY = mousePos;
           
        },
        setRotation(newRotation){
            let vp = IModelApp.viewManager.selectedView;
            if (vp.rotation !== newRotation) {
                const inverse = newRotation.transpose();
                const center = this._getRotatePoint(vp);
                const targetMatrix = inverse.multiplyMatrixMatrix(vp.view.getRotation());
                const worldTransform = Transform.createFixedPointAndMatrix(center, targetMatrix);
                const frustum = vp.getWorldFrustum();
                frustum.multiply(worldTransform);
                vp.view.setupFromFrustum(frustum);
                vp.synchWithView(true);
                this.endRotMatrix = newRotation;
            }
        },
        changeDirection(arrow){
            const localRotationAxis = Vector3d.create(0, 0, 0);
            switch (arrow) {
                case 'up':
                    localRotationAxis.x = -1.0;
                    break;
                case 'down':
                    localRotationAxis.x = 1.0;
                    break;
                case 'left':
                    localRotationAxis.y = -1.0;
                    break;
                default:
                    localRotationAxis.y = 1.0;
                    break;
            }

            const localRotation = Matrix3d.createRotationAroundVector(localRotationAxis, Angle.createDegrees(-90));
            const newRotation = localRotation.multiplyMatrixMatrix(this.endRotMatrix);

            if (this.endRotMatrix.isAlmostEqual(newRotation)){
                return;
            }
            let vp = IModelApp.viewManager.selectedView;
            if (vp.rotation !== newRotation) {
                const inverse = newRotation.transpose();
                const center = this._getRotatePoint(vp);
                const targetMatrix = inverse.multiplyMatrixMatrix(vp.view.getRotation());
                const worldTransform = Transform.createFixedPointAndMatrix(center, targetMatrix);
                const frustum = vp.getWorldFrustum();
                const startFrustum = vp.getWorldFrustum();
                frustum.multiply(worldTransform);
                vp.animateFrustumChange(startFrustum, frustum,{});
                vp.view.setupFromFrustum(frustum);
                vp.synchWithView(true);
                this.endRotMatrix = newRotation;
            }
        },
        _getRotatePoint(vp){
                if (undefined !== vp.viewCmdTargetCenter) {
                const testPt = vp.worldToView(vp.viewCmdTargetCenter);
                const viewRect = vp.viewRect;
                if (viewRect.containsPoint(testPt))
                    return vp.viewCmdTargetCenter;
                vp.viewCmdTargetCenter = undefined;
            }
            if (undefined !== this._lastTargetPoint) {
                const testPt = vp.worldToView(this._lastTargetPoint);
                const viewRect = vp.viewRect.clone();
                viewRect.scaleAboutCenter(0.25, 0.25);
                // istanbul ignore next hard to reach because of mocks
                if (viewRect.containsPoint(testPt))
                    return this._lastTargetPoint;
                this._lastTargetPoint = undefined;
            }

            const visiblePoint = vp.pickNearestVisibleGeometry(vp.npcToWorld(NpcCenter), vp.pixelsFromInches(ToolSettings.viewToolPickRadiusInches));
            this._lastTargetPoint = (undefined !== visiblePoint ? visiblePoint : vp.view.getTargetPoint());
            return this._lastTargetPoint;
        },
        turnRight(){
            const localRotationAxis = Vector3d.create(0, 0, 0);
            localRotationAxis.y = -1.0;
          
            const localRotation = Matrix3d.createRotationAroundVector(localRotationAxis, Angle.createDegrees(-90));
            
            const newRotation = localRotation.multiplyMatrixMatrix(this.endRotMatrix);
           

            if (this.endRotMatrix.isAlmostEqual(newRotation)){
                return;
            }
            let vp = IModelApp.viewManager.selectedView;
            if (vp.rotation !== newRotation) {
                const inverse = newRotation.transpose();
                const center = this._getRotatePoint(vp);
                const targetMatrix = inverse.multiplyMatrixMatrix(vp.view.getRotation());
                const worldTransform = Transform.createFixedPointAndMatrix(center, targetMatrix);
                const frustum = vp.getWorldFrustum();
                const startFrustum = vp.getWorldFrustum();
                frustum.multiply(worldTransform);
                vp.animateFrustumChange(startFrustum, frustum,{});
                vp.view.setupFromFrustum(frustum);
                vp.synchWithView(true);
                this.endRotMatrix = newRotation;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.nav{
    height: 96px;
    width: 96px;
    position: absolute;
    top: 95px;
    right: 15px;
    z-index: 10000;
    .direction{
        position: absolute;
        cursor: pointer;
        width:0;
        height:0;
        border:10px solid transparent;
    }
    .up{
        margin: 0 auto;
        left: 0px;
        right: 0px;
        top: 0px;
        border-top-color:white; //只有尖相对的方向border有颜
    }
    .down{
        margin: 0 auto;
        left: 0px;
        right: 0px;
        bottom: 0px;
        border-bottom-color:white;
    }
    .left{
        margin: auto 0;
        top: 0px;
        bottom: 0px;
        left: 0px;
        border-left-color:white;
    }
    .right{
            margin: auto 0;
            top: 0px;
            bottom: 0px;
            right: 0px;
            border-right-color:white;
    }
      
}
#navigation{
    position: absolute;
    top: 22px;
    right: 25px;
    z-index: 1001;
    #a{
        width: 50px;
        height: 50px;
        position:relative; /*给父元素相对定位*/
        transform-style: preserve-3d; /*父元素设为3d*/
        transform: perspective(1000px) ; /*设置父元素得景深*/
    }
    #a>div{
        position:absolute;/*盒子每面的默认样式*/
        width: 50px;
        height: 50px;
        border: 1px solid #000000;
        text-align: center;
        line-height: 50px;
    }
    #a>div:nth-child(1){
        transform: translateZ(25px);/*前面盒子宽为200px所以先向前位移25px*/
        background: rgba(0,0,255,0.5);
    }
    #a>div:nth-child(2){
        transform: translateZ(-25px);/*第二元素向后位移25px 这样盒子前后面就有了*/
        background: rgba(0,255,0,0.5);
    }
    #a>div:nth-child(3){
        transform: rotateX(90deg) translateZ(25px);/*第三个让他平躺下，也就是x轴旋转90°，旋转后在位移，这样就会向他面对的那面去位移*/
        background: rgba(255,0,0,0.5);
    }
    #a>div:nth-child(4){
        transform: rotateX(90deg) translateZ(-25px);
        background: rgba(255,255,0,0.5);
    }
    #a>div:nth-child(5){
        transform: rotateY(90deg) translateZ(-25px);
        background: rgba(0,255,255,0.5);
    }

    #a>div:nth-child(6){
        transform: rotateY(90deg) translateZ(25px);
        background: rgba();
    }
}
</style>