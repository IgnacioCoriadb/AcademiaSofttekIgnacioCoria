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
            },


            onExit: function () {

            },

            onBeforeRendering: function () {
                //el that para poder hacer la consulta de manera global
                that.oModel = this.getView().getModel("academiaJSONModel");
                this.getClubes();
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

                //seteo los valores al modelo, si pongo setProperty lo guardo en / si pongo set model lo guarda directo. 
                //El set property permite guardar varios como un arreglo de objetos
                that.oModel.setProperty("/formulario",oHardcordData);
                //setear el modelo a la vista 
                that.getView().setModel(that.oModel, "AcademiaModel");
            },
            getClubes:function(){
                let OdataModel = this.getOwnerComponent().getModel();
                const dataClub =[];
                OdataModel.read("/ClubSet",{
                    success: function(oResponse){
                    //convertir a cadena
                    let clubDb = JSON.stringify(oResponse?.results);
                    // Convertir clubDb de nuevo en un objeto JSON
                    clubDb = JSON.parse(clubDb);
                    // Ahora clubDb es un array de objetos JSON
                    clubDb.forEach(function(item) {
                        dataClub.push(
                            {
                              "Name": item.Name,
                              "Country": item.Country,
                              "City": item.City,
                              "FoundationDate": item.FoundationDate,
                              "League": item.League
                            })
                    });

                    that.oModel.setProperty("/club",dataClub);
                    },
                    error:function(oError){
                        MessageToast.show("Error al leer datos");
                    }
                })
            },

           

            onAfterRendering: function () {

            },

            // onPressButton: function (oEvent) {
            //     debugger
            // }

        });
    });
