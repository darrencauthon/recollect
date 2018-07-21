var newColor = 'orange';
$(document).ready(() => {
  $('#recollect-text-input').keyup(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    highlightNodes(searchTerm);
  });

  $('#update-nodes').click(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();

    _.each(nodesOnThePage._data, node => {
      nodesOnThePage.remove(node);
    });

    const exactRecordMatches = _.filter(getAllData().records, record => {
      return record.id.toLowerCase().search(searchTerm) > -1;
    });
    const recordsLinkedDirectly = findRecordsLinkedToThese(exactRecordMatches);

    _.each(exactRecordMatches, record => {
      nodesOnThePage.add(buildNodeFromRecord(record));
    });
    _.each(recordsLinkedDirectly, record => {
      nodesOnThePage.add(buildNodeFromRecord(record));
    });


    function findRecordsLinkedToThese(records) {
      return _.chain(records)
        .map(record => findRecordsLinkedTo(record))
        .flatten()
        .value();
    }

    function findRecordsLinkedTo(record) {
      var relationships = getAllRelationships();
      return _.chain(relationships)
        .filter(relationship => {
          return (relationship.from === record.id) || (relationship.to === record.id);
        })
        .map(relationship => {
          if (relationship.from === record.id) {
            return relationship.to;
          } else {
            return relationship.from
          }
        })
        .map(recordId => {
          return _.find(getAllData().records, record => recordId === record.id)
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
