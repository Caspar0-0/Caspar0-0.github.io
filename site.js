(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var bar = document.querySelector(".progress");
  if (bar && !reduce) {
    var tick = function () {
      var root = document.documentElement;
      var max = root.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  var spine = document.querySelector("[data-spine]");
  var labeled = Array.prototype.slice.call(document.querySelectorAll("[data-spine-label]"));

  if ((sections.length || labeled.length) && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (a) {
          var on = id && a.getAttribute("href") === "#" + id;
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
        if (spine && entry.target.getAttribute("data-spine-label")) {
          spine.textContent = entry.target.getAttribute("data-spine-label");
        }
      });
    }, { rootMargin: "-40% 0px -45% 0px", threshold: 0 });
    labeled.forEach(function (section) { spy.observe(section); });
  }

  function bindRadios(root, onChange) {
    if (!root) return;
    var items = Array.prototype.slice.call(root.querySelectorAll("[role='radio']"));
    function select(item) {
      items.forEach(function (el) {
        var on = el === item;
        el.setAttribute("aria-checked", on ? "true" : "false");
        el.tabIndex = on ? 0 : -1;
      });
      if (onChange) onChange(item);
    }
    items.forEach(function (el) {
      el.addEventListener("click", function () { select(el); });
      el.addEventListener("keydown", function (e) {
        var i = items.indexOf(el);
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % items.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + items.length) % items.length;
        if (n === null) return;
        e.preventDefault();
        items[n].focus();
        select(items[n]);
      });
    });
  }

  var specName = document.querySelector("[data-spec-name]");
  var specCmp = document.querySelector("[data-spec-cmp]");
  bindRadios(document.querySelector("[data-metrics]"), function (item) {
    if (specName) specName.textContent = item.getAttribute("data-metric");
  });
  bindRadios(document.querySelector("[data-compare]"), function (item) {
    if (specCmp) specCmp.textContent = item.getAttribute("data-compare-value");
  });

  bindRadios(document.querySelector("[data-stages]"));

  var flow = document.querySelector(".flow");
  var traceBtn = document.querySelector("[data-trace]");
  if (flow && traceBtn && !reduce) {
    var steps = Array.prototype.slice.call(flow.querySelectorAll("li"));
    var playing = false;
    function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
    function trace() {
      if (playing) return Promise.resolve();
      playing = true;
      traceBtn.disabled = true;
      steps.forEach(function (step) { step.classList.remove("is-on"); });
      var chain = Promise.resolve();
      steps.forEach(function (step) {
        chain = chain.then(function () {
          steps.forEach(function (s) { s.classList.remove("is-on"); });
          step.classList.add("is-on");
          return wait(420);
        });
      });
      return chain.then(function () {
        return wait(420);
      }).then(function () {
        steps.forEach(function (step) { step.classList.remove("is-on"); });
        playing = false;
        traceBtn.disabled = false;
      });
    }
    traceBtn.addEventListener("click", trace);
  }
})();
