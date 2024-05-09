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
                var oButton = this.getView().byId("buttonCreate");
                // oButton.setEnabled(false);
                this.onReadEmpData();
                this.dataNewClub();
            },
          
            onReadEmpData: function() {
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Cargando Clubes",
                    text: "Espere un momento ..." 
                });
            
                oBusyDialog.open();
            
                oModel.read("/ClubSet", {
                    success: function(oResponse) {
                        oBusyDialog.close();
                        // Establecer los datos filtrados en el modelo JSON
                        oJSONModel.setData(oResponse.results);
                        this.getView().setModel(oJSONModel, "ClubSetModel");
                    }.bind(this),
                    error: function(oError) {
                        oBusyDialog.close();
                    }
                });
            },
            
            
            

           
            onExit: function () {

            },

            onBeforeRendering: function () {
        
            },

           

            onAfterRendering: function () {

            },

          /*******************NAVBAR*********************** */
          onPressGoToMaster: function(oEvent){
            var oListItem = oEvent.getSource();
            var sListItemId = oListItem.getId();
            
            // Obtener solo el ID del elemento sin el prefijo
            var aIdParts = sListItemId.split("--");
            var sItemId = aIdParts[aIdParts.length - 1];
         

            switch(sItemId){
                case "_IdClubes":
                    this.getSplitContObj().toMaster(this.createId("listClubes"));
                    break;
                case "_IdPlayers":
                    this.getSplitContObj().toMaster(this.createId("listPlayers"));
                    break
            }              
        },

        getSplitContObj: function () {
			var result = this.byId("SplitContDemo");
			if (!result) {
				Log.error("SplitApp object can't be found");
			}
			return result;
		},

        onPressMasterBack: function () {
			this.getSplitContObj().backMaster();
		},
        onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitContObj().toDetail(this.createId(sToPageId));
			
		},
        /**********************************FIN NAVBAR*****************************************/

    

        /*************CRUD CLUBES***********************/

        createClub:function(oEvent){
        
            let oModel = oEvent.getSource().getModel("FormDataClub");
            var oDataModel = that.getView().getModel();
            let foundationDate= oModel.getData().FoundationDate;
          
              //convertir la fecha a el formato de la base de datos
              var dateObj = new Date(foundationDate);
              var year = dateObj.getFullYear();
              var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
              var day = ("0" + dateObj.getDate()).slice(-2);
              var formattedDate = year + "-" + month + "-" + day + "T00:00:00";         
          
          
              oModel.setProperty("/FoundationDate", formattedDate);

              let data = oModel.getData();
            
            if(oModel){
                oDataModel.create("/ClubSet", data, {
                    success: function(oResponse) {
                        sap.m.MessageToast.show("Club creado correctamente");
                        // refrescar el modelo para actualizar la tabla después de la creación
                        that.onReadEmpData();
                        oModel.setData({
                            "Name": "",
                            "City": "",
                            "Country": "",
                            "League": "",
                            "FoundationDate": ""
                        });
                        
    
                    },
                    error: function(oError) {
                        sap.m.MessageToast.show("No se pudo crear el club");
                    }
                });
            }else{
                alert("todos los campos son obligatorios")
            }
          
        },

             
        openModalCreatePlayer: function(){
            //abrir Modal
            if (!this.oCreateFragment) {
                this.oCreateFragment =
                    sap.ui.core.Fragment.load({
                        name: "com.sofftek.aca20241q.view.fragments.DialogCreatePlayer",
                        controller: that
                    }).then(function (oDialog) {
                        that.getView().addDependent(oDialog);
                        let oModel = new sap.ui.model.json.JSONModel({
                            "Name": "",
                            "LastName": "",
                            "BirthDate": "",
                            "Nationality": "",
                            "IdClub": ""
                        })
                        oModel.setDefaultBindingMode("TwoWay");
                        oDialog.setModel(oModel, "PlayerCreate");
                        oDialog.attachAfterClose(that._afterCloseDialog);
                        return oDialog;
                    }.bind(that));
            }
            that.oCreateFragment.then(function (oDialog) {
                oDialog.open();
            }.bind(that));
        },
        
      


 


       dataNewClub: function(){
        this._oModel = new sap.ui.model.json.JSONModel({
            "Name": "",
            "City": "",
            "Country": "",
            "League": "",
            "FoundationDate": ""
        });
        this.getView().setModel(this._oModel, "FormDataClub");
       },





        createPlayer:function(oEvent){
            let oModel = oEvent.getSource().getModel("PlayerCreate");
            let oData = oModel.getData();

             //convertir la fecha a el formato de la base de datos
             var dateObj = new Date(oData.BirthDate);
             var year = dateObj.getFullYear();
             var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
             var day = ("0" + dateObj.getDate()).slice(-2);
             var formattedDate = year + "-" + month + "-" + day + "T00:00:00";     
             
            oData.BirthDate = formattedDate;

             var oDataModel = that.getView().getModel();
             oDataModel.create("/PlayerSet", oData, {
                success: function (oResponse) {
                    var result = oResponse?.results;
                    sap.m.MessageBox.success("Se creo el jugador ");
                    that.getOwnerComponent().getModel().refresh(true, true);
                    that.closeDialogPlayer();
                },
                error: function (oError) {
                    // manejar excepción del servicio
                    sap.m.MessageBox.error("No se pudo crear el jugador");
                }
            });
         },

   

         closeDialogPlayer:function(){
            that.oCreateFragment.then(function (oDialog) {
                oDialog.close();
            }.bind(that));
           
         },

      
  


        


        //***************CRUD CLUB***********************/

        modalEditClub: function(oEvent){
            // let oModel = oEvent.getSource().getBindingContext("ClubSetModel").getObject();
            var oContext = oEvent.getSource().getBindingContext("ClubSetModel");
            var club = oContext.getObject();
            let oModel = oEvent.getSource().getModel("FormDataClub");

            oModel.setData({
                "IdClub": club.IdClub,
                "Name": club.Name,
                "City": club.City,
                "Country": club.Country,
                "League": club.League,
                "FoundationDate": club.FoundationDate,
            });
            //abrir ModaL
            if (!this.oCreateFragment) {
                // Carga el fragmento del diálogo
                this.oCreateFragment = sap.ui.core.Fragment.load({
                    name: "com.sofftek.aca20241q.view.fragments.DialogEditClub",
                    controller: this
                }).then(function(oDialog) {
                    this.getView().addDependent(oDialog);
                    //setear modelo del item seleccionad
                    
                    oDialog.open();
                    oDialog.attachAfterClose(that._afterCloseDialog);
                    return oDialog;
                }.bind(this));
            }
            
            // Abre el diálogo después de cargar el fragmento
            this.oCreateFragment.then(function(oDialog) {
                oDialog.open();
            }.bind(this));

        },
            

        editClub: function(oEvent){
            var oModel = this.getView().getModel("FormDataClub");
            let idClub=oModel.getProperty("/IdClub");
            let url = `/ClubSet('${idClub}')`;
            let data = oModel.getData();
            let oDataModel = this.getOwnerComponent().getModel();
            let foundationDate= oModel.getData().FoundationDate;
          
            //convertir la fecha a el formato de la base de datos
            var dateObj = new Date(foundationDate);
            var year = dateObj.getFullYear();
            var month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque los meses comienzan desde 0
            var day = ("0" + dateObj.getDate()).slice(-2);
            var formattedDate = year + "-" + month + "-" + day + "T00:00:00";         
        
        
            oModel.setProperty("/FoundationDate", formattedDate);



            oDataModel.update(url, data, {
                success: function(oResponse) {
                    sap.m.MessageToast.show("Club editado correctamente");
                    // refrescar el modelo para actualizar la tabla después de editar
                    that.getOwnerComponent().getModel().refresh(true, true);
                    that.onReadEmpData();
                    that.closeDialogPlayer();
                },
                error: function(oError) {
                    sap.m.MessageToast.show("No se pudo editar el club");
                }
            });
        },




        deleteClub: function(oEvent){
            let oModel = oEvent.getSource().getBindingContext("ClubSetModel").getObject();
            //obtengo el id para pegarle al back , me retorna /ClubSet('006')
            let idClub = oModel.IdClub; 
            let url = `/ClubSet('${idClub}')`;
            let oDataModel = this.getOwnerComponent().getModel();
            oDataModel.remove(url,{
                success : function(oResponse){
                    sap.m.MessageBox.success("Club eliminado correctamente");
                    //refrescar el modelo para que se actualice la tabla despues de eliminar
                    that.getOwnerComponent().getModel().refresh(true,true);
                    that.onReadEmpData();

                },
                error: function(oError){
                    sap.m.MessageBox.error("No se pudo eliminar el club");
                }
            })
        },
        //Jugadores del club
        getPlayersClub:function(oEvent){
            let oModel = oEvent.getSource().getBindingContext("ClubSetModel").getObject();
            //obtengo el id para pegarle al back , me retorna /ClubSet('006')
            let idClub = oModel.IdClub; 
            this.getRouter().navTo("Detail", {
                IdClub: idClub
            });
        },

        onCloseClubCreate:function(){
            that.oCreateFragment.then(function (oDialog) {
                oDialog.close();
            }.bind(that));
            that. _onPatternMatched();
         },

         //filtros
         onSearchChangeFilter: function(oEvent) {
            var sValue = oEvent.getSource().getValue();
        
            // Crear un filtro para el valor1 y valor2
            var oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("City", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.Contains, sValue),
                    new sap.ui.model.Filter("League", sap.ui.model.FilterOperator.Contains, sValue),
                ],
                and: false
            });
        
            // Obtener la instancia de la tabla
            var oTable = this.byId("idTable");
        
            // Aplicar el filtro a las filas de la tabla
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
        },
        


      
        /************FIN CRUD CLUB******************** */
        _afterCloseDialog: function(oEvent){
            let oModel = oEvent.getSource().getModel("FormDataClub");

            oModel.setData({
                "Name":"",
                "City":"",
                "Country":"",
                "League": "",
                "FoundationDate": ""
            });
            oEvent.getSource().destroy();
            that.oCreateFragment = null;
         },

    
        })

     
        
    });
