<template>
    <div class="tool-bar">
        <brief-cases-component></brief-cases-component>
    </div>
</template>
<script>

 import briefCasesComponent from './subComponents/briefCases'

export default {
    name: 'toolBar',
    data () {
        return {
        };
    },
    components: {
        briefCasesComponent
    },
    created () {},
    methods: {
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tool-bar{
    padding: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
</style>