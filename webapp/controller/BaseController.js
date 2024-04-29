sap.ui.define([
    "sap/ui/core/mvc/Controller",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var that;
        //en este archivo se van a definir los metodos globales
        return Controller.extend("com.sofftek.aca20241q.controller.BaseController", {
         
            getRouter:function(){
                return this.getOwnerComponent().getRouter();
            }
        });
    });
