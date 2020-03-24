<template>
    <div>
        <i class="iconfont icon-Open- relative" @click="dialogVisible=true;inputFileUrl='';" >
        </i>
        <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-input v-model.trim="inputFileUrl" placeholder=""></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">cancel</el-button>
            <el-button type="primary" @click="openFile">confirm</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { IModelApp,IModelConnection,ScreenViewport } from "@bentley/imodeljs-frontend";

class SimpleViewState {
    constructor(){};
}
let activeViewState = new SimpleViewState();
let theViewPort = undefined;
export default {
    name: 'openFile',
    data () {
        return {
            dialogVisible:false,
            inputFileUrl:'',
            standalone: false
        };
    },
    components: {
        
    },
    beforeCreate(){
      
    },
    created () {
        let that = this;
        window.onbeforeunload = () =>{
            this.clearViews();
            return 'tips';
        }
        // window.eventHub.$on('open_standalone',this.openFileFromProject);
        this.openFileFromProject();
    },
    beforeDestroy(){
        this.clearViews()
    },
    methods: {
        openFileFromProject(){
            if(this.$route.query.isStandalone){
                let inputFileUrl = this.$route.query.openUrl
                this.resetStandaloneIModel(inputFileUrl)
            }
            window.eventHub.$emit('tile_progress_init');
            window.eventHub.$emit('keyin_init');
        },
        openFile(){
            if(this.inputFileUrl){
                this.resetStandaloneIModel(this.inputFileUrl)
            }
        },
        async resetStandaloneIModel(filename) {
           
                IModelApp.viewManager.dropViewport(theViewPort, false);
                
                await this.clearViews();
                 
                await this.openStandaloneIModel(activeViewState, filename);
                
                await this.openView(activeViewState);

                window.eventHub.$emit('categories_init');
                window.eventHub.$emit('render_mode_init');
                window.eventHub.$emit('render_model_init');
                this.standalone = true;
                this.dialogVisible = false;
        },
        async clearViews() {
            if (activeViewState.iModelConnection !== undefined){
                
                if(this.standalone){
                    await activeViewState.iModelConnection.closeSnapshot();
                }else {
                    await activeViewState.iModelConnection.close();
                }

                activeViewState = new SimpleViewState();
            }
        },
        async openStandaloneIModel(state, filename) {
            state.iModelConnection = await IModelConnection.openSnapshot(filename);
        },
        async buildViewList(state, configurations) {
            const config = undefined !== configurations ? configurations : {};
            const viewQueryParams = { wantPrivate: false };
            
            const viewSpecs = await state.iModelConnection.views.getViewList(viewQueryParams);
            
            if (viewSpecs.length > 0){
                let viewSpec = viewSpecs[0];
                const viewState = await state.iModelConnection.views.load(viewSpec.id);
                state.viewState = viewState;
            }

            window.eventHub.$emit('viewList_init', viewSpecs);
        },
        async  openView(state) {
            const parent = document.getElementById("imodelview");
            if (parent) {
                await this.buildViewList(state);
               
               
                if (!theViewPort){
                    theViewPort = ScreenViewport.create(parent, state.viewState);
                }
                IModelApp.viewManager.addViewport(theViewPort);
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.relative{
    position: relative;
}
.address{
    top: 0;
    opacity: 0;
    position: absolute;
    width: 44px;
    height: 44px;
    left: 0;
}

</style>