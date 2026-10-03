(function () {
  document.documentElement.classList.add("js");
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

  var fold = document.querySelector(".nav__fold");
  if (fold) {
    fold.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { fold.removeAttribute("open"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fold.removeAttribute("open");
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__list a[href^='#']"));
  var spine = document.querySelector("[data-spine]");
  var labeled = Array.prototype.slice.call(document.querySelectorAll("[data-spine-label]"));
  if (labeled.length && "IntersectionObserver" in window) {
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

  function showPlate(item) {
    var id = item.getAttribute("aria-controls");
    if (!id) return;
    var plate = document.getElementById(id);
    if (!plate) return;
    var parent = plate.parentElement;
    Array.prototype.forEach.call(parent.children, function (el) {
      var on = el === plate;
      el.classList.toggle("is-on", on);
      if (on && !reduce) {
        el.classList.remove("is-in");
        void el.offsetWidth;
        el.classList.add("is-in");
      }
    });
  }

  function replayStrike(root) {
    if (reduce || !root) return;
    var s = root.querySelector("s");
    if (!s) return;
    s.classList.remove("is-drawn");
    void s.offsetWidth;
    s.classList.add("is-drawn");
  }

  if (!reduce) {
    var cut = document.querySelector(".cut");
    if (cut && "IntersectionObserver" in window) {
      var cutWatch = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        cutWatch.disconnect();
        replayStrike(cut);
      }, { threshold: 0.45 });
      cutWatch.observe(cut);
    }
    var strata = document.querySelector(".strata");
    if (strata && "IntersectionObserver" in window) {
      var layerWatch = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        layerWatch.disconnect();
        strata.classList.add("is-grown");
      }, { threshold: 0.4 });
      layerWatch.observe(strata);
    }
  }

  var specName = document.querySelector("[data-spec-name]");
  var specCmp = document.querySelector("[data-spec-cmp]");
  bindRadios(document.querySelector("[data-metrics]"), function (item) {
    if (specName) specName.textContent = item.getAttribute("data-metric");
  });
  bindRadios(document.querySelector("[data-compare]"), function (item) {
    if (specCmp) specCmp.textContent = item.getAttribute("data-compare-value");
  });

  ["[data-figures]", "[data-dial]", "[data-roles]"].forEach(function (sel) {
    bindRadios(document.querySelector(sel), showPlate);
  });
  function drawSkill(item) {
    showPlate(item);
    if (reduce) return;
    var plate = document.getElementById(item.getAttribute("aria-controls"));
    if (!plate) return;
    plate.classList.remove("is-drawn");
    void plate.offsetWidth;
    plate.classList.add("is-drawn");
  }
  bindRadios(document.querySelector("[data-skills]"), drawSkill);
  if (!reduce) {
    var openingSkill = document.querySelector("[data-skills] [aria-checked='true']");
    if (openingSkill) drawSkill(openingSkill);
  }
  bindRadios(document.querySelector("[data-stages]"));

  var flowWrap = document.querySelector("[data-flow]");
  var traceBtn = document.querySelector("[data-trace]");
  if (flowWrap && traceBtn) {
    var steps = Array.prototype.slice.call(flowWrap.querySelectorAll(".flow li"));
    var bead = flowWrap.querySelector(".flow__bead");
    var playing = false;
    var timer = null;

    function moveBead(index) {
      if (!bead || reduce) return;
      var track = flowWrap.querySelector(".flow__track");
      var li = steps[index];
      var tr = track.getBoundingClientRect();
      var lr = li.getBoundingClientRect();
      var vertical = tr.height > tr.width + 8;
      if (vertical) {
        var y = lr.top + lr.height / 2 - tr.top - bead.offsetHeight / 2;
        bead.style.transform = "translate3d(0," + Math.max(0, y) + "px,0)";
      } else {
        var x = lr.left + lr.width / 2 - tr.left - bead.offsetWidth / 2;
        bead.style.transform = "translate3d(" + Math.max(0, x) + "px,0,0)";
      }
    }

    function finishLit() {
      steps.forEach(function (step) { step.classList.add("is-on"); });
      if (bead) moveBead(steps.length - 1);
    }

    function trace() {
      if (reduce) {
        finishLit();
        return;
      }
      if (playing) return;
      playing = true;
      traceBtn.disabled = true;
      if (timer) clearTimeout(timer);
      steps.forEach(function (step) { step.classList.remove("is-on"); });
      var i = 0;
      function next() {
        steps.forEach(function (step, n) { step.classList.toggle("is-on", n <= i); });
        moveBead(i);
        i += 1;
        if (i < steps.length) {
          timer = setTimeout(next, 560);
        } else {
          timer = setTimeout(function () {
            playing = false;
            traceBtn.disabled = false;
          }, 280);
        }
      }
      next();
    }

    traceBtn.addEventListener("click", trace);
    window.addEventListener("resize", function () {
      var current = steps.filter(function (step) { return step.classList.contains("is-on"); });
      if (current.length) moveBead(steps.indexOf(current[current.length - 1]));
    });

    if (!reduce && "IntersectionObserver" in window) {
      var traced = false;
      var watch = new IntersectionObserver(function (entries) {
        if (traced || !entries[0].isIntersecting) return;
        traced = true;
        watch.disconnect();
        trace();
      }, { threshold: 0.55 });
      watch.observe(flowWrap);
    }
  }
})();
