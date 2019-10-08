<template>
    <div>
        <i class="iconfont icon-mark" @click="mark">
        </i>
    </div>
    
</template>

<script>
import {IModelApp, PrimitiveTool, EventHandled} from "@bentley/imodeljs-frontend";
import {IncidentMarkerDemo} from "./incentMaker"


export default {
    name: 'imodelmark',
    data () {
        return {
            tips:'hello',
            
        };
    },
    components: {
        
    },
    created () {
        
    },
    methods: {
        
        register(toolNamespace){
                let that = this;
                class MarkTool extends PrimitiveTool {
                constructor() {
                    super(...arguments);
                    this.points = [];
                }
                isCompatibleViewport(vp, isSelectedViewChange) { return (super.isCompatibleViewport(vp, isSelectedViewChange) && undefined !== vp && vp.view.isSpatialView()); }
                requireWriteableTarget(){ return false; }
                onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }

                setupAndPromptForNextAction() {
                    IModelApp.accuSnap.enableSnap(true);
                }
            
                async onDataButtonDown(ev){
                    const curSnapDetail = IModelApp.accuSnap.getCurrSnapDetail();
                    if (curSnapDetail) {
                        IncidentMarkerDemo.toggle(curSnapDetail.snapPoint.clone(),that.tips)
                    }
                    return EventHandled.No;
                }

                // async onResetButtonUp(_ev) {
                //     // IModelApp.toolAdmin.startDefaultTool(); 
                //     // return EventHandled.No;
                // }

                onRestartTool() {
                    const tool = new MarkTool();
                    if (!tool.run())
                        this.exitTool();
                }
                async onKeyTransition(wentDown, keyEvent) {
                    if (wentDown) {
                        switch (keyEvent.key.toLowerCase()) {
                            case "delete":
                            IncidentMarkerDemo.undo();
                            break;
                            case "escape":
                            IncidentMarkerDemo.cancel();
                            break;
                        }
                    }
                    return EventHandled.No;
                }
            }

            MarkTool.toolId = 'iModelWeb.Mark';
            MarkTool.register(toolNamespace);
        },
        mark() {
            this.active = !this.active;
            if(this.active){
                IModelApp.tools.run("iModelWeb.Mark");
            }else{
                IncidentMarkerDemo.cancel()
            }
            
        },
        
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>