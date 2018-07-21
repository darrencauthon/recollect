var newColor = '#' + Math.floor((Math.random() * 255 * 255 * 255)).toString(16);
$(document).ready(() => {
  $('#recollect-text-input').blur(() => {
    const searchTerm = $('#recollect-text-input').val();
    var nodeIdsToUpdate = _.filter(_.keys(nodes._data), (id) => {
      if (searchTerm.length > 0 && id.search(searchTerm) > -1) {
        return id;
      }
    });
    nodes.update(nodeIdsToUpdate.map(id => {
      return {
        id: id,
        color: { background: newColor },
        font: { size: 20 }
      };
    }));
  });
});
