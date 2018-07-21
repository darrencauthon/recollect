var newColor = 'orange';
$(document).ready(() => {
  $('#recollect-text-input, #newThing').keyup((el) => {
    const searchTerm = $(el.target).val().toLowerCase();
    highlightNodes(searchTerm);
  });

  $('#update-nodes').click(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    bringForward(searchTerm);
  });

  $('#newThing').keypress(event => {
    const typedTerm = $('#newThing').val();
    const ENTER = 13;

    if (event.which === ENTER) {
      if (findMatchingNodeIds(typedTerm).length === 0) {
        addNode(typedTerm);
        $('#newThing').val('');
      } else {
        bringForward(typedTerm);
      }
    }
  });
});

function bringForward(searchTerm) {
  _.each(nodesOnThePage._data, node => {
    nodesOnThePage.remove(node);
  });

  const exactRecordMatches = _.filter(getAllData().records, record => {
    return record.id.toLowerCase().search(searchTerm.toLowerCase()) > -1;
  });
  const recordsLinkedDirectly = findRecordsLinkedToThese(exactRecordMatches);
  const recordsLinkedBySkippingOne = findRecordsLinkedToThese(recordsLinkedDirectly);

  _.each(exactRecordMatches, record => {
    record.options = { color: { background: 'orange' } };
    addRecordToNodesOnThePage(record);
  });
  _.each(recordsLinkedDirectly, record => {
    record.options = { color: { background: '#42d242' } };
    addRecordToNodesOnThePage(record);
  });

  _.each(recordsLinkedBySkippingOne, record => {
    record.options = { color: { background: 'tan' } };
    addRecordToNodesOnThePage(record);
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
}

function findMatchingNodeIds(searchTerm) {
  var nodeIdsToUpdate = _.filter(_.keys(nodesOnThePage._data), (id) => {
    if (searchTerm.length > 0 && id.toLowerCase().search(searchTerm.toLowerCase()) > -1) {
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

function addRecordToNodesOnThePage(record) {
  const ids = _.keys(nodesOnThePage._data);
  if (!_.find(ids, nodeId => nodeId === record.id)) {
    const node = buildNodeFromRecord(record);
    nodesOnThePage.add(node);
  }
}
