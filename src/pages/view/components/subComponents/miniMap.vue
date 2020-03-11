<template>
    <div @click="showMiniMap">
        <i class="iconfont icon-cc-contraction"></i>
        <img src="../../../../assets/images/map.jpg" width="300" height="144.7" class="map" id="map">
        <canvas  width="300" height="144.7" id="miniMap" class="miniMap"></canvas>
    </div>
</template>

<script>
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Vector2d, Point3d } from "@bentley/geometry-core";

export default {
    name: 'fitToView',
    data () {
        return {
            corner: [
                new Point3d(-55.08950043333424, -11.297427974953287, 207.10008590114282),
                new Point3d(-3.3424613030905945, -11.297427974953287, 207.10008590114282),
                new Point3d(-55.08950043333424, 13.62987164539609, 207.10008590114282),
                new Point3d(-3.3424613030905945, 13.62987164539609, 207.10008590114282)
            ],
            xVector:[],
            yVector:[],
            ctx:{}
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        showMiniMap(){           
            this.drawPic();
            this.xVector = this.corner[2].vectorTo(this.corner[3]);
            this.yVector = this.corner[2].vectorTo(this.corner[0]);
            IModelApp.viewManager.selectedView.onViewChanged.addListener((vp)=>{
                this.calc()
            })
        },
        drawPic(){
            let canvas = document.getElementById('miniMap');
            let img = document.querySelector("#map");
            this.ctx = canvas.getContext("2d");
            this.ctx.drawImage(img,0,0,300,144.7);
        },
        calc(){
            const eyePoint = IModelApp.viewManager.selectedView.view.camera.getEyePoint().clone()
            const frustum = IModelApp.viewManager.selectedView.getFrustum();
            const corner1 = frustum.getCorner(0)
            const corner2 = frustum.getCorner(3)
            const direction = eyePoint.vectorTo(new Point3d((corner1.x + corner2.x) / 2, (corner1.y + corner2.y) / 2, (corner1.z + corner2.z) / 2))
            // console.log("direction",direction);

            //const direction = eyePoint.vectorTo(IModelApp.viewManager.selectedView.view.getTargetPoint())
    
            const cameraVec = this.corner[2].vectorTo(eyePoint)
            let x = ((this.xVector.dotProduct(cameraVec) / this.xVector.magnitude()) / this.xVector.magnitude()) * 300
            let y = ((this.yVector.dotProduct(cameraVec) / this.yVector.magnitude()) / this.yVector.magnitude()) * 144.70
            let z = eyePoint.z
            let dirX = ((this.xVector.dotProduct(direction) / this.xVector.magnitude()) / this.xVector.magnitude()) * 300
            let dirY = ((this.yVector.dotProduct(direction) / this.yVector.magnitude()) / this.yVector.magnitude()) * 144.70
            let cameraDirection = new Vector2d(dirX, dirY)
            cameraDirection = cameraDirection.normalize()
            this.drawMarker(x, y, z, cameraDirection.x, cameraDirection.y)
        },
        drawMarker (x, y, z, dirX, dirY) {
            const verticalX = dirY / Math.hypot(dirX, dirY)
            const verticalY = -dirX / Math.hypot(dirX, dirY)
            this.ctx.clearRect(0, 0, 300, 150)
            this.drawPic();
            this.ctx.beginPath()
            this.ctx.moveTo(x + verticalX * 4, y + verticalY * 4)
            this.ctx.lineTo(x - verticalX * 4, y - verticalY * 4)
            this.ctx.lineTo(x + dirX * 10, y + dirY * 10)
            this.ctx.fillStyle = 'rgb(64, 158, 255)'
            this.ctx.fill()
            this.ctx.closePath()
        
            this.ctx.fillStyle = 'red'
            this.ctx.beginPath()
            this.ctx.arc(x, y, 4, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.closePath()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.miniMap{
    position:absolute;
    width: 300px;
    height: 150px;
    top:82px;
    left: 10px;
    z-index: 1000;
}
.map{
    display: none;
}

</style>