$(document).ready(() => {
  $('#recollect-text-input').keyup(() => {
    const searchTerm = $('#recollect-text-input').val();
    const matchingNodes = _.filter(records, node => {
      return node.id.search(searchTerm) > -1
    });

    console.log('matchingNodes', matchingNodes);
  });
});
