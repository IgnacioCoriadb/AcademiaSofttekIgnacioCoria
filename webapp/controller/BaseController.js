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
            },
              //formatear fecha
              getFoundationDate: function(date) {
                 if (!date) {
                     return "";
                 }
                 // Convertir la fecha a un objeto Date si no lo es
                 if (!(date instanceof Date)) {
                     date = new Date(date);
                 }
 
                 // Obtener el día, mes y año de la fecha
                 const dia = date.getDate();
                 const mes = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
                 const anio = date.getFullYear();
 
                 // Formatear la fecha como "dd/mm/aaaa"
                 return `${dia}/${mes}/${anio}`;
             },

             updtateForm:function(value){
               alert(value);
               debugger
             }
        });
    });
