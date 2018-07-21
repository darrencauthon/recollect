var newColor = 'orange';
$(document).ready(() => {
  $('#recollect-text-input').keyup(() => {
    const searchTerm = $('#recollect-text-input').val().toLowerCase();
    var nodeIdsToUpdate = _.filter(_.keys(nodesOnThePage._data), (id) => {
      if (searchTerm.length > 0 && id.toLowerCase().search(searchTerm) > -1) {
        return id;
      }
    });
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
  });
});
