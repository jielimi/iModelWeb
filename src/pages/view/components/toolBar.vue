<template>
    <div>
        <div class="top-tools">
            <keyinComponent :projectId="projectId" style="float: left;"></keyinComponent>
            <tileprogressComponent style="float: right;"></tileprogressComponent>
        </div>
        <div class="tool-bar">
            <img src="@/assets/images/cake.svg" style="width:30px;height:30px;display:none" id="testSvg" >
            <debug-info-component></debug-info-component>
            <open-file-component style="display:none"></open-file-component>
            <change-view-component></change-view-component>
            <model-component></model-component>
            <categories-component></categories-component>
            <saveViewsComponent></saveViewsComponent>
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
            <isolateComponent></isolateComponent>
            <measureComponent></measureComponent>
            <shadowComponent></shadowComponent>
            <markComponent></markComponent>
            <graffitiComponent></graffitiComponent>
            <elementTipComponent :projectId="projectId" :contextId="contextId" :accessToken="accessToken" :versionName="versionName"></elementTipComponent>
            <itemtreeComponent></itemtreeComponent>
            <miniMapComponent></miniMapComponent>
            <roadroamComponent></roadroamComponent>
        </div>
    </div>
</template>
<script>
 
import keyinComponent from './subComponents/keyin'
import debugInfoComponent from './subComponents/debugInfo'
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
import isolateComponent from './subComponents/isolate'
import tileprogressComponent from './subComponents/tileprogress'
import measureComponent from './subComponents/measure'
import shadowComponent from './subComponents/shadow'
import saveViewsComponent from './subComponents/saveViews'
import markComponent from './subComponents/redMark/redMark'
import graffitiComponent from './subComponents/graffiti/graffiti'
import elementTipComponent from './subComponents/elementTip'
import itemtreeComponent from './subComponents/itemTypeTree/itemTypeTree'
import miniMapComponent from './subComponents/miniMap'
import roadroamComponent from './subComponents/roadRoam/roadRoam'


export default {
    name: 'toolBar',
    data () {
        return {};
    },
    props:['projectId','url','versionName','contextId','accessToken','openMode',"versionId"],
    components: {
        keyinComponent,
        debugInfoComponent,
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
        isolateComponent,
        tileprogressComponent,
        measureComponent,
        shadowComponent,
        saveViewsComponent,
        markComponent,
        graffitiComponent,
        elementTipComponent,
        itemtreeComponent,
        miniMapComponent,
        roadroamComponent
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
.top-tools {
    height: 28px;
    position: relative;
    padding: 4px 15px 0;
}
.tool-bar{
    height: 30px;
    padding: 10px 10px 5px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
</style>