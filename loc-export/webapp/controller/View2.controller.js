sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/ActionItem",
    "sap/m/ToolbarSpacer",
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device",
    "sap/ui/core/date/UI5Date",
    'sap/m/p13n/Engine',
    'sap/m/p13n/SelectionController',
    'sap/m/p13n/SortController',
    'sap/m/p13n/GroupController',
    'sap/m/p13n/MetadataHelper',
    'sap/ui/model/Sorter',
    'sap/ui/core/library',
    'sap/m/table/ColumnWidthController',
    'sap/m/p13n/FilterController',
    'sap/ui/export/Spreadsheet',
    "sap/ui/export/library",
    "sap/ui/integration/designtime/baseEditor/validator/MaxLength",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    function (Controller,
        JSONModel,
        Menu,
        MenuItem,
        Menu,
        ActionItem,
        ToolbarSpacer,
        jquery,
        Device,
        UI5Date,
        Engine,
        SelectionController,
        SortController,
        GroupController,
        MetadataHelper,
        Sorter,
        library,
        ColumnWidthController,
        FilterController,
        Spreadsheet,
        library,
        MaxLength,
        MessageBox, DateFormat, ODataUtils, Filter, FilterOperator) {

        return Controller.extend("zpro.sk.mittalcoin.exim.loc.export.locexport.controller.View2", {
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                var LcNo = oEvent.getParameter("arguments").LCNo;
                this.createLocalJOSNPayload();
                this.page = LcNo;
                if (LcNo === "null") {
                    this.propertyValues.setProperty("/edit", true);
                    this.propertyValues.setProperty("/view", false);
                    this.propertyValues.setProperty("/editButton", false);
                    this.propertyValues.setProperty("/footer", true);
                    this.propertyValues.setProperty("/update", false);
                    this.propertyValues.setProperty("/new", true);
                    this.propertyValues.setProperty("/po", true);
                    this.propertyValues.setProperty("/ammend", false);
                    this.propertyValues.setProperty("/orginalEdit", true);
                    this.propertyValues.setProperty("/orginalEditButton", false);
                    this.propertyValues.setProperty("/SO", true);
                    this.propertyValues.setProperty("/LCNo", true);
                    this.propertyValues.setProperty("/itemTableVisiblity", false);



                } else {
                    this.propertyValues.setProperty("/edit", false);
                    this.propertyValues.setProperty("/ammend", true);
                    this.propertyValues.setProperty("/SO", false);
                    this.propertyValues.setProperty("/LCNo", false);
                    this.propertyValues.setProperty("/itemTableVisiblity", true);
                    this.originalChanged = false;
                    this.freshAmmend;
                    var sPathOfLCDetails = "/ZRC_LCEXP_HEAD('" + LcNo + "')";
                    var sPathOfLCItemsDetails = sPathOfLCDetails + "/to_Item";
                    this.getCallForLCDetails(sPathOfLCDetails, sPathOfLCItemsDetails);
                }
            },
            // Local payloads
            createLocalJOSNPayload: function () {
                var headerPayload = {
                    "LcNo": "",
                    "SalesContract": "",
                    "SalesOrder": "",
                    "ShipmetLastDateOri": "",
                    "LatestDocumentDateOri": "",
                    "ShipmetLastDateAmend": "",
                    "LatestDocumentDateAmend": "",
                    "LcIssueDateAmend": "",
                    "LcIssuanceBankAccountNumbe": "",
                    "LcIssuanceBankName": "",
                    "LcIssuanceSwiftCode": "",
                    "BeneficiaryBankDetailsWith_": "",
                    "NegotiatingBankDetailsWith_": "",
                    "PortOfLoading": "",
                    "FinalDestination": "",
                    "IssueChargesBySeller": "",
                    "ConfirmationChargesBySeller": "",
                    "DiscountingChargesBySeller": "",
                    "IssueChargesByBuyer": "",
                    "ConfirmationChargesByBuyer": "",
                    "DiscountingChargesByBuyer": "",
                    "PaymentTerms": "",
                    "ToleranceQtyP": "",
                    "ShipmentType": "",
                    "LcType": "",
                    "Pi": "",
                    "LcExpiryDateOriginal": "",
                    "LcIssueDateOriginal": "",
                    "LcRecevingDateOriginal": "",
                    "LcExpiryDateAmendment": "",
                    "LcRecevingDateAmendment": "",
                    "LcRecieivingBankAccountNum": "",
                    "LcReceivingBankName": "",
                    "LcRecevingSwiftCode": "",
                    "ConfirmationBankDetailsWith": "",
                    "PortOfDischarge": "",
                    "LcCurrency": "",
                    "LcValue": "",
                    "ListOfDocumentsUnderLc": "",
                    "AmendmentChargesBySeller": "",
                    "DiscrepencyChargesBySeller": "",
                    "TotalChargesBySeller": "",
                    "Amendment_ChargesBySeller": "",
                    "DiscrepencyChargesByBuyer": "",
                    "TotalChargesByBuyer": "",
                    "LcChargesInIndia": "",
                    "ToleranceValueP": "",
                    "TransShipment": ""
                };
                this.getView().setModel(new JSONModel(headerPayload), "oModelForHeader");

                this.itemPayload = {
                    "results": [{
                        "LcNo": "",
                        "SalesOrder": "",
                        "Posnr": "",
                        "Matnr": "",
                        "MatDesc": "",
                        "Meins": "",
                        "LcQty": "",
                        "LcCurrency": "",
                        "UnitPrice": "",
                        "TotalVal": "",
                        "LineType": ""
                    }
                    ]
                };
                this.getView().setModel(new JSONModel({}), "oModelForItemTable");
                this.getView().setModel(new JSONModel({}), "oModelForAmmendItemTable");
                var properties = {
                    "title": "LC export original - Items",
                    "titleAmmend": "LC export ammend - Items",
                    "view": false,
                    "edit": false,
                    "editButton": false,
                    "footer": false,
                    "new": false,
                    "update": false,
                    "itemTableVisiblity": false,
                    "po": false,
                    "ammend": false,
                    "orginalEdit": false,
                    "orginalEditButton": false,
                    "SO": false,
                    "LCNo": false
                };
                this.getView().setModel(new JSONModel(properties), "myPropertyValues");
                this.propertyValues = this.getView().getModel("myPropertyValues");
            },
            onCopyFromOriginalLinkPress: function () {
                var originalItemPaylod = this.getView().getModel("oModelForItemTable").getData();
                for (var i = 0; i < originalItemPaylod.results.length; i++) {
                    originalItemPaylod.results[i].LineType = 'A';
                }

                this.getView().setModel(new JSONModel(originalItemPaylod), "oModelForAmmendItemTable");
            },
            onEditTheOriginal: function () {
                this.originalChanged = true;
                this.propertyValues.setProperty("/ammend", false);
                this.propertyValues.setProperty("/orginalEditButton", true);
                this.propertyValues.setProperty("/orginalEdit", true);
            },
            // On edit button action
            onEditPress: function () {
                this.propertyValues.setProperty("/edit", true);
                this.propertyValues.setProperty("/view", false);
                this.propertyValues.setProperty("/editButton", false);
                this.propertyValues.setProperty("/footer", true);
                this.propertyValues.setProperty("/update", true);
                this.propertyValues.setProperty("/new", false);
                this.propertyValues.setProperty("/po", false);
                this.propertyValues.setProperty("/orginalEdit", false);
                this.propertyValues.setProperty("/orginalEditButton", true);
                this.propertyValues.setProperty("/ammend", true);


            },


            // All get calls
            getCallForLCDetails: function (sPathOfLCDetails, sPathOfLCItemsDetails) {
                this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read(sPathOfLCDetails, {
                    success: function (Data) {
                        this.getView().getModel("oModelForHeader").setData(Data);
                        this.getCallForLCItemsDetails(sPathOfLCItemsDetails);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            getCallForLCItemsDetails: function (sPathOfLCItemsDetails) {
                this.getOwnerComponent().getModel().read(sPathOfLCItemsDetails, {
                    success: function (Data) {
                        this.propertyValues.setProperty("/view", true);
                        this.propertyValues.setProperty("/editButton", true);
                        var oDataOriginal = {
                            results: []
                        };
                        var oDataAmmend = {
                            results: []
                        };
                        for (let index = 0; index < Data.results.length; index++) {
                            const element = Data.results[index];
                            if (element.LineType === 'O') {
                                oDataOriginal.results.push(element);
                            } else if (element.LineType === 'A') {
                                oDataAmmend.results.push(element)
                            }

                        }
                        this.getView().getModel("oModelForItemTable").setData(oDataOriginal);
                        this.propertyValues.setProperty("/title", "LC export original - Items(" + oDataOriginal.results.length + ")");

                        if (oDataAmmend.results.length < 1) {
                            this.freshAmmend = true;
                        } else {
                            this.freshAmmend = false;
                        }

                        this.getView().getModel("oModelForAmmendItemTable").setData(oDataAmmend);
                        this.propertyValues.setProperty("/titleAmmend", "LC export ammend - Items(" + oDataAmmend.results.length + ")");

                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            //Start:All F4 Logic
            // Start: SO
            // on Value Help(F4)
            onSOValueHelp: function () {
                if (!this.SOFrag) {
                    this.SOFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.loc.export.locexport.view.fragments.View2.valueHelps.valueHelp_SO",
                        this
                    );
                    this.getView().addDependent(this.SOFrag);
                    var sService = "/sap/opu/odata/sap/ZF4_RI_SO_DETAILS_SRV_B";
                    var oModelSO = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.SOFrag.setModel(oModelSO);
                    this._SOTemp = sap.ui
                        .getCore()
                        .byId("idSLSOValueHelp")
                        .clone();

                }

                this.SOFrag.open();
                var aFilter = [];
                var sPath = "/ZF4_RI_SO_DETAILS";
                sap.ui.getCore().byId("idSDSOF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._SOTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_SO: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZF4_RI_SO_DETAILS";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("SalesOrder", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._SOTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_SO: function (oEvent) {


                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForHeader").setProperty("/SalesOrder", sSelectedValue.toString());


                var sService = "/sap/opu/odata/sap/ZF4_RI_SO_DETAILS_SRV_B";
                var oModelItem = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );

                var sPath = oEvent.getParameter('selectedItem').getBindingContextPath()
                this.getView().setBusy(true);
                oModelItem.read(sPath, {

                    success: function (Data) {
                        var index = 0;
                        this.getView().setModel(new JSONModel(this.itemPayload), "oModelForItemTable");
                        var aItemsPayload = this.getView().getModel("oModelForItemTable").getData().results;
                        aItemsPayload[index].LcNo = this.getView().getModel("oModelForHeader").getProperty("/LcNo");
                        aItemsPayload[index].SalesOrder = this.getView().getModel("oModelForHeader").getProperty("/SalesOrder");
                        aItemsPayload[index].Posnr = Data.SalesOrderItem;
                        aItemsPayload[index].Matnr = Data.Material;
                        aItemsPayload[index].MatDesc = Data.MaterialText;
                        aItemsPayload[index].Meins = Data.OrderQuantityUnit;
                        aItemsPayload[index].LcQty = Data.OrderQuantity;
                        aItemsPayload[index].LcCurrency = Data.TransactionCurrency;
                        aItemsPayload[index].UnitPrice = Data.NetPriceQuantity;
                        var TotValue = (Data.OrderQuantity * Data.NetPriceQuantity).toFixed(2);
                        aItemsPayload[index].TotalVal = TotValue.toString();
                        this.getView().getModel("oModelForItemTable").refresh();
                        this.propertyValues.setProperty("/itemTableVisiblity", true);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // End: SO

            // On Cancel button action
            onCancel: function () {
                if (this.page === "null") {
                    sap.m.MessageBox.warning("Discard this object?", {
                        actions: ["Discard", sap.m.MessageBox.Action.CANCEL],
                        emphasizedAction: "Discard",
                        onClose: function (sAction) {
                            if (sAction === "Discard") {
                                window.history.go(-1);
                            }
                        }
                    });
                } else {
                    this.originalChanged = false;
                    this.propertyValues.setProperty("/edit", false);
                    this.propertyValues.setProperty("/view", true);
                    this.propertyValues.setProperty("/editButton", true);
                    this.propertyValues.setProperty("/footer", false);
                }

            },

            // Start: Menu
            openPersoDialog: function (oEvt) {
                const oTable = this.byId("table");

                Engine.getInstance().show(oTable, ["Columns", "Sorter", "Groups", "Filter"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },
            // End: Menu

            // All post call
            // On Create
            onCreateButtonPress: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_LCEXP_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();
                this.postCallForHeader(oModel, sPath, payload);
            },
            validation: function (headerPayload) {

                if (!headerPayload.LcNo) {
                    MessageBox.error("Please enter LC Number");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpLcNo")).setValueState("Error");
                    return false;
                } else if (!headerPayload.SalesOrder) {
                    MessageBox.error("Please select Sales Order");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpLcNo")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpSalesOrder")).setValueState("Error");

                    return false;
                }
                else if (!headerPayload.ShipmetLastDateOri) {
                    MessageBox.error("Please enter Shipment Last Date Original");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpSalesOrder")).setValueState("None");
                    return false;
                }
                else if (!headerPayload.LatestDocumentDateOri) {
                    MessageBox.error("Please enter Latest Document Date Original");
                    return false;
                }
                else if (!headerPayload.ShipmetLastDateAmend) {
                    MessageBox.error("Please enter Shipment Last Date Amendment ");
                    return false;
                }
                else if (!headerPayload.LatestDocumentDateAmend) {
                    MessageBox.error("Please enter Latest Document Date Amendment");
                    return false;
                }
                else if (!headerPayload.LcIssueDateAmend) {
                    MessageBox.error("Please enter LC Issue Date Amendment");
                    return false;
                }
                else if (!headerPayload.ToleranceQtyP) {
                    MessageBox.error("Please enter Tolerance Qty %");
                    return false;
                }
                else if (!headerPayload.LcExpiryDateOriginal) {
                    MessageBox.error("Please enter LC Expiry Date Original ");
                    return false;
                }
                else if (!headerPayload.LcIssueDateOriginal) {
                    MessageBox.error("Please enter LC issue Date Original ");
                    return false;
                }
                else if (!headerPayload.LcRecevingDateOriginal) {
                    MessageBox.error("Please enter LC Receving Date Original ");
                    return false;
                }
                else if (!headerPayload.LcExpiryDateAmendment) {
                    MessageBox.error("Please enter LC Expiry Date Amendment ");
                    return false;
                }
                else if (!headerPayload.LcRecevingDateAmendment) {
                    MessageBox.error("Please enter LC Receving Date Amendment ");
                    return false;
                }
                else if (!headerPayload.LcValue) {
                    MessageBox.error("Please enter LC Value ");
                    return false;
                }
                else if (!headerPayload.ToleranceValueP) {
                    MessageBox.error("Please enter Tolerance Value % ");
                    return false;
                }
                else {
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpLcNo")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsEdit", "idInpSalesOrder")).setValueState("None");
                    return true;

                }
            },

            // All post calls
            postCallForHeader: function (oModel, sPath, payload) {
                var validation = this.validation(payload);
                if (validation === true) {
                    //Create Call
                    this.getView().setBusy(true);

                    oModel.create(sPath, payload, {
                        success: function (oData, response) {
                            var payloadItem = this.getView().getModel("oModelForItemTable").getData().results;
                            var sPathItems = "/ZRC_LCEXP_HEAD('" + oData.LcNo + "')/to_Item";
                            this.LcNo = oData.LcNo;
                            for (var i = 0; i < payloadItem.length; i++) {
                                payloadItem[i].LineType = 'O';
                            }
                            this.postCallForItem(oModel, sPathItems, payloadItem, "created")

                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });
                }
            },
            postCallForItem: function (oModel, sPath, aPayload, Action) {
                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) {
                    promise = promise.then(function () { return that._promisecreateCallForEachItem(oModel, sPath, Payload, Action) });
                });
                promise.then(function () {

                })
                    .catch(function () {

                    })

            },
            _promisecreateCallForEachItem: function (oModel, sPath, Payload, Action) {
                var that = this;

                oModel.create(sPath, Payload, {
                    success: function (oData, response) {
                        this.getView().setBusy(false);
                        sap.m.MessageBox.success("LC Number  " + that.LcNo + " " + Action + "", {
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: "OK",
                            onClose: function (sAction) {
                                if (sAction === "OK") {
                                    window.history.go(-1);
                                }
                            }
                        });


                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            // All update calls

            // Header
            onSaveButtonPress: function () {
                var oModel = this.getOwnerComponent().getModel();
                var payload = this.getView().getModel("oModelForHeader").getData();
                this.LcNo = payload.LcNo;
                var sPath = "/ZRC_LCEXP_HEAD('" + payload.LcNo + "')"
                this.updateCallForHeader(oModel, sPath, payload);
            },
            updateCallForHeader: function (oModel, sPath, payload) {
                this.LcNo = payload.LcNo;
                var that = this;
                delete payload['to_item'];

                //update Call
                this.getView().setBusy(true);
                oModel.update(sPath, payload, {
                    success: function (oData, response) {
                        var aPayload = this.getView().getModel("oModelForItemTable").getData().results;

                        var payloadAmmendItems = this.getView().getModel("oModelForAmmendItemTable").getData().results;
                        var sPathItems = "/ZRC_LCEXP_HEAD('" + this.LcNo + "')/to_Item";

                        if (payloadAmmendItems.length > 0 && this.freshAmmend === true) {
                            this.postCallForItem(oModel, sPathItems, payloadAmmendItems, "items amended");
                        } else {
                            if (payloadAmmendItems.length > 0 && this.originalChanged === false) {
                                aPayload = [];
                                for (let index = 0; index < payloadAmmendItems.length; index++) {
                                    const element = payloadAmmendItems[index];
                                    aPayload.push(element);
                                }
                            }
                            this.updateCallForItem(oModel, aPayload);
                        }

                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            updateCallForItem: function (oModel, aPayload) {

                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) {
                    var sPath = "/ZC_LCEXP_ITEM(LcNo='" + Payload.LcNo + "',SalesOrder='" + Payload.SalesOrder + "',Posnr='" + Payload.Posnr + "',LineType='" + Payload.LineType + "')";
                    promise = promise.then(function () { return that._promiseUpdateCallForEachItem(oModel, sPath, Payload) });
                });
                promise.then(function () {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("LC Number  " + that.LcNo + " updated", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                window.history.go(-1);
                            }
                        }
                    });

                })
                    .catch(function () {
                        that.getView().setBusy(false);
                    })

            },
            _promiseUpdateCallForEachItem: function (oModel, sPath, Payload) {
                var that = this;
                oModel.update(sPath, Payload, {
                    success: function (oData, response) {



                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

        })
    });