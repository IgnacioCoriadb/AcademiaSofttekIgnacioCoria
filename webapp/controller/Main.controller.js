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
            onOpenDialog: function() {
                if (!this.fDialog) {
                    this.loadFragment({
                        name: "com.sofftek.aca20241q.view.fragments.DialogForm",
                        Controller: that
                    }).then(function(oDialog) {
                        that.getView().addDependent(oDialog);
                        let oModel = new sap.ui.model.json.JSONModel({
                            "IdClub":"",
                            "Name": "",
                            "City": "",
                            "Country": "",
                            "League": "",
                            "FoundationDate": new Date()
                        });
                        oModel.setDefaultBindingMode("TwoWay");
                        oDialog.setModel(oModel, "ClubCreate");
                        oDialog.attachAfterClose(that._afterCloseDialog);
                        this.fDialog = oDialog;
                        this.fDialog.open();
                    }.bind(this));
                } else {
                    this.fDialog.open();
                }
            },
            
            onCreateClub:function(oEvent){
              
                var oModel = oEvent.getSource().getModel("ClubCreate");
                var sFoundationDate = oModel.getProperty("/FoundationDate");
              

                // Formatear la fecha en el formato (yyyy-MM-dd'T'00:00:00)
                var oDate = new Date(sFoundationDate);
                var sFormattedDate = oDate.toISOString().split('T')[0] + 'T00:00:00';
            
                // Actualizar el valor de la fecha en el modelo
                oModel.setProperty("/FoundationDate", sFormattedDate);
               
                
                // Ahora puedes acceder a los datos modificados en el modelo y enviarlos al backend
                let oData = oModel.getData();
                console.log(oData);
                let oDataModel = that.getView().getModel();
                oDataModel.create("/ClubSet", oData, {
                    success: function (oResponse) {
                        let result = oResponse?.results;
                        sap.m.MessageBox.success("Club Creado");
                        that.getOwnerComponent().getModel().refresh(true, true);
                        that.onCloseClubCreate();
                    },
                    error: function (oError) {
                        // manejar excepción del servicio
                        sap.m.MessageBox.error("Ocurrió un problema al crear el club");
                    }
                });
        
            },
            onCloseClubCreate: function (oEvent) {
                this.fDialog.then((oDialog) =>oDialog.close());
            },
          

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
