$(document).ready(() => {
  $('#blank-slate-button').click(() => {
    removeAllNodesFromView();
  });

  $('#all-connections-button').click(() => {
    bringAllNodesIntoView();
  });

  inputNetwork.on('click', function (params) {
    if(params.nodes.length > 0) {
      var nodeId = params.nodes[0];
      contractTextForAllNodes();
      expandTextForNode(nodeId);
    }
  });

  $('#update-nodes').click(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    bringForward(searchTerm);
  });

  $('#recollect-text-input').keyup(event => {
    const typedTerm = $('#recollect-text-input').val();
    const ENTER = 13;

    if (event.which === ENTER) {
      if (findMatchingNodeIds(typedTerm).length === 0) {
        addNode(typedTerm);
        $('#recollect-text-input').val('');
      } else {
        bringForward(typedTerm);
      }
    } else {
      const searchTerm = typedTerm.toLowerCase();
      highlightNodes(searchTerm);
    }
  });
});

function expandTextForNode(nodeId) {
  nodesOnThePage.update([
    {
      id: nodeId,
      label: findRecordById(nodeId).id
    }
  ]);
}

function contractTextForAllNodes() {
  _.each(getAllData().records, record => {

    if (!nodesOnThePage._data[record.id]) {
      return;
    }


    nodesOnThePage.update([
      {
        id: record.id,
        label: buildLabel(record.id),
      }
    ]);
  });
}

function removeAllNodesFromView() {
  _.each(nodesOnThePage._data, node => {
    nodesOnThePage.remove(node);
  });
}

function bringAllNodesIntoView() {
  _.each(getAllData().records, record => {
    const node = buildNodeFromRecord(record);
    nodesOnThePage.remove(node);
    nodesOnThePage.add(node);
  });
}

function bringForward(searchTerm) {
  removeAllNodesFromView();

  const exactRecordMatches = _.filter(getAllData().records, record => {
    return record.id.toLowerCase().search(searchTerm.toLowerCase()) > -1;
  });
  const recordsLinkedDirectly = findRecordsLinkedToThese(exactRecordMatches);
  const recordsLinkedBySkippingOne = findRecordsLinkedToThese(recordsLinkedDirectly);

  _.each(exactRecordMatches, record => {
    record.options = { color: { border: FIRST_LEVEL_BORDER_COLOR_CODE, background: FIRST_LEVEL_BG_COLOR_CODE }, font: { size: FIRST_LEVEL_FONT_SIZE, color: FIRST_LEVEL_FG_COLOR_CODE } };
    addRecordToNodesOnThePage(record);
  });
  _.each(recordsLinkedDirectly, record => {
    record.options = { color: { border: SECOND_LEVEL_BORDER_COLOR_CODE, background: SECOND_LEVEL_BG_COLOR_CODE }, font: { size: SECOND_LEVEL_FONT_SIZE, color: SECOND_LEVEL_FG_COLOR_CODE } };
    addRecordToNodesOnThePage(record);
  });

  _.each(recordsLinkedBySkippingOne, record => {
    record.options = { color: { border: THIRD_LEVEL_BORDER_COLOR_CODE, background: THIRD_LEVEL_BG_COLOR_CODE }, font: { size: SECOND_LEVEL_FONT_SIZE, color: THIRD_LEVEL_FG_COLOR_CODE } };
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

function findRecordById(id) {
  return _.find(getAllData().records, record => record.id === id);
}


function highlightNodes(searchTerm) {
  var nodeIdsToUpdate = findMatchingNodeIds(searchTerm);

  nodesOnThePage.update(_.keys(nodesOnThePage._data).map(id => {
    return {
      id: id,
      color: defaultColor
    };
  }));
  nodesOnThePage.update(nodeIdsToUpdate.map(id => {
    return {
      id: id,
      color: { background: HIGHLIGHT_BG_COLOR, border: HIGHLIGHT_BORDER_COLOR },
      font: { size: HIGHLIGHT_FONT_SIZE, color: HIGHLIGHT_FG_COLOR }
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
