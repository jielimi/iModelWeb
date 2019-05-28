<template>
    <div class="tool-bar">
        <img src="@/assets/images/cake.svg" style="width:30px;height:30px;display:none" id="testSvg" >
        <open-file-component style="display:none"></open-file-component>
        <change-view-component></change-view-component>
        <model-component></model-component>
        <categories-component></categories-component>
        <!-- <choose-component></choose-component> -->
        <save-component :projectId="projectId" :versionName="versionName"></save-component>
        <hide-component></hide-component>
        <show-component></show-component>
        <fit-to-view-component></fit-to-view-component>
        <window-area-component></window-area-component>
        <walk-component></walk-component>
        <rotate-component></rotate-component>
        <gyroscopeComponent></gyroscopeComponent>
        <settingComponent></settingComponent>
        <undoComponent></undoComponent>
        <redoComponent></redoComponent>
        <!-- <clipComponent></clipComponent> -->
        <tipComponent :projectId="projectId" :contextId="contextId" :accessToken="accessToken" :versionName="versionName"></tipComponent>
        <!-- <markComponent></markComponent> -->
        <graffitiComponent></graffitiComponent>
    </div>
</template>
<script>
 
 import openFileComponent from './subComponents/openFile'
 import modelComponent from './subComponents/model'
 import changeViewComponent from './subComponents/changeView'
 import categoriesComponent from './subComponents/categories'
 import fitToViewComponent from './subComponents/fitToView'
 import windowAreaComponent from './subComponents/windowArea'
 import walkComponent from './subComponents/walk'
 import rotateComponent from './subComponents/rotate'
 import gyroscopeComponent from './subComponents/gyroscope'
 import settingComponent from './subComponents/setting'
 import undoComponent from './subComponents/undo'
 import redoComponent from './subComponents/redo'
//  import chooseComponent from './subComponents/choose'
 import saveComponent from './subComponents/save'
 import hideComponent from './subComponents/hide'
 import showComponent from './subComponents/show'
//  import clipComponent from './subComponents/clip'
 import tipComponent from './subComponents/tip'
// import markComponent from './subComponents/mark'
import graffitiComponent from './subComponents/graffiti'


export default {
    name: 'toolBar',
    data () {
        return {};
    },
    props:['projectId','versionName','contextId','accessToken'],
    components: {
        openFileComponent,
        modelComponent,
        changeViewComponent,
        categoriesComponent,
        fitToViewComponent,
        windowAreaComponent,
        walkComponent,
        rotateComponent,
        gyroscopeComponent,
        settingComponent,
        undoComponent,
        redoComponent,
        // chooseComponent,
        saveComponent,
        hideComponent,
        showComponent,
        // clipComponent,
        tipComponent,
        // markComponent,
        graffitiComponent

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