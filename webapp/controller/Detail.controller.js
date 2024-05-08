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

        return BaseController.extend("com.sofftek.aca20241q.controller.Detail", {
            onInit: function () {
                that = this;
                let oRouter = this.getRouter();
                oRouter.getRoute('Detail').attachPatternMatched(this._onPatternMatched, this);
            },

            _onPatternMatched:function(oEvent){
                let sClub = oEvent.getParameter('arguments').IdClub;
                // let sPath = `/ClubSet('${sClub}')`;
                // alert(sPath );
                let oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function(){
                    this.getView().bindElement({
                        path: `/ClubSet('${sClub}')`,
                        events: {
                            change: this._oBindingChange.bind(this),
                            dataRequested: function(){
                                that.getView().setBusy(true)
                            },
                            dataReceived: function(){
                                that.getView().setBusy(false)
    
                            }
                        }
                    })
                }.bind(this));
     
            
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
                
                var oBinding = oList.getBinding("items");
                console.log(dataSearch)
            },

            deletePlayer:function(oEvent){
                let idPlayer = oEvent.getSource().getBindingContext().getPath();
                let oDataModel = this.getOwnerComponent().getModel();
                oDataModel.remove(`${idPlayer}`,{
                    success : function(oResponse){
                        sap.m.MessageBox.success("Jugador eliminado correctamente");
                        //refrescar el modelo para que se actualice la tabla despues de eliminar
                        that.getOwnerComponent().getModel().refresh(true,true);
                    },
                    error: function(oError){
                        sap.m.MessageBox.success("No se pudo eliminar el jugador");
                    }
                })
            },
         
            openDialogUpdate:function(){
                if (!this.oCreateFragment) {
                    var oDataObject = this.getView().getBindingContext().getObject();
                    var toPlayerSet = oDataObject.ToPlayerSet;
                    // console.log(toPlayerSet)
                    this.oCreateFragment =
                        sap.ui.core.Fragment.load({
                            name: "com.sofftek.aca20241q.view.fragments.DialogPlayers",
                            controller: that
                        }).then(function (oDialog) {
                            that.getView().addDependent(oDialog);
                            let oModel = new sap.ui.model.json.JSONModel({
                                "Name": oDataObject.Name,
                                "LastNamePlayer": ""
                         
                            })
                            oModel.setDefaultBindingMode("TwoWay");
                            oDialog.setModel(oModel, "PlayerUpdate");
                            oDialog.attachAfterClose(that._afterCloseDialog);
                            return oDialog;
                        }.bind(that));
                }
                that.oCreateFragment.then(function (oDialog) {
                    oDialog.open();
                }.bind(that));
            },

            updatePlayer:function(){
                var oDataModel = this.getView().getModel();
                

                oDataModel.update("/PlayerSet", oEntry, {
                    success: function(oResponse) {
                        // Lógica de éxito aquí
                    },
                    error: function(oError) {
                        // Lógica de manejo de error aquí
                    }
                });

                
             },

             _afterCloseDialog: function(oEvent){
                debugger
                oEvent.getSource().destroy();
                that.oCreateFragment = null;
             },
            closeDialogPlayer:function(){
                that.oCreateFragment.then(function (oDialog) {
                    oDialog.close();
                }.bind(that));
            }

        });


        
    });
