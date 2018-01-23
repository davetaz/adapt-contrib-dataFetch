define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var dataFetch = ComponentView.extend({

        preRender: function() {
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();
            this.getData();
            this.setupInview();
        },

        getData: function() {
            console.log('In HERE');
            sources = this.model.get('dataSources');
            $.each(sources, function(key,value) {
                source = value["sourceURL"];
                $.getJSON( source , function( data ) {
                      id = value["selectID"];
                      selectValue = value["selectValue"];
                      path = value["dataPath"];
                      selectClass = value["dataKey"];
                      buttonText = value["buttonText"];
                      datapoints = data;
                      if (path) {
                        datapoints = data[path];  
                      }
                      var items = [];
                      $.each( datapoints, function( key, val ) {
                        items.push( "<option id='" + val[id] + "' value='"+val[selectValue]+"'>" + val[selectValue] + "</option>" );
                      });
                     
                      $( "<select/>", {
                        "class": selectClass,
                        html: items.join( "" )
                      }).appendTo( ".dataFetch-body-inner" );
                    }
                );
            });
        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();

            if (!selector) {
                this.setCompletionStatus();
            } else {
                this.model.set('inviewElementSelector', selector);
                this.$(selector).on('inview', _.bind(this.inview, this));
            }
        },

        /**
         * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
         */
        getInviewElementSelector: function() {
            if(this.model.get('body')) return '.component-body';

            if(this.model.get('instruction')) return '.component-instruction';
            
            if(this.model.get('displayTitle')) return '.component-title';

            return null;
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('inviewElementSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        },

        remove: function() {
            if(this.model.has('inviewElementSelector')) {
                this.$(this.model.get('inviewElementSelector')).off('inview');
            }
            
            ComponentView.prototype.remove.call(this);
        }
    },
    {
        template: 'dataFetch'
    });

    Adapt.register('dataFetch', dataFetch);

    return dataFetch;
});
