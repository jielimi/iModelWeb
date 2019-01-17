import  {IModelApp} from "@bentley/imodeljs-frontend";

let Tools = {
    // // runTools:function(action, viewPort,...args){
    // //     IModelApp.tools.run(action, viewPort,...args);
    // // },
    // test:function(viewPort){
    //     debugger;
    //     IModelApp.tools.run("View.WindowArea",viewPort);
    // },
    toolsRegister:function(viewPort){
        window.eventHub.$on('fitToView',this.action);
        // window.eventHub.$on('categories_viewList_change',this.runTools("View.Fit",viewPort,true));
       // window.eventHub.$on('fitToView',this.runTools("View.Fit",viewPort, true));
    //    debugger;
    //     window.eventHub.$on('windowArea',this.test(viewPort));
        // window.eventHub.$on('undo',IModelApp.tools.run("View.Undo",viewPort));
    },
    action: function(viewport){
        
        IModelApp.tools.run("View.Fit", viewport, true);
    }
}

export default Tools