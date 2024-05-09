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
                debugger
                oRouter.getRoute('Detail').attachPatternMatched(this._onPatternMatched, this);
            },

        

            // dataPlayer: function(){
            //     this._oModel = new sap.ui.model.json.JSONModel({
            //         "Name": "",
            //         "City": "",
            //         "Country": "",
            //         "League": "",
            //         "FoundationDate": ""
            //     });
            //     this.getView().setModel(this._oModel, "FormDataPlayer");
            //    },
            _onPatternMatched: function(oEvent) {
               
                let idClub = oEvent.getParameter('arguments').IdClub;
                console.log(oEvent);
                let oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function() {
                    oModel.read(`/ClubSet('${idClub}')/ToPlayerSet`, {
                        urlParameters: {
                            "$expand": "ToClub"
                        },
                        success: function(oResponse) {
                            // Crear un nuevo modelo JSON y establecer los datos de los jugadores
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData(oResponse.results);

                            // Guardar el modelo en una propiedad del controlador para acceder a él más tarde
                            this._playerModel = oJSONModel;
                            this.getView().setModel(oJSONModel, "PlayerModel");


                        }.bind(this),
                        error: function(oError) {
                            // Manejar errores si es necesario
                        }
                    });
                }.bind(this));
            },

            //Editar
            openDialogUpdate: function (oEvent) {
                //obtengo todos los players
                var oContext = oEvent.getSource().getBindingContext("PlayerModel");
                //obtengo el player seleccionado
                var oPlayer = oContext.getObject();

                // Obtener valores de los campos al momento de abrir el diálogo
                var sName = oPlayer.Name;
                var sLastName = oPlayer.LastName;
                var sNationality = oPlayer.Nationality;
                var sSelectedClubKey = oPlayer.IdClub;
                var oDate = oPlayer.BirthDate;

                if (!this.oCreateFragment) {
                    this.oCreateFragment =
                        sap.ui.core.Fragment.load({
                            name: "com.sofftek.aca20241q.view.fragments.DialogPlayers",
                            controller: that 
                        }).then(function (oDialog) {
                            this.getView().addDependent(oDialog);

                            // Establecer valores en el modelo del diálogo
                            var oModel = new sap.ui.model.json.JSONModel({
                                "Name": sName,
                                "LastName": sLastName,
                                "BirthDate": oDate,
                                "Nationality": sNationality,
                                "IdClub": sSelectedClubKey,
                                "IdPlayer": oPlayer.IdPlayer
                            });
                            oModel.setDefaultBindingMode("TwoWay");
                            oDialog.setModel(oModel, "PlayerUpdate");
                            oDialog.open();
                            oDialog.attachAfterClose(that._afterCloseDialog);
                            oModel.refresh();

                            this.getOwnerComponent().getModel().refresh(true, true);
                            return oDialog;

                        }.bind(this));

                }

                this.oCreateFragment.then(function (oDialog) {
                    oDialog.open();
                });
            },


            updatePlayer:function(oEvent){
                //Obtengo los datos del form
                let oModel = oEvent.getSource().getModel("PlayerUpdate");
                let oData = oModel.getData();
                //convertir la fecha a el formato de la base de datos
                var dateObj = new Date(oData.BirthDate);
                var year = dateObj.getFullYear();
                var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
                var day = ("0" + dateObj.getDate()).slice(-2);
                var formattedDate = year + "-" + month + "-" + day + "T00:00:00";     
                
                oData.BirthDate = formattedDate;

                let idPlayer = oData.IdPlayer;
                let idClub = oData.IdClub;
                let url = `/PlayerSet(IdPlayer='${idPlayer}',IdClub='${idClub}')`;
               
                var oDataModel = that.getView().getModel();
                oDataModel.update(url, oData, {
                    success: function(oResponse) {
                        sap.m.MessageToast.show("Jugador editado correctamente");
                        oDataModel.refresh();
                        that.getOwnerComponent().getModel().refresh(true, true);
                        that.closeDialogPlayer();
                        // that._onPatternMatched(oEvent);
                        that.newData(idClub);
                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageToast.show("No se pudo editar el club");
                    }
                });
             },

             newData:function(idClub){
                let oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function() {
                    oModel.read(`/ClubSet('${idClub}')/ToPlayerSet`, {
                        urlParameters: {
                            "$expand": "ToClub"
                        },
                        success: function(oResponse) {
                            // Crear un nuevo modelo JSON y establecer los datos de los jugadores
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData(oResponse.results);

                            // Guardar el modelo en una propiedad del controlador para acceder a él más tarde
                            this._playerModel = oJSONModel;
                            this.getView().setModel(oJSONModel, "PlayerModel");


                        }.bind(this),
                        error: function(oError) {
                            // Manejar errores si es necesario
                        }
                    });
                }.bind(this));
             },

             _afterCloseDialog: function(oEvent){
                oEvent.getSource().destroy();
                that.oCreateFragment = null;
             },

             closeDialogPlayer:function(){
                that.oCreateFragment.then(function (oDialog) {
                    oDialog.close();
                }.bind(that));

             },






            _oBindingChange: function(oEvent){

            },

            onExit: function () {

            },

            onBeforeRendering: function () {

            },

            onAfterRendering: function () {

            },

 

            deletePlayer:function(oEvent){

                let sPath = oEvent.getSource().getBindingContext().getPath();
                console.log(sPath);
                debugger


                // var oContext = oEvent.getSource().getBindingContext("PlayerModel");
                // var idPlayer = oContext.getObject().IdPlayer;
                // var idClub = oContext.getObject().IdClub;

                // let url = `/PlayerSet(IdPlayer='${idPlayer}',IdClub='${idClub}')`;

                // // let idPlayer = oEvent.getSource().getBindingContext().getPath();
                // // var oSpecificModel = this.getOwnerComponent().getModel("academiaJSONModel");

                // // console.log(oSpecificModel);
                // // debugger
                // let oDataModel = this.getOwnerComponent().getModel();

                
                // oDataModel.remove(url,{
                //     success : function(oResponse){
                //         sap.m.MessageBox.success("Jugador eliminado correctamente");
                //         //refrescar el modelo para que se actualice la tabla despues de eliminar
                     
                //         that.getOwnerComponent().getModel().refresh(true,true);
                //     },
                //     error: function(oError){
                //         sap.m.MessageBox.error("No se pudo eliminar el jugador");
                //     }
                // })
            },

       


       


             onSearchChangeFilterPlayers: function(oEvent) {
                
                var sValue = oEvent.getParameter("newValue");

                // Crear un filtro para los campos relevantes
                var oFilter = new sap.ui.model.Filter([
                    new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("Nationality", sap.ui.model.FilterOperator.Contains, sValue)
                ], false);

                // Obtener la referencia al modelo de datos
                var oModel = this.getView().getModel("PlayerModel");

                // Obtener los bindings del modelo
                var aBindings = oModel.aBindings;

                // Aplicar el filtro a cada binding
                aBindings.forEach(function(oBinding) {
                    oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
                });
            },

            onBack:function(){
                alert("atras")
            }


        });



    });
