<template>
    <div class="tool-bar">
        <change-view-component></change-view-component>
        <model-component></model-component>
        <categories-component></categories-component>
        <fit-to-view-component></fit-to-view-component>
        <window-area-component></window-area-component>
        <walk-component></walk-component>
        <rotate-component></rotate-component>
        <gyroscopeComponent></gyroscopeComponent>
        <settingComponent></settingComponent>
        <undoComponent></undoComponent>
        <redoComponent></redoComponent>
    </div>
</template>
<script>
 
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


export default {
    name: 'toolBar',
    data () {
        return {
        };
    },
    props:[''],
    components: {
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
        redoComponent
    },
    created () {},
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