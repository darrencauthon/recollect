var newColor = 'orange';
$(document).ready(() => {
  $('#recollect-text-input').keyup(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    highlightNodes(searchTerm);
  });

  $('#update-nodes').click(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    const matchingNodeIds = findMatchingNodeIds(searchTerm);


    const nodesToRemove = _.reject(nodesOnThePage._data, node => {
      return _.find(matchingNodeIds, id => id === node.id);
    });
    _.each(nodesToRemove, node => {
      nodesOnThePage.remove(node);
    });


    _.each(findNodesLinkedToNodeIds(matchingNodeIds), node => {
      nodesOnThePage.add(buildNodeFromRecord(node));
    });

    function findNodesLinkedToNodeIds(nodeIds) {
      return _.chain(nodeIds)
        .map(id => nodesLinkedTo(id))
        .flatten()
        .value();
    }

    function nodesLinkedTo(nodeId) {
      var relationships = getAllRelationships();
      return _.chain(relationships)
        .filter(relationship => {
          return (relationship.from === nodeId) || (relationship.to === nodeId);
        })
        .map(relationship => {
          if (relationship.from === nodeId) {
            return relationship.to;
          } else {
            return relationship.from
          }
        })
        .map(nodeId => {
          return _.find(getAllData().records, record => record.id === nodeId)
        })
        .value();
    };
  });
});

function findMatchingNodeIds(searchTerm) {
  var nodeIdsToUpdate = _.filter(_.keys(nodesOnThePage._data), (id) => {
    if (searchTerm.length > 0 && id.toLowerCase().search(searchTerm) > -1) {
      return id;
    }
  });

  return nodeIdsToUpdate;
}

function highlightNodes(searchTerm) {
  var nodeIdsToUpdate = findMatchingNodeIds(searchTerm);

  nodesOnThePage.update(_.keys(nodesOnThePage._data).map(id => {
    return {
      id: id,
      color: null,
      font: null,
    };
  }));
  nodesOnThePage.update(nodeIdsToUpdate.map(id => {
    return {
      id: id,
      color: { background: newColor },
      font: { size: 20 }
    };
  }));
}
