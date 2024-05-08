sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.m.MessageToast} MessageToast
 */
function (BaseController, MessageToast) {
    "use strict";
    var that;

    return BaseController.extend("com.sofftek.aca20241q.controller.Player", {
        onInit: function () {
          
        },

     

        _oBindingChange: function(oEvent){

        },

        onExit: function () {

        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {

        },

        //filtrar busqueda
        onSearchChangeFilterPlayers:function(oEvent){
            let dataSearch = oEvent.mParameters.newValue;

            this.searchInDatabase(dataSearch);
        },
        searchInDatabase: function(dataSearch) {
            console.log(dataSearch)
        },

    });
});
