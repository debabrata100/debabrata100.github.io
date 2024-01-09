var enableResponsiveness = false;
!(function () {
  const userInput = document.getElementById("user-input");
  document
    .querySelector("#toggle-responsive")
    .addEventListener("change", function () {
      enableResponsiveness = !enableResponsiveness;
      console.log(enableResponsiveness);
    });

  userInput.addEventListener("keyup", function (event) {
    const value = event.target.value;
    if (!value) {
      clearResult();
    } else {
      if (!enableResponsiveness) {
        printResult(value);
        return;
      }
      // Use `setTimeout` to defer all other work until at least the next
      // frame by queuing a task in a `requestAnimationFrame()` callback.
      requestAnimationFrame(function () {
        setTimeout(function () {
          printResult(value);
        }, 0);
      });
    }
  });
  function clearResult() {
    const resultList = document.getElementById("result-list");
    resultList.innerHTML = "";
  }
  function printResult(value) {
    const resultList = document.getElementById("result-list");
    for (let i = 0; i < 2; i++) {
      let start = Date.now();
      while (Date.now() - start < 100) {
        // Simulate a slow task
      }
      const li = document.createElement("li");
      li.innerText = `result ${value} - ${i + 1}`;
      resultList.appendChild(li);
    }
  }
})();
