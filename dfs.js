'use strict';

(function () {
  var greuler = window.greuler;

  window.d3.json('data/map.json', function (error, data) {
    var instance = greuler({
      target: '#map',
      height: 3000,
      width: 3000,
      animationTime: 100,
      data: data
    }).update();

    window.dfs = function () {
      var player = new greuler.player.Generator(instance);
      player.run(function *algorithm(instance) {
        var visited = [];

        function *dfs(u, p) {
          yield function () {
            instance.selector.highlightNode({ id: u });
          };
          visited[u] = true;

          var adjacent = instance.graph.getAdjacentNodes({ id: u });
          for (var i = 0; i < adjacent.length; i += 1) {
            var v = adjacent[i].id;

            if (v === p) { continue; }

            if (!visited[v]) {
              yield function () {
                instance.selector.traverseAllEdgesBetween({ source: u, target: v });
              };
              yield *dfs(v, u);
            } else {
              yield function () {
                instance.selector.traverseAllEdgesBetween(
                  { source: u, target: v },
                  { keepStroke: false }
                )
                  .transition()
                  .attr('opacity', 0.3);
              };
            }
          }

          yield function () {
            instance.selector.getNode({ id: u })
              .transition()
              .attr('fill', 'black');
          };
        }

        yield *dfs(0, -1);
      });
    };
  });
})();