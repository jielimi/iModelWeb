<template>
    <div class="tool-bar">
        <brief-cases-component></brief-cases-component>
        <change-view-component></change-view-component>
        <color-picker-component></color-picker-component>
        <categories-component></categories-component>
        <camera-component></camera-component>
        <fit-to-view-component></fit-to-view-component>
        <window-area-component></window-area-component>
        <measure-component></measure-component>
        <walk-component></walk-component>
        <rotate-component></rotate-component>
        <gyroscopeComponent></gyroscopeComponent>
        <settingComponent></settingComponent>
        <undoComponent></undoComponent>
        <redoComponent></redoComponent>
        <syncComponent></syncComponent>
    </div>
</template>
<script>

 import briefCasesComponent from './subComponents/briefCases'
 import changeViewComponent from './subComponents/changeView'
 import colorPickerComponent from './subComponents/colorPicker'
 import categoriesComponent from './subComponents/categories'
 import cameraComponent from './subComponents/camera'
 import fitToViewComponent from './subComponents/fitToView'
 import windowAreaComponent from './subComponents/windowArea'
 import measureComponent from './subComponents/measure'
 import walkComponent from './subComponents/walk'
 import rotateComponent from './subComponents/rotate'
 import gyroscopeComponent from './subComponents/gyroscope'
 import settingComponent from './subComponents/setting'
 import undoComponent from './subComponents/undo'
 import redoComponent from './subComponents/redo'
 import syncComponent from './subComponents/sync'

export default {
    name: 'toolBar',
    data () {
        return {
        };
    },
    components: {
        briefCasesComponent,
        changeViewComponent,
        colorPickerComponent,
        categoriesComponent,
        cameraComponent,
        fitToViewComponent,
        windowAreaComponent,
        measureComponent,
        walkComponent,
        rotateComponent,
        gyroscopeComponent,
        settingComponent,
        undoComponent,
        redoComponent,
        syncComponent
    },
    created () {},
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