function httpPost(value) {
  if (value === "#") {
    return;
  }
  const xhttp = new XMLHttpRequest()
  xhttp.onload = () => {
    document.getElementById("book_list").innerHTML = xhttp.responseText;
    document.getElementById("filter_type").value = value;
  };
  xhttp.open("POST", `/books/filter`, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`option=${value}`);
}

function callback() {
  alert("Filtering is done!");
}
