function openModal($, url, container, button) {
  return new Promise(function(fulfill, reject) {
    try {
      $.get(url, function(data) {
        $(container).empty();
        $(container).append(data);
        $(button).click();
        fulfill();
      })
      .fail(() => {
        reject(new Error('request to ' + url + ' failed'))
      })
    } catch(err) {
      reject(err)
    }
  });
}

module.exports = {
  open: openModal,
}
