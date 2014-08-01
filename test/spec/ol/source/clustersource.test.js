goog.provide('ol.test.source.ClusterSource');

<<<<<<< HEAD
goog.require('ol.source.Vector');

=======
>>>>>>> fbdc91e... tests
describe('ol.source.Cluster', function() {

  describe('constructor', function() {
    it('returns a cluster source', function() {
      var source = new ol.source.Cluster({
<<<<<<< HEAD
        projection: ol.proj.get('EPSG:4326'),
        source: new ol.source.Vector()
=======
        projection: ol.proj.get('EPSG:4326')
>>>>>>> fbdc91e... tests
      });
      expect(source).to.be.a(ol.source.Source);
      expect(source).to.be.a(ol.source.Cluster);
    });
  });
});

goog.require('ol.proj');
goog.require('ol.source.Cluster');
goog.require('ol.source.Source');
