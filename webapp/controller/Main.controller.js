sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MesaageToast) {
        "use strict";
        var that;

        return Controller.extend("com.sofftek.aca20241q.controller.Main", {
            onInit: function () {
                that = this;
                this.getClubes();
                debugger;

            },

            getClubes:function(){
                let OdataModel = this.getOwnerComponent().getModel();
                OdataModel.read("/ClubSet",{
                    success: function(oResponse){
                        alert(JSON.stringify(oResponse?.results));
                    },
                    error:function(oError){
                    //    MessageToast.show("Error al leer datos");
                       alert("Error al leer datos: " + oError.responseText);
                    }
                })
            },

            onExit: function () {

            },

            onBeforeRendering: function () {
                this._setModel();
            },

            _setModel: function () {
                let oHardcordData = {
                    "Mail": "ignaciocoriadb@gmail.com",
                    "ZipCode": "1142",
                    "Country": "Argentina",
                    "Street": "Alemanes del volga",
                    "Number": "444"
                };
                //el that para poder hacer la consulta de manera global
                that.oModel = this.getView().getModel("academiaJSONModel");
                //seteo los valores al modelo, si pongo setProperty lo guardo en / si pongo set model lo guarda directo. 
                //El set property permite guardar varios como un arreglo de objetos
                that.oModel.setProperty("/formulario",oHardcordData);
                //setear el modelo a la vista 
                that.getView().setModel(that.oModel, "AcademiaModel");

                this._setPersonasToModel();
            },

            _setPersonasToModel:function(){
                var clubes = [
                    { nombre: "Real Madrid", liga: "La Liga" },
                    { nombre: "FC Barcelona", liga: "La Liga" },
                    { nombre: "Bayern Munich", liga: "Bundesliga" },
                    { nombre: "Manchester City", liga: "Premier League" },
                    { nombre: "Juventus", liga: "Serie A" },
                ];

                that.oModel.setProperty("/clubes",clubes);
                
            },

            onAfterRendering: function () {

            },

            // onPressButton: function (oEvent) {
            //     debugger
            // }

        });
    });
