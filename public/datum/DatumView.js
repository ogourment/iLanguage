define([
    "use!backbone", 
    "use!handlebars", 
    "text!datum/datum.handlebars",
    "confidentiality_encryption/Confidential",
    "datum/Datum",
    "datum/DatumField",
    "datum/DatumFieldView",
    "datum/DatumState",
    "datum/DatumStateView",
    "datum/DatumTags",
    "datum/DatumTagsView",
    "libs/Utils"
], function(
    Backbone, 
    Handlebars, 
    datumTemplate, 
    Confidential,
    Datum, 
    DatumField, 
    DatumFieldView,
    DatumState,
    DatumStateView, 
    DatumTags, 
    DatumTagsView
) {
  var DatumView = Backbone.View.extend(
  /** @lends DatumView.prototype */
  {
    /**
     * @class The layout of a single Datum. It contains a datum state,
     *        datumFields, datumTags and a datum menu.
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      // Create a DatumstateView
      this.stateview = new DatumStateView({
        model : this.model.get("state")
      });

      // Create a DatumTagView
      this.tagsview = new DatumTagsView({
        model : this.model.get("datumTag")
      });

      // Create a DatumFieldView
      this.fieldview = new DatumFieldView({
        model : this.model.get("datumField")
      });

      // If the model changes, re-render
      this.model.bind('change', this.render, this);
    },

    /**
     * The underlying model of the DatumView is a Datum.
     */
    model : Datum,

    /**
     * The stateview is a partial of the DatumView.
     */
    stateview : DatumStateView,

    /**
     * The tagview is a partial of the DatumView.
     */
    tagsview : DatumTagsView,

    /**
     * The fieldview is a partial of the DatumView.
     */
    fieldview : DatumFieldView,

    /**
     * Events that the DatumView is listening to and their handlers.
     */
    events : {
      "click #new" : "newDatum",
      "click .icon-lock" : "encryptDatum",
      "click .icon-unlock" : "decryptDatum",
      "blur .utterance" : "updateUtterance",
      "blur .morphemes" : "updateMorphemes",
      "blur .gloss" : "updateGloss",
      "blur .translation" : "updateTranslation",
      "change" : "updatePouch",
      "click .datum_state_select" : "renderState"
    },

    /**
     * The Handlebars template rendered as the DatumView.
     */
    template : Handlebars.compile(datumTemplate),

    /**
     * Renders the DatumView and all of its partials.
     */
    render : function() {
      Utils.debug("DATUM render: " + this.el);
      if (this.model != undefined) {

        // Display the DatumView
        this.setElement($("#datum-view"));
        $(this.el).html(this.template(this.model.toJSON()));

        this.stateview.render();
      } else {
        Utils.debug("\tDatum model was undefined");
      }

      return this;
    },
    renderState : function() {
      if (this.stausview != undefined) {
        this.stateview.render();
      }
    },
    needsSave : false,

    /**
     * Change the model's utterance.
     */
    updateUtterance : function() {
      this.model.set("utterance", $(".utterance").val());
    },

    /**
     * Change the model's morpheme.
     */
    updateMorphemes : function() {
      this.model.set("morphemes", $(".morphemes").val());
    },

    /**
     * Chnage the model's gloss.
     */
    updateGloss : function() {
      this.model.set("gloss", $(".gloss").val());
    },

    /**
     * Change the model's translation.
     */
    updateTranslation : function() {
      this.model.set("translation", $(".translation").val());
    },

    /**
     * Registers this datum to be saved in PouchDB.
     */
    updatePouch : function() {
      this.needsSave = true;
    },
    /**
     * Encrypts the datum if it is confidential
     * 
     * @returns {Boolean}
     */
    encryptDatum : function() {
      // console.log("Fake encrypting");
      var confidential = appView.corpusView.model.confidential;

      if (confidential == undefined) {
        appView.corpusView.model.confidential = new Confidential();
        confidential = appView.corpusView.model.confidential;
      }

      this.model.set("utterance", confidential.encrypt(this.model
          .get("utterance")));
      this.model.set("morphemes", confidential.encrypt(this.model
          .get("morphemes")));
      this.model.set("gloss", confidential.encrypt(this.model.get("gloss")));
      this.model.set("translation", confidential.encrypt(this.model
          .get("translation")));

      // this.model.set("utterance", this.model.get("utterance").replace(/[^
      // -.]/g,"x"));
      // this.model.set("morphemes", this.model.get("morphemes").replace(/[^
      // -.]/g,"x"));
      // this.model.set("gloss", this.model.get("gloss").replace(/[^
      // -.]/g,"x"));
      // this.model.set("translation", this.model.get("translation").replace(/[^
      // -.]/g,"x"));
      this.render();
      $(".icon-lock").toggleClass("icon-lock icon-unlock");

      // console.log(confidential);
      // this.model.set()
    },
    decryptDatum : function() {
      var confidential = appView.corpusView.model.confidential;
      this.model.set("utterance", confidential.decrypt(this.model
          .get("utterance")));
      this.model.set("morphemes", confidential.decrypt(this.model
          .get("morphemes")));
      this.model.set("gloss", confidential.decrypt(this.model.get("gloss")));
      this.model.set("translation", confidential.decrypt(this.model
          .get("translation")));
      this.render();
      $(".icon-lock").toggleClass("icon-lock icon-unlock");

    },
    newDatum : function() {
      /*
       * First, we build a new datum model, this datum model then asks if it
       * belongs to a session if it belongs to a session it goes ahead and
       * renders a new datum if it does not belong to a session, it builds a new
       * session and renders a new session view. after the new session is sent
       * to pouch, then a new datumview can be rendered.
       */

      // var newDatum = new DatumView({model: new Datum()});
      // $("#fullscreen-datum-view").append(newDatum.render().el);
      // var sID = this.newDatum.get("sessionID");
      // console.log(sID);
      //      	
      // if(newDatum.sessionID == 0){
      // var newSession = new SessionView({model: new Session()});
      // $("#new-session-view").append(newSession.render().el);
      //
      // }
      Utils.debug("I'm a new datum!");
      return true;
    },

    /**
     * If the model needs to be saved, saves it.
     */
    saveScreen : function() {
      if (this.needsSave) {
        // Change the needsSave flag before saving just in case another change
        // happens
        // before the saving is done
        this.needsSave = false;

        Utils.debug("Saving the Datum");
        this.model.save(null, {
          success : function(model, response) {
            if (location.hash.indexOf("/new") != -1) {
              location.hash = location.hash.replace("/new", "/" + model.id);
            }
          }
        });
      }
    }

  });

  return DatumView;
});