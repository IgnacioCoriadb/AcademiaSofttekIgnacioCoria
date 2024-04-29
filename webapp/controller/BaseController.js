sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,History) {
        "use strict";
        var that;
        //en este archivo se van a definir los metodos globales
        return Controller.extend("com.sofftek.aca20241q.controller.BaseController", {
         
            getRouter:function(){
                return this.getOwnerComponent().getRouter();
            },
            onBack: function(){
                let oHistory = History.getInstance();
                let oPrevHash = oHistory.getPreviousHash();
                if(oPrevHash !== undefined){
                    window.history.go(-1);
                }else{
                    this.getRouter().navTo("RouteMain")
                }
            }
        });
    });
