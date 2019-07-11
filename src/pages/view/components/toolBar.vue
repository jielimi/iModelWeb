<template>
    <div class="tool-bar">
        <img src="@/assets/images/cake.svg" style="width:30px;height:30px;display:none" id="testSvg" >
        <open-file-component style="display:none"></open-file-component>
        <change-view-component></change-view-component>
        <model-component></model-component>
        <categories-component></categories-component>
        <save-component :projectId="projectId" :versionName="versionName"></save-component>
        <hide-component></hide-component>
        <show-component></show-component>
        <fit-to-view-component></fit-to-view-component>
        <zoomin-component></zoomin-component>
        <window-area-component></window-area-component>
        <walk-component></walk-component>
        <rotate-component></rotate-component>
        <gyroscopeComponent></gyroscopeComponent>
        <settingComponent></settingComponent>
        <undoComponent></undoComponent>
        <redoComponent></redoComponent>
        <clipComponent></clipComponent>
        <regeisterToolComponent :projectId="projectId" :url="url" :contextId="contextId" :accessToken="accessToken" :versionName="versionName"></regeisterToolComponent>
        <isolateComponent></isolateComponent>
        <measureComponent></measureComponent>
        <tileprogressComponent></tileprogressComponent>
        <shadowComponent></shadowComponent>
        <treeComponent></treeComponent>
        
    </div>
</template>
<script>
 
import openFileComponent from './subComponents/openFile'
import modelComponent from './subComponents/model'
import changeViewComponent from './subComponents/changeView'
import categoriesComponent from './subComponents/categories'
import fitToViewComponent from './subComponents/fitToView'
import zoominComponent from './subComponents/zoomIn'
import windowAreaComponent from './subComponents/windowArea'
import walkComponent from './subComponents/walk'
import rotateComponent from './subComponents/rotate'
import gyroscopeComponent from './subComponents/gyroscope'
import settingComponent from './subComponents/setting'
import undoComponent from './subComponents/undo'
import redoComponent from './subComponents/redo'
import saveComponent from './subComponents/save'
import hideComponent from './subComponents/hide'
import showComponent from './subComponents/show'
import clipComponent from './subComponents/clip'
import regeisterToolComponent from './subComponents/regeisterTool'
import isolateComponent from './subComponents/isolate'
import tileprogressComponent from './subComponents/tileprogress'
import measureComponent from './subComponents/measure'
import shadowComponent from './subComponents/shadow'
import treeComponent from './subComponents/tree'



export default {
    name: 'toolBar',
    data () {
        return {};
    },
    props:['projectId','url','versionName','contextId','accessToken'],
    components: {
        openFileComponent,
        modelComponent,
        changeViewComponent,
        categoriesComponent,
        fitToViewComponent,
        zoominComponent,
        windowAreaComponent,
        walkComponent,
        rotateComponent,
        gyroscopeComponent,
        settingComponent,
        undoComponent,
        redoComponent,
        saveComponent,
        hideComponent,
        showComponent,
        clipComponent,
        regeisterToolComponent,
        isolateComponent,
        tileprogressComponent,
        measureComponent,
        shadowComponent,
        treeComponent
    },
    created () {
    },
    mounted () {
        
    },
    methods: {
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tool-bar{
    height: 35px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
</style>