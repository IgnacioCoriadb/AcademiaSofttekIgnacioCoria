sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MesaageToast) {
        "use strict";
        var that;

        return BaseController.extend("com.sofftek.aca20241q.controller.Main", {
            onInit: function () {
                that = this;
            
            },


            /*************************CRUD CLUB**************************************** */

         

          

            /***************************************************************** */
            onExit: function () {

            },

            onBeforeRendering: function () {
                //el that para poder hacer la consulta de manera global
                that.oModel = this.getView().getModel("academiaJSONModel");
                this._setModel();
            },

            onSelectionItem: function(oEvent) {
               let oTable = oEvent.getSource();
               let oSelected = oTable.getSelectedItem();
               let sClub = oSelected.getBindingContext().getProperty("IdClub");
               this.getRouter().navTo('Detail', {IdClub: sClub});
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
          

           

            onAfterRendering: function () {

            },

            // onPressButton: function (oEvent) {
            //     debugger
            // }

        });
    });
