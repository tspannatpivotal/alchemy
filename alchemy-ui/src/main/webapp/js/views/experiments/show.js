// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore', 'backbone', 'flot', 'flotpie', 'bootstrap', 'libs/text!templates/experiments/_show.html', 'views/treatments/new', 'models/experiment_update'], function($, _, Backbone, flot, flotpie, bootstrap, showTemplate, TreatmentFormView, ExperimentUpdate) {
    var ShowView;
    return ShowView = Backbone.View.extend({
      events: {
        "click .add-more-treatment": "newTreatmentForm",
        "click .activate-experiment": "activateExperiment",
        "click .deactivate-experiment": "deactivateExperiment"
      },
      initialize: function() {
        this.listenTo(this.model, "sync", this.render);
        return this.model.fetch();
      },
      render: function() {
        var allocations, compiledTemplate, content, data, totalAllocated, treatment_allocation_map, treatments;
        treatment_allocation_map = _.reduce(this.model.get("treatments"), (function(_this) {
          return function(arr, t) {
            arr.push({
              name: t.name,
              description: t.description
            });
            return arr;
          };
        })(this), []);
        treatment_allocation_map = _.each(treatment_allocation_map, (function(_this) {
          return function(t) {
            var found;
            return t.size = (found = _.find(_this.model.get("allocations"), function(a) {
              return a.treatment === t.name;
            })) && found.size || 0;
          };
        })(this));
        compiledTemplate = _.template(showTemplate, {
          model: this.model,
          treatment_allocation_map: treatment_allocation_map
        });
        content = this.$el.html(compiledTemplate);
        $("#page-content").html(content);
        $(".js-page-title").text("Experiment " + (this.model.get('name')));
        $(".js-page-subtitle").text(this.model.get('description'));
        treatments = this.model.get("treatments");
        allocations = this.model.get("allocations");
        if (!!allocations && allocations.length > 0) {
          totalAllocated = _.reduce(allocations, function(sum, a) {
            return sum + a.size;
          }, 0);
          data = _.map(allocations, function(a) {
            return {
              label: _.find(treatments, function(t) {
                return a.treatment === t.name;
              }).description,
              data: a.size
            };
          });
          data.push({
            label: "unallocated",
            data: 100 - totalAllocated,
            color: "#979797"
          });
          $.plot($(".alloc-pie-chart"), data, {
            series: {
              pie: {
                show: true
              }
            },
            grid: {
              hoverable: true,
              clickable: true
            },
            legend: {
              show: false
            }
          });
        }
        return this.delegateEvents();
      },
      newTreatmentForm: function(e) {
        return new TreatmentFormView({
          model: this.model
        });
      },
      activateExperiment: function(e) {
        var experimentUpdate;
        experimentUpdate = new ExperimentUpdate({
          active: true
        });
        return experimentUpdate.sync("create", experimentUpdate, {
          url: "/api/experiments/" + (this.model.get('name')),
          complete: (function(_this) {
            return function(jqXHR, textStatus) {
              if (jqXHR.status === 204) {
                return _this.model.fetch();
              } else {
                return alert('Failed');
              }
            };
          })(this)
        });
      },
      deactivateExperiment: function(e) {
        var experimentUpdate;
        experimentUpdate = new ExperimentUpdate({
          active: false
        });
        return experimentUpdate.sync("create", experimentUpdate, {
          url: "/api/experiments/" + (this.model.get('name')),
          complete: (function(_this) {
            return function(jqXHR, textStatus) {
              if (jqXHR.status === 204) {
                return _this.model.fetch();
              } else {
                return alert('Failed');
              }
            };
          })(this)
        });
      }
    });
  });

}).call(this);
