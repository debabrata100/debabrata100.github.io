const CONFIG = {
  productsPerCall: 20,
  fetchedItems: 0,
  getNextRange() {
    return {
      start: this.fetchedItems + 1,
      end: this.fetchedItems + this.productsPerCall,
    };
  },
};

let intersectionObserver;

function showNotification() {
  if (CONFIG.productsPerCall === CONFIG.fetchedItems) {
    // dont show notification for inital products
    return;
  }
  const notificationContainer = document.querySelector(
    "#notification-container"
  );
  const notification = document.querySelector(".notification");
  notification.innerText = `${CONFIG.productsPerCall} more products added, reached ${CONFIG.fetchedItems}`;
  notificationContainer.classList.add("notify");
  const timeoutId = setTimeout(() => {
    notificationContainer.classList.remove("notify");
    clearTimeout(timeoutId);
  }, 1000);
}

// Simulate loading products from a sever using promise and setTimeout
async function fetchProducts(start, end) {
  return new Promise((resolve) => {
    let products = [];
    for (let i = start; i <= end; i++) {
      products.push({
        id: 1000 + i,
        name: `Product - ${i}`,
      });
    }
    setTimeout(() => {
      resolve(products);
    }, 100);
  });
}
async function loadProducts(start, end) {
  const products = await fetchProducts(start, end);
  const root = document.querySelector("#root");
  let item;
  products.forEach(({ name }, i) => {
    item = document.createElement("div");
    item.classList.add("item");
    item.innerText = name;
    root.appendChild(item);
    if (i === CONFIG.productsPerCall - 6) {
      // Remove existing sentinel
      let sentinel = document.querySelector("#sentinel");
      if (sentinel) {
        root.removeChild(sentinel);
      }
      // Insert new sentinel 6th position from end
      sentinel = document.createElement("div");
      sentinel.id = "sentinel";
      root.appendChild(sentinel);
    }
  });
  CONFIG.fetchedItems = end;
  addInfiniteScroll();
  showNotification();
}

function loadMore() {
  const { start, end } = CONFIG.getNextRange();
  loadProducts(start, end);
}

function unregisterIntersectionObserver() {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
}

// Handle intersection
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      unregisterIntersectionObserver();
      loadMore();
    }
  });
}

// Register intersection observer and observe sentinel element
function addInfiniteScroll() {
  intersectionObserver = new IntersectionObserver(handleIntersection);
  const sentinel = document.querySelector("#sentinel");
  intersectionObserver.observe(sentinel);
}

document.querySelector("#load-more").addEventListener("click", () => {
  // a demo how to load new products manually by clicking load more
  loadMore();
});

function main() {
  const { start, end } = CONFIG.getNextRange();
  // load initial products
  loadProducts(start, end);
}

main();
