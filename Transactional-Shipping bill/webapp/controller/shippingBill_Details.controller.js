sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Item",
    'sap/ui/core/IconPool',
    'sap/ui/core/library',
    'sap/m/Link',
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/m/Bar',
    'sap/m/Title'
],
    function (Controller,
        Fragment,
        JSONModel,
        Filter,
        FilterOperator,
        MessageBox,
        DateFormat,
        Item,
        IconPool, coreLibrary, Link, MessageItem, MessageView, Button, Dialog, Bar, Title) {
        "use strict";
        // shortcut for sap.ui.core.TitleLevel
        var TitleLevel = coreLibrary.TitleLevel;
        return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.shippingBill_Details", {

            onInit: function () {

                this.createLocalJSONModels();
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);
                this.messagehandler();

            },
            onRouteMatched: function (oEvent) {

                var billNo = oEvent.getParameter("arguments").billNo;
                this.page = billNo;
                if (billNo === "null") {
                    this.createLocalJSONModels();
                    this.setCurrentDateTime();
                    this.onEditPress();
                    this.getView().byId("_IDGenObjectPageHeader1").setObjectTitle("Creat new shipping bill");
                    this.getView().getModel("oEditableModel").setProperty("/update", false);
                    this.getView().getModel("oEditableModel").setProperty("/save", true);
                    this.getView().getModel("oEditableModel").setProperty("/new", true);
                    this.getView().getModel("oEditableModel").setProperty("/itemTableVisiblity", false);

                } else {
                    this.getView().byId("_IDGenObjectPageHeader1").setObjectTitle(billNo);
                    var oModel = this.getOwnerComponent().getModel();
                    var sPath = "/ZRC_SHIP_BILL_HEAD('" + billNo + "')";
                    this.getCall(oModel, sPath);
                    this.onCancel();
                    this.getView().getModel("oEditableModel").setProperty("/update", true);
                    this.getView().getModel("oEditableModel").setProperty("/save", false);
                    this.getView().getModel("oEditableModel").setProperty("/new", false);
                    this.getView().getModel("oEditableModel").setProperty("/itemTableVisiblity", true);
                }
            },
            createLocalJSONModels: function () {

                // for Header details
                var payloadForHeader = {
                    "ZshippingBillNo": "",
                    "ZinvoiceDocument": "",
                    "ZportOfLoading": "",
                    "Zcha": "",
                    "Zcustomer": "",
                    "ZletExportDate": "",
                    "Zschemes": "",
                    "Zepcg": "",
                    "Zloc": "",
                    "ZshippingBillStatus": "",
                    "ZshippingBillDate": "",
                    "ZstateOfOrigin": "",
                    "ZdestinationCountry": "",
                    "ZforeignCurrency": "",
                    "FobValueFc": "",
                    "ZfobValue": "",
                    // "ZexchangeRate": "",
                    "Zrodtep": "",
                    "ZcontainerNo": "",
                    "ZcreateDate": "",
                    "ZcreateTime": "",
                    "ZcreateBy": "",
                    "to_item": {

                    }

                }
                var oModelForHeader = new JSONModel(payloadForHeader);
                this.getView().setModel(oModelForHeader, "oModelForHeader");
                // for Items and Licenses details

                // for Licenses details
                var aEachItemsLic = {
                    "results": [{
                        "Item": "",
                        "Material": "",
                        "Licences": "",
                        "Quantity": "",
                        "Value": ""
                    }]
                };
                var payloadForItem = {
                    "results": [
                        {
                            "Item": "",
                            "Material": "",
                            "ItemDescription": "",
                            "Uom": "",
                            "InvoiceQty": "",
                            "InvoiceValue": "",
                            "Commission": "",
                            "Insurance": "",
                            "Freight": "",
                            "Licenses": aEachItemsLic
                        }
                    ]
                };
                var oModelForItems = new JSONModel(payloadForItem);
                this.getView().setModel(oModelForItems, "oModelForItems");



                var oModelForLicenses = new JSONModel();
                this.getView().setModel(oModelForLicenses, "oModelForLicenses");

                var oEditableModel = new JSONModel({
                    "sEditable": false,
                    "edit": false,
                    "view": false,
                    "save": false,
                    "update": false,
                    "new": false
                });
                this.getView().setModel(oEditableModel, "oEditableModel");

            },
            setCurrentDateTime: function () {


                var currentDateTime = new Date();
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateDate", currentDateTime)
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateTime", currentDateTime)



            },
            onEditPress: function () {
                this.screenType = "edit";

                this.getView().byId("idBtnEdit").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection1").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection1Edit").setVisible(true);
                this.getView().byId("IdOPSHeaderDetailsSubSection2View").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection2Edit").setVisible(true);
                this.getView().byId("AssignmentDetailsSubSectionView").setVisible(false);
                this.getView().byId("AssignmentDetailsSubSection").setVisible(true);
                // this.getView().byId("idBtnCreateItem").setVisible(true);
                this.getView().byId("idV2Bar").setVisible(true);
                this.getView().getModel("oEditableModel").setProperty("/sEditable", true);
                this.getView().getModel("oEditableModel").setProperty("/edit", true);
                this.getView().getModel("oEditableModel").setProperty("/view", false);



            },
            onCancel: function () {
                this.screenType = "cancel";

                if (this.page === "null") {
                    window.history.go(-1);
                } else {
                    this.getView().byId("idBtnEdit").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection1").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection1Edit").setVisible(false);
                    this.getView().byId("IdOPSHeaderDetailsSubSection2View").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection2Edit").setVisible(false);

                    this.getView().byId("AssignmentDetailsSubSectionView").setVisible(true);
                    this.getView().byId("AssignmentDetailsSubSection").setVisible(false);
                    // this.getView().byId("idBtnCreateItem").setVisible(false);
                    this.getView().byId("idV2Bar").setVisible(false);
                    this.getView().getModel("oEditableModel").setProperty("/sEditable", false);
                    this.getView().getModel("oEditableModel").setProperty("/edit", false);
                    this.getView().getModel("oEditableModel").setProperty("/view", true);
                }




            },

            //Start:All F4 Logic
            // Start: Invoice Number
            // on Value Help(F4)
            onInvoiceNumberValueHelp: function () {
                if (!this.InvoiceNumFrag) {
                    this.InvoiceNumFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_InvoiceNumber",
                        this
                    );
                    this.getView().addDependent(this.InvoiceNumFrag);
                    var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                    var oModelInvoiceNumber = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.InvoiceNumFrag.setModel(oModelInvoiceNumber);
                    this._InvoiceNumberTemp = sap.ui
                        .getCore()
                        .byId("idSLInvoiceNumberValueHelp")
                        .clone();
                    this._oTempInvoiceNumber = sap.ui
                        .getCore()
                        .byId("idSLInvoiceNumberValueHelp")
                        .clone();
                }

                this.InvoiceNumFrag.open();
                var aFilter = [];
                // var oFilter = new Filter(
                //     [new Filter("BillingDocument", FilterOperator.EQ, "90000000")],
                //     false
                // );

                // aFilter.push(oFilter);

                sap.ui.getCore().byId("idSDInvoiceNumberF4").bindAggregation("items", {
                    path: "/ZV_BILLING_INV_DETAILS",
                    filters: aFilter,
                    template: this._InvoiceNumberTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_invoiceNumber: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZV_BILLING_INV_DETAILS";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("BillingDocument", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._oTempInvoiceNumber,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_invoiceNumber: function (oEvent) {
                // this.JSONModelPayload = this.getView().getModel("oModelForHeader");

                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                var sPath = "/ZV_BILLING_INV_DETAILS";
                var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                var oModelForItems = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );

                this.getView().getModel("oModelForHeader").setProperty("/ZinvoiceDocument", sSelectedValue.toString());

                // To get Items details
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("BillingDocument", FilterOperator.EQ, sSelectedValue)],
                    false
                );

                aFilters.push(oFilter);





                this.getView().setBusy(true);
                oModelForItems.read(sPath, {
                    filters: aFilters,
                    success: function (Data) {

                        // oModelForItems

                        var aHeadLen = Data.results.length;

                        for (let index = 0; index < aHeadLen; index++) {

                            var aItemsPayload = this.getView().getModel("oModelForItems").getData().results;
                            aItemsPayload[index].Item = Data.results[index].BillingDocumentItem;
                            aItemsPayload[index].Material = Data.results[index].Material;
                            aItemsPayload[index].ItemDescription = Data.results[index].ProductDescription;
                            aItemsPayload[index].Uom = Data.results[index].BaseUnit;
                            aItemsPayload[index].InvoiceQty = Data.results[index].BillingQuantity;
                            aItemsPayload[index].InvoiceValue = Data.results[index].GrossAmount;



                        }
                        this.getView().getModel("oModelForItems").refresh();
                        this.getView().getModel("oEditableModel").setProperty("/itemTableVisiblity", true);

                        // oModelForHeader
                        this.getView().getModel("oModelForHeader").getData().Zcustomer = Data.results[0].SoldToParty;
                        this.getView().getModel("oModelForHeader").getData().ZfobValue = Data.results[0].TotalNetAmount;
                        var FobValueFc = Number(Data.results[0].TotalNetAmount) * Number(Data.results[0].AccountingExchangeRate)
                        this.getView().getModel("oModelForHeader").getData().FobValueFc = FobValueFc.toFixed(2).toString();
                        this.getView().getModel("oModelForHeader").refresh();


                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // End: Invoice Number

            // Start: Country of BL
            // on Value Help(F4)
            onCountryOfBLValueHelp: function () {
                if (!this.CountryOfBLFrag) {
                    this.CountryOfBLFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_CountryOfBL",
                        this
                    );
                    this.getView().addDependent(this.CountryOfBLFrag);
                    var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                    var oModelCountryOfBL = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.CountryOfBLFrag.setModel(oModelCountryOfBL);
                    this._CountryOfBLTemp = sap.ui
                        .getCore()
                        .byId("idSLCountryOfBLValueHelp")
                        .clone();

                }

                this.CountryOfBLFrag.open();
                var aFilter = [];
                var sPath = "/I_CountryText";
                sap.ui.getCore().byId("idSDCountryOfBLF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._CountryOfBLTemp,
                });

            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_CountryOfBL: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("CountryName", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },

            // on Value Help - Confirm
            onValueHelpConfirm_CountryOfBL: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    // sSelectedValue = oSelectedItem.getProperty("title"),
                    sSelectedValue = oSelectedItem.getBindingContext().getProperty("Country");
                this.getView().getModel("oModelForHeader").setProperty("/CountryOfBl", sSelectedValue.toString());

            },
            // End: Country of BL
            // Start: ICD - Port Code
            onICDValueHelp: function () {
                if (!this.ICDFrag) {
                    this.ICDFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_ICD",
                        this
                    );
                    this.getView().addDependent(this.ICDFrag);
                    var sService = "/sap/opu/odata/sap/ZRI_PORT_LIST_SRV_B/";
                    var oModelICD = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.ICDFrag.setModel(oModelICD);
                    this._ICDTemp = sap.ui
                        .getCore()
                        .byId("idSLICDValueHelp")
                        .clone();

                }

                this.ICDFrag.open();
                var aFilter = [];
                var sPath = "/ZRI_PORT_LIST";
                sap.ui.getCore().byId("idSDICDF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._ICDTemp,
                });

            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_ICD: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("PortCode", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },

            // on Value Help - Confirm
            onValueHelpConfirm_ICD: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getBindingContext().getProperty("PortCode");
                this.getView().getModel("oModelForHeader").setProperty("/IcdPortCode", sSelectedValue.toString());

            },
            // End: ICD - Port Code

            // Start: Port Of Loading
            onportOfLoadingValueHelp: function () {
                if (!this.portOfLoadingFrag) {
                    this.portOfLoadingFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_portOfLoading",
                        this
                    );
                    this.getView().addDependent(this.portOfLoadingFrag);
                    var sService = "/sap/opu/odata/sap/ZRI_PORT_LIST_SRV_B/";
                    var oModelportOfLoading = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.portOfLoadingFrag.setModel(oModelportOfLoading);
                    this._portOfLoadingTemp = sap.ui
                        .getCore()
                        .byId("idSLportOfLoadingValueHelp")
                        .clone();

                }

                this.portOfLoadingFrag.open();
                var aFilter = [];
                var sPath = "/ZRI_PORT_LIST";
                sap.ui.getCore().byId("idSDportOfLoadingF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._portOfLoadingTemp,
                });

            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_portOfLoading: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("ZportOfLoading", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },

            // on Value Help - Confirm
            onValueHelpConfirm_portOfLoading: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getBindingContext().getProperty("PortCode");
                this.getView().getModel("oModelForHeader").setProperty("/ZportOfLoading", sSelectedValue.toString());

            },
            // End: Port Of Loading

            // Start: CHA
            onCHAValueHelp: function () {
                if (!this.CHAFrag) {
                    this.CHAFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_CHA",
                        this
                    );
                    this.getView().addDependent(this.CHAFrag);
                    var sService = "/sap/opu/odata/sap/ZF4_RI_CHA_SRV_B/";
                    var oModelCHA = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.CHAFrag.setModel(oModelCHA);
                    this._CHATemp = sap.ui
                        .getCore()
                        .byId("idSLCHAValueHelp")
                        .clone();

                }

                this.CHAFrag.open();
                var aFilter = [];
                var sPath = "/ZF4_RI_CHA";
                sap.ui.getCore().byId("idSDCHAF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._CHATemp,
                });

            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_CHA: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("ZCHA", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },

            // on Value Help - Confirm
            onValueHelpConfirm_CHA: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getBindingContext().getProperty("Supplier");
                this.getView().getModel("oModelForHeader").setProperty("/Zcha", sSelectedValue.toString());

            },
            // End: CHA

            // Start: Country
            onDestinationCountryValueHelp: function () {
                if (!this.DestinationCountryFrag) {
                    this.DestinationCountryFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_DestinationCountry",
                        this
                    );
                    this.getView().addDependent(this.DestinationCountryFrag);
                    var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                    var oModelDestinationCountry = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.DestinationCountryFrag.setModel(oModelDestinationCountry);
                    this._DestinationCountryTemp = sap.ui
                        .getCore()
                        .byId("idSLDestinationCountryValueHelp")
                        .clone();

                }

                this.DestinationCountryFrag.open();
                var aFilter = [];
                var sPath = "/I_CountryText";
                sap.ui.getCore().byId("idSDDestinationCountryF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._DestinationCountryTemp,
                });


            },
            // on Value Help - Search/liveChange
            onValueHelpSearch_DestinationCountry: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("CountryName", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },
            // on Value Help - Confirm
            onValueHelpConfirm_DestinationCountry: function (oEvent) {

                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    // sSelectedValue = oSelectedItem.getProperty("title"),
                    sSelectedValue = oSelectedItem.getBindingContext().getProperty("Country");
                this.getView().getModel("oModelForHeader").setProperty("/ZdestinationCountry", sSelectedValue.toString());

            },
            // End: Country


            //End:All F4 Logic

            diff: function (obj1, obj2) {
                const result = {};
                if (Object.is(obj1, obj2)) {
                    return undefined;
                }
                if (!obj2 || typeof obj2 !== 'object') {
                    return obj2;
                }

                Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
                    if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {

                        result[key] = obj2[key];
                    }
                    if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                        const value = this.diff(obj1[key], obj2[key]);
                        if (value !== undefined) {

                            result[key] = value;
                        }
                    }
                });
                return result;
            },
            onLicenseDetails: function (oEvent) {

                var oView = this.getView();
                if (!this._oFragmentavail) {
                    this._oFragmentavail = sap.ui.xmlfragment("idFragmentLicenses", "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.eachItemLicenseDetails", this);
                    oView.addDependent(this._oFragmentavail);
                }

                this._oFragmentavail.open();
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var ZshippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var Item;
                var Quantity;
                var sItemSPath = oEvent.getSource().getParent().oBindingContexts.oModelForItems.sPath;
                Item = this.getView().getModel("oModelForItems").getContext(sItemSPath).getProperty('Item');
                Quantity = this.getView().getModel("oModelForItems").getContext(sItemSPath).getProperty('InvoiceQty')
                var Material = this.getView().getModel("oModelForItems").getContext(sItemSPath).getProperty('Material')
                this.Quantity = Quantity;
                this.Material = Material;
                this.Item = Item;
                // if (this.screenType === "edit") {
                //     
                //     Item = oEvent.getSource().getParent().getCells()[0].getValue();
                //     Quantity = oEvent.getSource().getParent().getCells()[4].getValue();
                //     // Material
                // } else {
                //     Item = oEvent.getSource().getParent().getCells()[0].getText();
                //     Quantity = oEvent.getSource().getParent().getCells()[4].getText();
                //     // Material
                // }



                if (this.page === "null") {

                    var aItemPayload = this.getView().getModel("oModelForItems").getData();
                    for (let index = 0; index < aItemPayload.results.length; index++) {
                        const element = aItemPayload.results[index];
                        if (element.Item === Item) {

                            var aItemLicPayload = element.Licenses.results;
                            for (var i = 0; i < aItemLicPayload.length; i++) {
                                aItemLicPayload[i].Item = Item;
                                aItemLicPayload[i].Quantity = Quantity;
                                aItemLicPayload[i].Material = Material
                            }
                            this.getView().getModel("oModelForLicenses").setData(element.Licenses);
                        }

                    }



                    // var nLicItemLen = 0;
                    // if (this.getView().getModel("oModelForLicenses").getData().results) {

                    //     var aLicTemp = this.getView().getModel("oModelForLicenses").getData();
                    //     var nLicTempLen = aLicTemp.length;
                    //     var nLicFinalPayloadLen = this.oLicFinalPayload;
                    //     // if (_.isEqual(aLicTemp, this.oLicFinalPayload)) {

                    //     // } else {
                    //     //     var diff = this.diff(aLicTemp, this.oLicFinalPayload);
                    //     // }
                    //     // 
                    //     this.getView().getModel("oModelForLicenses").setData(this.oLicFinalPayload);
                    //     nLicItemLen = this.getView().getModel("oModelForLicenses").getData().results.length;
                    // } else {

                    //     // for Licenses details
                    //     var aEachItemsLic = {
                    //         "results": [{
                    //             "Item": Item,
                    //             "Material": "",
                    //             "Licences": "",
                    //             "Quantity": "",
                    //             "Value": ""
                    //         }]
                    //     };

                    //     this.oLicFinalPayload = aEachItemsLic;
                    //     this.getView().getModel("oModelForLicenses").setData(aEachItemsLic);
                    // }
                    // // come back here
                    // if (nLicItemLen > 0) {
                    //     var aLicItems = this.getView().getModel("oModelForLicenses").getData();
                    //     this.oLicFinalPayload = aLicItems;
                    //     var oClickedLicItem = {
                    //         "results": []
                    //     }
                    //     for (let index = 0; index < nLicItemLen; index++) {
                    //         const element = aLicItems.results[index];
                    //         if (element.Item === Item) {
                    //             // this.oLicFinalPayload.results.push(element);
                    //             oClickedLicItem.results.push(element);
                    //         }
                    //     }
                    //     if (oClickedLicItem.results.length > 0) {

                    //         this.getView().getModel("oModelForLicenses").setData(oClickedLicItem);
                    //     } else {
                    //         var oLicItem = {
                    //             "Item": Item,
                    //             "Material": "",
                    //             "Licences": "",
                    //             "Quantity": "",
                    //             "Value": ""
                    //         }
                    //         oClickedLicItem.results.push(oLicItem);
                    //         this.oLicFinalPayload.results.push(oLicItem);
                    //         this.getView().getModel("oModelForLicenses").setData(oClickedLicItem);

                    //     }

                    //     this.getView().getModel("oModelForLicenses").refresh();
                    // }


                } else {
                    this.getView().getModel("oModelForLicenses").setData({});
                    this.shippingBillNoForLicDelete = ZshippingBillNo;
                    var sPath = "/ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + ZshippingBillNo + "',Item='" + Item + "')/to_SubItem";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        success: function (Data) {
                            this.getView().getModel("oModelForLicenses").setData(Data);
                            var aItemPayload = this.getView().getModel("oModelForItems").getData();
                            for (let index = 0; index < aItemPayload.results.length; index++) {
                                const element = aItemPayload.results[index];
                                if (Data.results.length > 0) {
                                    if (element.Item === Data.results[0].Item) {
                                        element.Licenses = Data;
                                    }
                                }
                            }

                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });
                }

            },
            onQuantityInputLiveChange: function (oEvent) {
                this.Quantity;
                var aLicPayload = this.getView().getModel("oModelForLicenses").getData().results;
                var sumQuanity = 0;
                for (var i = 0; i < aLicPayload.length; i++) {
                    sumQuanity = sumQuanity + Number(aLicPayload[i].Quantity)
                }
                if (Number(this.Quantity) < sumQuanity) {
                    MessageBox.error('Quantity exceeds limit');
                    oEvent.getSource().setValue('');
                }
            },
            onLicenseDialogClose: function () {

                if (this.page != "null") {
                    var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                    var aLicePayload = this.getView().getModel("oModelForLicenses").getData();
                    if (aLicePayload.results.length > 0) {
                        for (var i = 0; i < aItemPaylod.results.length; i++) {
                            if (aLicePayload.results[0].Item === aItemPaylod.results[i].Item) {
                                aItemPaylod.results[i].Licenses = aLicePayload;
                            }
                        }
                    }
                }

                this._oFragmentavail.close();

            },

            removeObjectWithEmptyString: function (array) {
                return array.filter(obj => {
                    for (const value of Object.values(obj)) {
                        if (value === '') {
                            return false;
                        }
                    }
                    return true;
                })
            },



            getCall: function (oModel, sPath) {
                this.getView().setBusy(true);
                // Get call
                oModel.read(sPath, {
                    success: function (Data) {

                        this.getView().getModel("oModelForHeader").setData(Data);
                        var sPath = "/ZRC_SHIP_BILL_HEAD('" + Data.ZshippingBillNo + "')/to_item"

                        this.getView().getModel().read(sPath, {
                            success: function (Data) {
                                this.getView().getModel("oModelForItems").setData(Data);
                                this.getView().setBusy(false);
                            }.bind(this),
                            error: function (oError) {
                                this.getView().setBusy(false);
                            }.bind(this)
                        });

                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);

                    }.bind(this)
                });
            },
            onAddNewEmptyItem: function () {
                var JSONData = this.getView()
                    .getModel("oModelForItems")
                    .getData();
                var Item = 10 * (JSONData.results.length + 1);
                // for Licenses details
                var aEachItemsLic = {
                    "results": [{
                        "Item": "",
                        "Material": "",
                        "Licences": "",
                        "Quantity": "",
                        "Value": ""
                    }]
                };
                var payloadForItem = {
                    "Item": Item.toString(),
                    "Material": "",
                    "ItemDescription": "",
                    "Uom": "",
                    "InvoiceQty": "",
                    "InvoiceValue": "",
                    "Commission": "",
                    "Insurance": "",
                    "Freight": "",
                    "Licenses": aEachItemsLic
                };
                JSONData.results.push(payloadForItem);
                this.getView()
                    .getModel("oModelForItems")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },

            onDelete: function (oEvent) {

                var selectedItem = oEvent.getParameter('row').getAggregation('cells')[0].getValue();

                var JSONData = this.getView().getModel("oModelForItems").getData();
                if (JSONData.results.length > 1) {
                    for (var i = 0; i < JSONData.results.length; i++) {
                        if (JSONData.results[i].Item === selectedItem) {
                            var j = i;
                            sap.m.MessageBox.error("Delete item  " + selectedItem + "?", {
                                actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                                emphasizedAction: "Delete",
                                onClose: function (sAction) {
                                    if (sAction === "Delete") {
                                        JSONData.results.splice(j, 1);
                                        this.getView()
                                            .getModel("oModelForItems")
                                            .setData(JSON.parse(JSON.stringify(JSONData)));
                                    }
                                }.bind(this)
                            })

                        }
                    }

                } else {
                    MessageBox.error("Atlease one entry is required");
                }


            },

            onAddNewEmptyLicense: function () {
                // this.Quantity = Quantity;

                var Item = this.Item;
                var Material = this.Material;
                var aItemPayload = this.getView().getModel("oModelForItems").getData();
                for (let index = 0; index < aItemPayload.results.length; index++) {
                    const element = aItemPayload.results[index];
                    if (element.Item === Item) {
                        var JSONData = aItemPayload.results[index].Licenses;
                    }

                }

                // var JSONData = this.getView()
                //     .getModel("oModelForLicenses")
                //     .getData();


                // var Item = this.getView().getModel("oModelForLicenses").getData().results[0].Item;

                var oEachItemsLic = {
                    "Item": Item,
                    "Material": Material,
                    "Licences": "",
                    "Quantity": "",
                    "Value": "",
                    "new": "yes"

                };
                JSONData.results.push(oEachItemsLic);

                this.getView()
                    .getModel("oModelForLicenses")
                    .setData(JSONData);

                // this.oLicFinalPayload.results.push(oEachItemsLic);
            },
            onLicenseDelete: function (oEvent) {

                var sLicSPath = oEvent.getSource().getParent().getParent().oBindingContexts.oModelForLicenses.sPath;
                if (this.page === 'null' || this.getView().getModel('oModelForLicenses').getContext(sLicSPath).getProperty('new') === "yes") {
                    var len_aLicModel = this.getView().getModel('oModelForLicenses').getData().results.length;
                    var index = sLicSPath.split('/')[2];
                    if (len_aLicModel < 2) {
                        MessageBox.error("Atleast 1 License detail is mandatory");
                    } else {
                        var localLicNo = this.getView().getModel('oModelForLicenses').getData().results[index].Licences;
                        sap.m.MessageBox.error("Delete licence  " + localLicNo + "?", {
                            actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                            emphasizedAction: "Delete",
                            onClose: function (sAction) {
                                if (sAction === "Delete") {
                                    this.getView().getModel('oModelForLicenses').getData().results.splice(index, 1);
                                    this.getView().getModel('oModelForLicenses').refresh();
                                }
                            }.bind(this)
                        });
                        // delete this.getView().getModel('oModelForLicenses').getData()['results'][index];

                    }

                } else {
                    // ZC_SHIP_BILL_LIC(ZshippingBillNo='001SKT001',Item='10',Licences='101')
                    var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                    var oModelForLicenseDel = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    var ShipNo = this.shippingBillNoForLicDelete,
                        ItemNo = this.getView().getModel('oModelForLicenses').getContext(sLicSPath).getProperty('Item'),
                        LicNo = this.getView().getModel('oModelForLicenses').getContext(sLicSPath).getProperty('Licences');
                    var sPathForLicDelete = "ZC_SHIP_BILL_LIC(ZshippingBillNo='" + ShipNo + "',Item='" + ItemNo + "',Licences='" + LicNo + "')";
                    sap.m.MessageBox.error("Delete licence   " + LicNo + "?", {
                        actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                        emphasizedAction: "Delete",
                        onClose: function (sAction) {
                            if (sAction === "Delete") {
                                this.getView().setBusy(true);
                                oModelForLicenseDel.remove(sPathForLicDelete, {
                                    success: function (smessage) {
                                        sap.m.MessageToast.show("Selected licences Deleted");
                                        this._oFragmentavail.close();
                                        this.getView().setBusy(false);
                                    }.bind(this),
                                    error: function (sError) {
                                        this.getView().setBusy(false);
                                    }.bind(this)
                                });
                            }
                        }.bind(this)
                    });
                }
                this.getView().getModel('oModelForLicenses').refresh();
            },

            onDeleteLicenseItem: function (oEvent) {

                var vLen = oEvent
                    .getSource()
                    .getParent()
                    .getBindingContextPath()
                    .split("/").length;

                var index = Number(
                    oEvent.getSource().getParent().getBindingContextPath().split("/")[
                    vLen - 1
                    ]
                );

                var JSONData = this.getView().getModel("oModelForLicenses").getData();
                if (JSONData.length > 1) {
                    JSONData.splice(index, 1);
                } else {
                    MessageBox.error("Atlease one entry is required");
                }

                this.getView()
                    .getModel("oModelForLicenses")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },

            onAddNewItem: function () {
                var JSONData = this.getView()
                    .getModel("oModelForItems")
                    .getData();
                if (JSONData.length > 0) {
                    MessageBox.error("Only 1 item is allowed for now")
                } else {
                    JSONData.push({ "Item": "10" });
                    this.getView()
                        .getModel("oModelForItems")
                        .setData(JSON.parse(JSON.stringify(JSONData)));
                }

            },

            onItemDeletePress: function () {

            },
            // On Save button action
            onSave: function (oEvent) {

                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_SHIP_BILL_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();

                this.postCallForHeader(oModel, sPath, payload);


            },


            validation: function (headerPayload) {
                if (!headerPayload.ZinvoiceDocument) {
                    MessageBox.error("Please select invoice document number");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", " idZinvoiceDocument.Input")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", " idZinvoiceDocument.Input")).setValueStateText("Please enter invoice document number");
                    return false;
                }
                else if (!headerPayload.IcdPortCode) {
                    MessageBox.error("Please enter ICD - port code");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idZinvoiceDocument.Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idIcdPortCode_Input")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idIcdPortCode_Input")).setValueStateText("Please enter ICD - port Code");
                    return false;
                }
                else if (!headerPayload.ZshippingBillStatus) {
                    MessageBox.error("Please enter shipping bill status");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idIcdPortCode_Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillStatusValue_Select")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillStatusValue_Select")).setValueStateText("Please enter shipping bill status");
                    return false;
                }
                else if (!headerPayload.ZshippingBillDate) {
                    MessageBox.error("Please enter shipping bill date");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idIcdPortCode_Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillStatusValue_Select")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillDate_DatePicker")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillDate_DatePicker")).setValueStateText("Please enter shipping bill date");
                    return false;
                }
                else if (!headerPayload.PortOfDischarge) {
                    MessageBox.error("Please enter port of discharge");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillDate_DatePicker")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfDischarge_Input")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfDischarge_Input")).setValueStateText("Please enter port of discharge");

                    return false;
                }
                else if (!headerPayload.ZportOfLoading) {
                    MessageBox.error("Please enter port of loading");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfDischarge_Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfLoading_Input")).setValueState("Error");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfLoading_Input")).setValueStateText("Please enter port of loading");
                    return false;
                }
                else {
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idZinvoiceDocument.Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillStatusValue_Select")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idShippingBillDate_DatePicker")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfDischarge_Input")).setValueState("None");
                    this.byId(sap.ui.core.Fragment.createId("idFrg_headerDetialsS1Edit", "idPortOfLoading_Input")).setValueState("None");
                    return this.itemsValidation();
                }

            },

            itemsValidation: function () {
                var aPayloadOfItems = this.getView().getModel("oModelForItems").getData().results;
                for (var i = 0; i < aPayloadOfItems.length; i++) {
                    var element = aPayloadOfItems[i];
                    if (!element.Commission) {
                        this.scrollTo(this.byId("IdOPSAssignmentDetailsSection"), this.byId("ObjectPageLayout"));
                        this.byId("ObjectPageLayout").scrollToSection(this.byId("IdOPSAssignmentDetailsSection").getId());
                        MessageBox.error("Please enter Commission at Item details, row no:" + i + 1 + "");
                        return false;
                    } else if (!element.Insurance) {
                        MessageBox.error("Please enter Insurance at Item details row no:" + i + 1 + "");
                        return false;
                    } else if (!element.Freight) {
                        MessageBox.error("Please enter Freight at Item row no:" + i + 1 + "");
                        return false;
                    } else {
                        return true;
                    }
                }



            },

            scrollTo: function (section, opl) {
                const id = section.getId();
                const ready = !!opl.getScrollingSectionId(); // DOM of opl is fully ready
                const fn = () => opl.scrollToSection(id);
                return ready ? fn() : opl.attachEventOnce("onAfterRenderingDOMReady", fn);
            },
            // All post calls
            postCallForHeader: function (oModel, sPath, payload) {
                delete payload['to_item'];

                const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });

                payload.ZcreateTime = dt.format(new Date());

                var validation = this.validation(payload);
                if (validation === true) {
                    //Create Call
                    this.getView().setBusy(true);
                    oModel.create(sPath, payload, {
                        success: function (oData, response) {

                            //var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                            var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                            var oModelForItems = new sap.ui.model.odata.ODataModel(
                                sService,
                                true
                            );

                            this.getView().getModel("oModelForItems").setProperty('oModelForItems>ZshippingBillNo', oData.ZshippingBillNo)
                            // var sPathForItem = "/ZC_SHIP_BILL_ITEM";

                            var payloadOfItems = this.getView().getModel("oModelForItems").getData().results;
                            var _Item = 10;
                            var aPayload = [];
                            for (let index = 0; index < payloadOfItems.length; index++) {
                                Item = _Item * (index + 1);
                                const element = payloadOfItems[index];
                                var payloadOfItem = {
                                    "Item": Item.toString(),
                                    "Material": element.Material,
                                    "ItemDescription": element.ItemDescription,
                                    "Uom": element.Uom,
                                    "InvoiceQty": element.InvoiceQty,
                                    "InvoiceValue": element.InvoiceValue,
                                    // "FobCurrency": "INR",
                                    "Commission": element.Commission,
                                    "Insurance": element.Insurance,
                                    "Freight": element.Freight,
                                    // "FobValue": "106",
                                    // "FobValueFc": "107",
                                    // "FobCurrecnyFc": "INR",
                                    // "RodtepPer": "108",
                                    // "RodtepAmount": "109",
                                    // "ZcreateDate": "\/Date(1728604800000)\/",
                                    // "ZcreateTime": "P00DT13H11M55S",
                                    // "ZcreateBy": "Santosh",
                                    // "RodtepCurrency": "INR"
                                }
                                aPayload.push(payloadOfItem);
                            }

                            var sPathForItem = "ZRC_SHIP_BILL_HEAD('" + oData.ZshippingBillNo + "')/to_item";

                            this.postCallForItem(oModelForItems, sPathForItem, aPayload)
                            // this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });
                }
            },
            postCallForItem: function (oModel, sPath, aPayload) {

                // for (let i = 0; i < aPayload.length; i++) {
                //     if (i === aPayload.length - 1) {
                //         this.getView().setBusy(false);
                //     }
                //     setTimeout(function demo() {
                //         this.createCallForEachItem(i, oModel, sPath, aPayload);
                //     }.bind(this), 10000);

                // }
                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(function () { return that._promisecreateCallForEachItem(oModel, sPath, Payload) });
                });
                promise.then(function () {

                })
                    .catch(function () {

                    })

            },
            _promisecreateCallForEachItem: function (oModel, sPath, Payload) {

                // this.getView().setBusy(true);
                oModel.create(sPath, Payload, {
                    success: function (oData, response) {

                        //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
                        this.onLicenseSave(oData.Item);

                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // createCallForEachItem: function (index, oModel, sPath, aPayload) {

            //     this.getView().setBusy(true);
            //     oModel.create(sPath, aPayload[index], {
            //         success: function (oData, response) {

            //             //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
            //             this.onLicenseSave(oData.Item);

            //         }.bind(this),
            //         error: function (oError) {

            //             this.getView().setBusy(false);
            //         }.bind(this)
            //     });
            // },

            onLicenseSave: function (Item) {
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                // var aLicensePaylod = this.getView().getModel("oModelForLicenses").getData();

                this.shippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var aLicPayload = [];
                var aPath = []
                for (let index = 0; index < aItemPaylod.results.length; index++) {
                    if (aItemPaylod.results[index].Item === Item) {
                        const oItemPaylod = aItemPaylod.results[index];
                        var aLicensePaylod = aItemPaylod.results[index].Licenses
                        for (let j = 0; j < aLicensePaylod.results.length; j++) {
                            const oLicensePaylod = aLicensePaylod.results[j];
                            var sPath = "ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + oHeaderPaylod.ZshippingBillNo + "',Item='" + oItemPaylod.Item + "')/to_SubItem";
                            var oLicPayload = {
                                "Item": oItemPaylod.Item,
                                "ZshippingBillNo": oHeaderPaylod.ZshippingBillNo,
                                "Licences": oLicensePaylod.Licences,
                                "Material": oLicensePaylod.Material,
                                "Quantity": oLicensePaylod.Quantity,
                                "Value": oLicensePaylod.Value
                            };
                            aLicPayload.push(oLicPayload);
                            aPath.push(sPath);
                        }

                    }


                }
                this.getView().setBusy(true);
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForLicense = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );



                // for (let i = 0; i < aLicPayload.length; i++) {
                //     if (i === aLicPayload.length - 1) {
                //         this.getView().setBusy(false);
                //     }
                //     setTimeout(function demo() {

                //         this.createCallForEachItemLic(oModelForLicense, aPath[i], aLicPayload[i]);
                //     }.bind(this), 1500);
                // }

                var that = this;
                var promise = Promise.resolve();
                aLicPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(
                        function () {
                            return that.createCallForEachItemLic(oModelForLicense, aPath[i], Payload)
                        })

                });
                promise.then(function () {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("Shipping bill  " + that.shippingBillNo + " created", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                that.handleDialogPress();


                            }
                        }
                    });
                    // Create ends here
                })
                    .catch(function () {

                    })

            },
            createCallForEachItemLic: function (oModelForLicense, sPath, ItemLicPayload) {

                oModelForLicense.create(sPath, ItemLicPayload, {
                    success: function (oData, response) {

                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            // All update calls

            // Header
            onUpdate: function () {
                var oModel = this.getOwnerComponent().getModel();
                var payload = this.getView().getModel("oModelForHeader").getData();
                var sPath = "/ZRC_SHIP_BILL_HEAD('" + payload.ZshippingBillNo + "')"
                this.updateCallForHeader(oModel, sPath, payload);
            },
            updateCallForHeader: function (oModel, sPath, payload) {
                delete payload['to_item'];
                const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                payload.ZcreateTime = dt.format(new Date());
                //update Call
                this.getView().setBusy(true);
                oModel.update(sPath, payload, {
                    success: function (oData, response) {
                        var payloadOfItems = this.getView().getModel("oModelForItems").getData().results;
                        var _Item = 10;
                        var aPayload = [];
                        for (let index = 0; index < payloadOfItems.length; index++) {
                            Item = _Item * (index + 1);
                            const element = payloadOfItems[index];
                            var payloadOfItem = {
                                "Item": Item.toString(),
                                "Material": element.Material,
                                "ItemDescription": element.ItemDescription,
                                "Uom": element.Uom,
                                "InvoiceQty": element.InvoiceQty,
                                "InvoiceValue": element.InvoiceValue,
                                // "FobCurrency": "INR",
                                "Commission": element.Commission,
                                "Insurance": element.Insurance,
                                "Freight": element.Freight,
                                // "FobValue": "106",
                                // "FobValueFc": "107",
                                // "FobCurrecnyFc": "INR",
                                // "RodtepPer": "108",
                                // "RodtepAmount": "109",
                                // "ZcreateDate": "\/Date(1728604800000)\/",
                                // "ZcreateTime": "P00DT13H11M55S",
                                // "ZcreateBy": "Santosh",
                                // "RodtepCurrency": "INR"
                            }
                            aPayload.push(payloadOfItem);
                        }
                        // ZC_SHIP_BILL_ITEM(ZshippingBillNo = 'SKT006', Item = '10')

                        // var sPathForItem = "ZRC_SHIP_BILL_HEAD('" + oData.ZshippingBillNo + "')/to_item";
                        var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                        var oModelForItems = new sap.ui.model.odata.ODataModel(
                            sService,
                            true
                        );
                        var oData = this.getView().getModel("oModelForHeader").getData();
                        this.updateCallForItem(oModelForItems, oData.ZshippingBillNo, aPayload)

                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }, 

            updateCallForItem: function (oModel, shippingBillNo, aPayload) {

                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    var sPath = "ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + shippingBillNo + "',Item='" + Payload.Item + "')";
                    promise = promise.then(function () { return that._promiseUpdateCallForEachItem(oModel, sPath, Payload) });
                });
                promise.then(function () {
                    that.getView().setBusy(false);
                })
                    .catch(function () {
                        that.getView().setBusy(false);
                    })

            },
            _promiseUpdateCallForEachItem: function (oModel, sPath, Payload) {
                var Item = Payload.Item;
                // this.getView().setBusy(true);
                oModel.update(sPath, Payload, {
                    success: function (oData, response) {

                        //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
                        this.onLicenseUpdate(Item);

                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            onLicenseUpdate: function (Item) {
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                // var aLicensePaylod = this.getView().getModel("oModelForLicenses").getData();

                this.shippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var aLicPayload = [];
                var aPath = [];
                var aLicNewItemPayload = [];
                var aPathItemNew = [];
                for (let index = 0; index < aItemPaylod.results.length; index++) {
                    if (aItemPaylod.results[index].Item === Item) {
                        const oItemPaylod = aItemPaylod.results[index];
                        if (aItemPaylod.results[index].Licenses) {
                            var aLicensePaylod = aItemPaylod.results[index].Licenses
                            for (let j = 0; j < aLicensePaylod.results.length; j++) {
                                const oLicensePaylod = aLicensePaylod.results[j];

                                // ZC_SHIP_BILL_LIC(ZshippingBillNo='SKT006',Item='10',Licences='101')
                                var licenseNo = oLicensePaylod.Licences;
                                var sPath = "ZC_SHIP_BILL_LIC(ZshippingBillNo='" + oHeaderPaylod.ZshippingBillNo + "',Item='" + oItemPaylod.Item + "',Licences='" + licenseNo + "')";
                                var sPathForNew = "ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + oHeaderPaylod.ZshippingBillNo + "',Item='" + oItemPaylod.Item + "')/to_SubItem"
                                var oLicPayload = {
                                    "Item": oItemPaylod.Item,
                                    "ZshippingBillNo": oHeaderPaylod.ZshippingBillNo,
                                    "Licences": oLicensePaylod.Licences,
                                    "Quantity": oLicensePaylod.Quantity
                                };
                                if (oLicensePaylod.new === "yes") {
                                    aLicNewItemPayload.push(oLicPayload);
                                    aPathItemNew.push(sPathForNew);
                                } else {
                                    aLicPayload.push(oLicPayload);
                                    aPath.push(sPath);
                                }




                            }
                        }
                    }


                }
                this.getView().setBusy(true);
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForLicense = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );





                var that = this;
                var promise = Promise.resolve();
                aLicPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(
                        function () {
                            return that.updateCallForEachItemLic(oModelForLicense, aPath[i], Payload)
                        }).then(
                            function () {
                                var promiseLicUpdate = Promise.resolve();
                                aLicNewItemPayload.forEach(function (Payload, i) { //copy local variables
                                    //Chain the promises
                                    promiseLicUpdate = promiseLicUpdate.then(
                                        function () {
                                            return that.createCallForEachItemLic(oModelForLicense, aPathItemNew[i], Payload)
                                        })

                                });
                                promiseLicUpdate.then(function () {


                                })
                                    .catch(function () {

                                    })
                            });

                });
                promise.then(function () {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("Shipping bill  " + that.shippingBillNo + " updated", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                window.history.go(-1);

                            }
                        }
                    });
                    // Create ends here
                })
                    .catch(function () {

                    })

            },
            updateCallForEachItemLic: function (oModelForLicense, sPath, ItemLicPayload) {

                oModelForLicense.update(sPath, ItemLicPayload, {
                    success: function (oData, response) {
                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // Message pop over handler methods
            messagehandler: function () {
                var that = this;
                var oLink = new Link({
                    text: "Show more information",
                    href: "http://sap.com",
                    target: "_blank"
                });

                var oMessageTemplate = new MessageItem({
                    type: '{type}',
                    title: '{title}',
                    description: '{description}',
                    subtitle: '{subtitle}',
                    counter: '{counter}',
                    markupDescription: '{markupDescription}',
                    link: oLink
                });

                var aMockMessages = [{
                    type: 'Error',
                    title: 'Error message',
                    description: 'First Error message description. \n' +
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }, {
                    type: 'Warning',
                    title: 'Warning without description',
                    description: ''
                }, {
                    type: 'Success',
                    title: 'Success message',
                    description: 'First Success message description',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }, {
                    type: 'Error',
                    title: 'Error message',
                    description: 'Second Error message description',
                    subtitle: 'Example of subtitle',
                    counter: 2
                }, {
                    type: 'Information',
                    title: 'Information message',
                    description: 'First Information message description',
                    subtitle: 'Example of subtitle',
                    counter: 1
                }];

                var oModel = new JSONModel();

                oModel.setData(aMockMessages);

                this.oMessageView = new MessageView({
                    showDetailsPageHeader: false,
                    itemSelect: function () {
                        oBackButton.setVisible(true);
                    },
                    items: {
                        path: "/",
                        template: oMessageTemplate
                    }
                });

                var oBackButton = new Button({
                    icon: IconPool.getIconURI("nav-back"),
                    visible: false,
                    press: function () {
                        that.oMessageView.navigateBack();
                        this.setVisible(false);
                    }
                });



                this.oMessageView.setModel(oModel);

                this.oDialog = new Dialog({
                    resizable: true,
                    content: this.oMessageView,
                    state: 'Error',
                    beginButton: new Button({
                        press: function () {
                            window.history.go(-1);
                            // this.getParent().close();
                        },
                        text: "Close"
                    }),
                    customHeader: new Bar({
                        contentLeft: [oBackButton],
                        contentMiddle: [
                            new Title({
                                text: "Error",
                                level: TitleLevel.H1
                            })
                        ]
                    }),
                    contentHeight: "50%",
                    contentWidth: "50%",
                    verticalScrolling: false
                });
            },

            handleDialogPress: function () {
                this.oMessageView.navigateBack();
                this.oDialog.open();
            }

        });
    });
